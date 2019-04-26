<template>
  <section class="control">
    <div class="reading">
      <header>
        <h4>Humidity</h4>
        <span
          :class="['state', state]"
          :title="state"
        ></span>
      </header>
      <h1>{{h}}<sup>%</sup></h1>
    </div>
    <div class="chart">
      <chart
        label="%"
        evt="humidity:chart:update"
      />
    </div>
  </section>
</template>

<script>
import chart from "./chart.vue";
import bus from "../bus";
import parseState from "../utils/stateParser";
import manageHistory from "../utils/historyManager";

export default {
  data() {
    return {
      values: [],
      state: "disabled",
      h: -1
    };
  },
  components: {
    chart
  },
  methods: {
    poll() {
      this.$http.get("http://192.168.0.18:3000/api/humidity").then(
        response => {
          this.h = response.body.h;
          this.state = parseState(response.body.state);
          this.values = manageHistory(this.values, response.body.history);

          bus.$emit("humidity:chart:update", this.values);
        },
        err => {
          console.log(err);
        }
      );
    }
  },
  mounted() {
    this.poll();

    setInterval(() => {
      this.poll();
    }, 1000 * 10);
  }
};
</script>
<template>
  <section class="control">
    <div class="reading">
      <header>
        <h4>Temperature</h4>
        <span
          :class="['state', state]"
          :title="state"
        ></span>
      </header>
      <h1>{{f}}<sup>&deg;F</sup></h1>
      <footer>{{c}}<sup>&deg;C</sup></footer>
    </div>
    <div class="chart">
      <chart
        label="F"
        evt="temperature:chart:update"
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
      f: -1,
      c: -1
    };
  },
  components: {
    chart
  },
  methods: {
    poll() {
      this.$http.get("http://192.168.0.18:3000/api/temperature").then(
        response => {
          this.f = response.body.f;
          this.c = response.body.c;
          this.state = parseState(response.body.state);
          this.values = manageHistory(this.values, response.body.history);

          bus.$emit("temperature:chart:update", this.values);
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
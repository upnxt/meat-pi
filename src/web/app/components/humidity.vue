<template>
  <section class="control">
    <div class="reading">
      <header>
        <h4>Humidity</h4>
        <span
          :class="['status', state]"
          :title="state"
        ></span>
      </header>
      <h1>{{h}}%</h1>
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

export default {
  data() {
    return {
      values: [0],
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
          this.values.push(response.body.h);
          this.h = response.body.h;

          if (response.body.state < 0) {
            this.state = "disabled";
          } else {
            this.state = response.body.state == 0 ? "off" : "on";
          }

          if (this.values > 20) {
            this.values = this.values.slice(1);
          }

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
    }, 1000 * 30);
  }
};
</script>

<style scoped>
</style>
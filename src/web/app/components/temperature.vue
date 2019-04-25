<template>
  <section class="control">
    <div class="reading">
      <header>
        <h4>Temperature</h4>
        <span
          :class="['status', state]"
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

export default {
  data() {
    return {
      values: [0],
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
          this.values.push(response.body.f);
          this.f = response.body.f;
          this.c = response.body.c;

          if (response.body.state < 0) {
            this.state = "disabled";
          } else {
            this.state = response.body.state == 0 ? "off" : "on";
          }

          if (this.values > 20) {
            this.values = this.values.slice(1);
          }

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
    }, 1000 * 30);
  }
};
</script>

<style scoped>
</style>
<script>
import { Line } from "vue-chartjs";
import bus from "../bus";

export default {
  extends: Line,
  props: ["label", "evt"],
  data: () => ({
    chartdata: {
      labels: [""],
      datasets: [
        {
          //   backgroundColor: "#ff0000",
          data: [0]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              suggestedMin: 32,
              beginAtZero: false,
              steps: 2
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ]
      }
    }
  }),
  mounted() {
    this.renderChart(this.chartdata, this.options);

    bus.$on(this.evt, data => {
      this.chartdata.labels = data.map(v => {
        return v + this.label;
      });

      this.chartdata.datasets[0].data = data;
      this.$data._chart.update();
    });
  }
};
</script>
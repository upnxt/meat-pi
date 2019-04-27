<script>
import { Line } from "vue-chartjs";
import bus from "../bus";

export default {
  extends: Line,
  props: ["label", "evt"],
  data: () => ({
    chartdata: {
      labels: [new Date()],
      datasets: [
        {
          backgroundColor: "#e6e6e6",
          borderColor: "#cacaca",
          pointRadius: 5,
          pointHoverRadius: 8,
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
              suggestedMin: 50,
              //   min: 0,
              beginAtZero: false
              //   steps: 2
              //display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ],
        xAxes: [
          {
            type: "time",
            autoSkip: false,
            time: {
              unit: "minute"
              //   unitStepSize: 1
            },
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
      this.chartdata.labels = data.map(m => new Date(m.timestamp));
      this.chartdata.datasets[0].data = data.map(m => m.value);
      this.$data._chart.update();
    });
  }
};
</script>
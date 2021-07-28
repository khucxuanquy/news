<template>
  <div>
    <h6 style="text-align: center">{{ title }}</h6>
    <apexchart
      type="bar"
      height="450"
      :options="filterData.chartOptions"
      :series="filterData.series"
    ></apexchart>
  </div>
</template>
<script>
export default {
  props: {
    DATA: {
      type: Object,
      default() {
        return {};
      }
    },
    title: {
      type: String,
      default() {
        return "";
      }
    }
  },
  computed: {
    filterData() {
      return {
        series: this.DATA.datasets.map(i => ({ ...i, name: i.label })),
        chartOptions: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(val) {
              if (!val) return "";
              return val;
            },
            style: {
              fontSize: "12px"
              // colors: ["#304758"]
            }
          },
          // colors: ['#6df8f1', '#f86e7d', '#f8ae6f', '#f6eb81', '#d780f5', '#80f58a'],
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: this.DATA.labels,
          },
          yaxis: {
            title: {
              text: "Lượt xem",
              rotate: -90,
              style: {
                color: "#333",
                fontSize: "12px",
                fontFamily: "system-ui",
                fontWeight: 600
              }
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            theme: "dark",
            y: {
              formatter: function(val) {
                return val + " lượt xem";
              }
            }
          }
        }
      };
    }
  }
};
</script>

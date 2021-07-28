<template>
  <div>
    <h6 style="text-align: center">{{title}}</h6>
    <apexchart
      type="pie"
      height="450px"
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
        series: this.DATA.datasets[0].data,
        chartOptions: {
          chart: {
            type: "pie"
          },
          labels: this.DATA.labels,
          dataLabels: {
            formatter(val, opt) {
              return opt.w.globals.series[opt.seriesIndex]
            },
          },
          // colors: ['#6df8f1', '#f86e7d', '#f8ae6f', '#f6eb81', '#d780f5', '#80f58a'],
          legend: {
            show: true,
            position: 'bottom',
          },
          tooltip: {
            style: {
              fontSize: '16px',
            },
            fillSeriesColor: false,
            marker: {
              show: true,
            },
            y: {
              formatter: function(value, { globals, seriesIndex }) {
                return `${value}  ( ${globals.seriesPercent[seriesIndex][0].toFixed(1)}%)`
              }
            }
          }
        }
      };
    }
  }
};
</script>

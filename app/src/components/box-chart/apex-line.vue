<template>
  <div>
    <h6 style="text-align: center">{{ title }}</h6>
    <apexchart
      type="line"
      height="500"
      width="99%"
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
            height: 350,
            type: "line",
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            },
            dropShadow: {
              enabled: true,
              color: "#faa929a6",
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2
            }
          },
          colors: ["#FAA929"],
          stroke: {
            curve: "smooth"
          },
          markers: {
            size: 1
          },
          dataLabels: {
            enabled: true,
            offsetY: -7
          },
          labels: this.DATA.labels || [],
          xaxis: {
            labels: {
              show: true
            }
          },
          yaxis: {
            labels: {
              show: true
            }
          },
          tooltip: {
            theme: "dark",
            x: {
              show: false
            },
            y: {
              title: {
                formatter() {
                  return "lượt view: ";
                }
              }
            }
          }
        }
      };
    }
  }
};
</script>

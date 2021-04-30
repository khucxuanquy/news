<template>
  <LineChart v-if="typeChart.toLowerCase() == 'line'" :DATA="datacollection" />
  <PieChat v-else-if="typeChart.toLowerCase() == 'pie'" :DATA="datacollection" />
  <BarChart v-else-if="typeChart.toLowerCase() == 'bar'" :DATA="datacollection" />
  <HorizontalBarChart v-else :DATA="datacollection" />
</template>

<script>
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChat from "./PieChat";
import HorizontalBarChart from "./HorizontalBarChart";
export default {
  components: {
    BarChart,
    LineChart,
    PieChat,
    HorizontalBarChart
  },
  props: {
    typeChart: {
      type: String,
      default: "line",
    },
  },
  data() {
    return {
      datacollection: {
        labels: [2000, 2010, 2015, 2021, 2000],
        datasets: [
          {
            label: "one",
            data: [81, 56, 55, 40, 81],
          },
          {
            label: "two",
            data: [15, 15, 34, 25, 105],
          },
          // {
          //   label: "three",
          //   data: [80, 81, 56, 55, 80],
          // },

          // {
          //   data: [70, 80, 111, 100],
          //   label: "Cây công nghiệp",
          //   backgroundColor: "rgba(75, 192, 192, 0.2)",
          //   borderColor: 'black',
          //   borderWidth: 1,
          //   // borderColor: "blue",
          //   // type: 'scatter',
          // },
        ],
      },
    };
  },
};
</script>
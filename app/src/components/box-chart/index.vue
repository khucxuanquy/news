<template>
  <LineChart v-if="typeChart.toLowerCase() == 'line'" :DATA="DATA" :title="title" />
  <PieChat v-else-if="typeChart.toLowerCase() == 'pie'" :DATA="DATA" :title="title" />
  <BarChart v-else-if="typeChart.toLowerCase() == 'bar'" :DATA="DATA" :title="title" />
  <HorizontalBarChart v-else :DATA="DATA" :title="title" />
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
    DATA: {
      type: Object,
    },
    title : {
      type: String,
      default: ''
    }
  },
};
</script>
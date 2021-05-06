<template>
  <LineChart v-if="typeChart.toLowerCase() == 'line'" :DATA="DATA" />
  <PieChat v-else-if="typeChart.toLowerCase() == 'pie'" :DATA="DATA" />
  <BarChart v-else-if="typeChart.toLowerCase() == 'bar'" :DATA="DATA" />
  <HorizontalBarChart v-else :DATA="DATA" />
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
    }
  },
};
</script>
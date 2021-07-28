<template>
  <ApexLine v-if="typeChart.toLowerCase() == 'line'" :DATA="DATA" :title="title" />
  <ApexPie v-else-if="typeChart.toLowerCase() == 'pie'" :DATA="DATA" :title="title" />
  <ApexBar v-else-if="typeChart.toLowerCase() == 'bar'" :DATA="DATA" :title="title" />
  <HorizontalBarChart v-else :DATA="DATA" :title="title" />
</template>

<script>
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChat from "./PieChat";
import HorizontalBarChart from "./HorizontalBarChart";

import ApexPie from "./apex-pie.vue";
import ApexBar from "./apex-bar.vue";
import ApexLine from "./apex-line.vue";
export default {
  components: {
    BarChart,
    LineChart,
    PieChat,
    HorizontalBarChart,
    ApexPie,
    ApexBar,
    ApexLine,
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
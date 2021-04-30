const colors = ['#6df8f1', '#f86e7d', '#f8ae6f', '#f6eb81', '#d780f5', '#80f58a']
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  props: ['DATA'],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltipTemplate: "<%= value %>",

        showTooltips: true,

        onAnimationComplete: function () {
          this.showTooltip(this.datasets[0].points, true);
        },
        tooltipEvents: []
      }
    }
  },
  mounted() {
    let dataBefore = JSON.parse(JSON.stringify(this.DATA))
    let config = {
      borderColor: 'white',
      tension: 0,
      fill: false,
      backgroundColor: 'white'
    }
    dataBefore.datasets = dataBefore.datasets.map((item, index) => {
      return {
        ...item,
        ...config,
        // borderColor: colors[index] || colors[index - colors.length],
        backgroundColor: colors.filter((i, index) => index <= item.data.length),
        hoverOffset: 4
      }
    })
    this.renderChart(dataBefore, this.options)

  }
}
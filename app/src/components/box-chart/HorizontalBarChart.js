const colors = ['#6df8f1', '#f86e7d', '#f8ae6f', '#f6eb81', '#d780f5', '#80f58a']
import { HorizontalBar } from 'vue-chartjs'
export default {
  extends: HorizontalBar,
  props: {
    DATA: {
      type: Object
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        order: 99,
        pointStyles: 'line'
      }
    }
  },
  mounted() {
    if (this.title) this.options.title = {
      display: true,
      text: this.title
    }
    let dataBefore = JSON.parse(JSON.stringify(this.DATA))
    dataBefore.datasets = dataBefore.datasets.map((item, index) => {
      return {
        ...item,
        borderColor: colors[index] || colors[index - colors.length],
        backgroundColor: colors[index] || colors[index - colors.length],
      }
    })
    this.renderChart(dataBefore, this.options)
  }
}
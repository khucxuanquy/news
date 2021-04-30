const colors = ['#6df8f1', '#f86e7d', '#f8ae6f', '#f6eb81', '#d780f5', '#80f58a']
import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  props: ['DATA'],
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
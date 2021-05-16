const colors = ['#6df8f1', '#f86e7d', '#f8ae6f', '#f6eb81', '#d780f5', '#80f58a']
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
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
        tooltips: {
          enabled: true,
          intersect: false,
          // mode: 'index'
        },
        // scales: {
        //   y: {
        //     stacked: true
        //   }
        // }
      }
    }
  },
  beforeCreate() {
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: function (ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          // var activePoint = this.chart.tooltip._active[0],
            // ctx = this.chart.ctx,
            // x = activePoint.tooltipPosition().x,
            // topY = this.chart.scales['y-axis-0'].top,
            // bottomY = this.chart.scales['y-axis-0'].bottom;

          // draw line

          // ctx.save();
          // ctx.beginPath();
          // ctx.moveTo(x, topY);
          // ctx.lineTo(x, bottomY);
          // ctx.lineWidth = 2;
          // ctx.strokeStyle = '#0000001c';
          // ctx.stroke();
          // ctx.restore();
        }
      }
    });

    Chart.defaults.global.defaultFontFamily = 'Arial';
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontColor = '#000';
  },
  mounted() {
    if (this.title) this.options.title = {
      display: true,
      text: this.title
    }
    let dataBefore = JSON.parse(JSON.stringify(this.DATA))
    // fill: không tô viền
    // tension: độ cong của line
    let configLineOptions = {
      borderWidth: 2,
      tension: 0,
      fill: false,
      backgroundColor: 'white',
      pointBorderWidth: 2,
      stepped: true
    }
    dataBefore.datasets = dataBefore.datasets.map((item, index) => {
      return {
        ...item,
        ...configLineOptions,
        borderColor: colors[index] || colors[index - colors.length]
      }
    })
    // this.renderChart(dataBefore, this.options)
    if (this.$data._chart) this.$data._chart.destroy();
    if (!this.$refs.canvas) throw new Error('Please remove the <template></template> tags from your chart component. See https://vue-chartjs.org/guide/#vue-single-file-components');
    this.$data._chart = new Chart(this.$refs.canvas.getContext('2d'), {
      type: 'LineWithLine',
      data: dataBefore,
      options: this.options,
      // plugins: this.$data._plugins
    });
  }
}
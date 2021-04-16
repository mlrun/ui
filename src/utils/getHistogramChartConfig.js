import { round } from 'lodash'

const generateCustomTooltip = context => {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip')

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip'
    tooltipEl.innerHTML = '<table></table>'
    document.body.appendChild(tooltipEl)
  }

  // Hide if no tooltip
  let tooltipModel = context.tooltip

  if (tooltipModel.opacity === 0) {
    tooltipEl.classList.add('hidden')
    return
  }

  tooltipEl.classList.remove('above', 'below', 'no-transform')

  // Set Text
  if (tooltipModel.dataPoints) {
    const labels = context.chart.config._config.data?.labels
    const dataPoints = tooltipModel.dataPoints.map(dataPoint => {
      const labelFormatted = isFinite(dataPoint.label)
        ? round(dataPoint.label, 2)
        : dataPoint.label
      const nextLabel = labels?.[dataPoint.dataIndex + 1]
      const nextLabelFormatted = isFinite(nextLabel)
        ? round(nextLabel, 2)
        : nextLabel

      return {
        x: nextLabelFormatted
          ? [labelFormatted, nextLabelFormatted]
          : labelFormatted,
        y: dataPoint.formattedValue
      }
    })
    let innerHtml = '<tbody>'

    dataPoints.forEach(dataPoint => {
      for (let name in dataPoint) {
        if (Object.prototype.hasOwnProperty.call(dataPoint, name)) {
          if (Array.isArray(dataPoint[name])) {
            innerHtml += `<tr><td>${name}: ${dataPoint[name][0]} - ${dataPoint[name][1]}</td></tr>`
          } else {
            innerHtml += `<tr><td>${name}: ${dataPoint[name]}</td></tr>`
          }
        }
      }
    })
    innerHtml += '</tbody>'

    let tableRoot = tooltipEl.querySelector('table')
    tableRoot.innerHTML = innerHtml
  }

  let canvasRect = context.chart.canvas.getBoundingClientRect()
  let chartEl = tooltipModel.dataPoints[0].element

  // Display, position, and set styles for font
  tooltipEl.style.left =
    canvasRect.left + window.pageXOffset + tooltipModel.caretX + 'px'
  tooltipEl.style.top = canvasRect.top + window.pageYOffset + chartEl.y + 'px'
  tooltipEl.style.padding =
    tooltipModel.padding + 'px ' + tooltipModel.padding + 'px'

  tooltipEl.classList.remove('hidden')
}

export const getHistogramChartConfig = () => {
  return {
    type: 'bar',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 5
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false,
          external: generateCustomTooltip,
          mode: 'index',
          intersect: false,
          callbacks: {
            title: () => ''
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  }
}

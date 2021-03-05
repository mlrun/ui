export const generateCustomTooltip = context => {
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
    let dataPoints = tooltipModel.dataPoints.map(dataPoint => {
      return { x: dataPoint.label, y: dataPoint.formattedValue }
    })
    let innerHtml = '<tbody>'

    dataPoints.forEach(dataPoint => {
      for (let name in dataPoint) {
        if (Object.prototype.hasOwnProperty.call(dataPoint, name)) {
          innerHtml += `<tr><td>${name}: ${dataPoint[name]}</td></tr>`
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

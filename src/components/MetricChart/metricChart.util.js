/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { CHART_TYPE_BAR, CHART_TYPE_LINE } from '../../constants'

export const hexToRGB = (hex, alpha = 0) => {
  if (typeof hex !== 'string') return
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// TODO: refactor generateMetricChartTooltip function with generateCustomTooltip
export const generateMetricChartTooltip = context => {
  const chartType = context.tooltip.dataPoints[0].dataset.chartType
  let tooltipEl = document.getElementById('chartjs-tooltip-metric')

  if (CHART_TYPE_BAR === chartType && parseFloat(context.tooltip.dataPoints[0].raw) === 0) return

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip-metric'
    tooltipEl.innerHTML = '<div></div>'
    document.body.appendChild(tooltipEl)
  }
  const tooltipModel = context.tooltip

  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = '0'
    return
  }

  if (tooltipModel.body) {
    const bodyLines = tooltipModel.body.map(b => b.lines)
    let innerHtml = '<div class="tooltip-container">'
    let drift =
      context.tooltip.dataPoints[0].dataset.metricType &&
      context.tooltip.dataPoints[0].dataset.metricType === 'result'
        ? true
        : false
    const tooltipType = {
      bar: {
        title: '',
        format: '%'
      },
      line: {
        title: 'Value:',
        format: ''
      }
    }
    const fullDate =
      context.tooltip.dataPoints[0].dataset?.dates?.[context.tooltip.dataPoints[0].dataIndex]

    if (chartType === CHART_TYPE_LINE && fullDate) {
      innerHtml += `<div class="tooltip-container-date">Date: ${fullDate}</div>`
    }

    innerHtml += `<div class="tooltip-container-value">${tooltipType[chartType].title} ${context.tooltip.dataPoints[0].raw} ${tooltipType[chartType].format}</div>`

    if (drift) {
      bodyLines.forEach((body, i) => {
        const driftBackground = `tooltip-drift-status-drift-${context.tooltip.dataPoints[0].dataset.driftStatusList[context.tooltip.dataPoints[0].dataIndex].className}`
        innerHtml += `<div class="tooltip-drift-content">
                      <div class="tooltip-drift-content-text">${context.tooltip.dataPoints[0].dataset.driftStatusList[context.tooltip.dataPoints[0].dataIndex].text}</div>
                      <div class="tooltip-drift-status + ${driftBackground}"></div>
                      </div>`
      })
    }

    innerHtml += '</div>'

    const divRoot = tooltipEl.querySelector('div')
    divRoot.innerHTML = innerHtml
  }

  const position = context.chart.canvas.getBoundingClientRect()
  tooltipEl.style.opacity = '1'
  tooltipEl.style.position = 'absolute'
  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
  tooltipEl.style.pointerEvents = 'none'
}

export const setChartGradient = (chart, ctx, backgroundColor, canvasHeight = 200) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  gradient.addColorStop(0, hexToRGB(backgroundColor || '#FFF', 0.7))
  gradient.addColorStop(1, hexToRGB(backgroundColor))
  chart.data.datasets.forEach(dataset => {
    dataset.backgroundColor = gradient
  })
}

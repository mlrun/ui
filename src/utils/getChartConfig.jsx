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
import { round } from 'lodash'
import {
  CHART_TYPE_BAR,
  CHART_TYPE_GRADIENT_LINE,
  CHART_TYPE_HISTOGRAM,
  CHART_TYPE_LINE
} from '../constants'
import { getScssVariableValue } from 'igz-controls/utils/common.util'

const mischkaColor = getScssVariableValue('--mischkaColor')

const setHistogramChartText = (context, tooltipModel, tooltipEl) => {
  if (tooltipModel.dataPoints) {
    const labels = context.chart.config._config.data?.labels
    const dataPoints = tooltipModel.dataPoints.map(dataPoint => {
      const labelFormatted = isFinite(dataPoint.label) ? round(dataPoint.label, 2) : dataPoint.label
      const nextLabel = labels?.[dataPoint.dataIndex + 1]
      const nextLabelFormatted = isFinite(nextLabel) ? round(nextLabel, 2) : nextLabel

      return {
        x: nextLabelFormatted ? [labelFormatted, nextLabelFormatted] : labelFormatted,
        y: dataPoint.formattedValue
      }
    })
    let innerHtml = '<div class="tooltip-container">'

    dataPoints.forEach(dataPoint => {
      for (let name in dataPoint) {
        if (Object.prototype.hasOwnProperty.call(dataPoint, name)) {
          if (Array.isArray(dataPoint[name])) {
            innerHtml += `<div>${name}: ${dataPoint[name][0]} - ${dataPoint[name][1]}</div>`
          } else {
            innerHtml += `<div>${name}: ${dataPoint[name]}</div>`
          }
        }
      }
    })
    innerHtml += '</div>'

    const divRoot = tooltipEl.querySelector('div')
    divRoot.innerHTML = innerHtml
  }
}

const setMetricChartText = (context, tooltipModel, tooltipEl, chartType) => {
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
      bodyLines.forEach(() => {
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
}

const setMEPWithDetectionChartText = (context, tooltipModel, tooltipEl) => {
  if (tooltipModel.body) {
    let innerHtml = '<div class="tooltip-container">'
    const fullDate =
      context.tooltip.dataPoints[0].dataset?.dates?.[context.tooltip.dataPoints[0].dataIndex]
   
    innerHtml += `<div class="tooltip-container-date">Date: ${fullDate}</div>`
    innerHtml += `<div class="tooltip-container-value">Value: ${context.tooltip.dataPoints[0].raw}</div>`

    innerHtml += '</div>'

    const divRoot = tooltipEl.querySelector('div')
    divRoot.innerHTML = innerHtml
  }
}

const generateCustomTooltip = (context, applicationChartType, setText = setMetricChartText) => {
  // ChartJs type
  const chartType = context.tooltip.dataPoints[0].dataset.chartType

  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip')

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.id = 'chartjs-tooltip'
    tooltipEl.innerHTML = '<div></div>'
    document.body.appendChild(tooltipEl)
  }

  // Hide if no tooltip
  let tooltipModel = context.tooltip

  if (
    tooltipModel.opacity === 0 ||
    (CHART_TYPE_BAR === chartType &&
      applicationChartType !== CHART_TYPE_HISTOGRAM &&
      parseFloat(context.tooltip.dataPoints[0].raw) === 0)
  ) {
    tooltipEl.classList.add('hidden')
    return
  }

  setText(context, tooltipModel, tooltipEl, chartType)

  // Display, position, and set styles for font
  const position = context.chart.canvas.getBoundingClientRect()
  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'

  tooltipEl.classList.remove('hidden')
}

export const getMetricChartConfig = type => {
  const defaultOptions = {
    layout: {
      padding: 0
    },
    maintainAspectRatio: false,
    animation: false,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
        intersect: false,
        mode: 'index',
        external: generateCustomTooltip
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          align: 'start',
          autoSkip: true,
          autoSkipPadding: 20,
          maxRotation: 0
        },
        title: {
          display: true,
          text: '',
          font: 0
        },
        grid: {
          drawOnChartArea: true,
          borderWidth: 2,
          lineWidth: 1
        }
      },
      y: {
        grid: {
          drawBorder: true
        },
        title: {
          display: false
        }
      }
    }
  }

  const lineOptions = {
    ...defaultOptions,
    elements: {
      point: {
        radius: 0
      }
    }
  }

  const gradientLineOptions = {
    ...defaultOptions,
    scales: {
      ...defaultOptions.scales,
      x: {
        ...defaultOptions.scales.x,
        grid: {
          display: true
        }
      },
      y: {
        display: true,
        grid: {
          display: true
        },
        ticks: {
          display: true
        }
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  }

  const barOptions = {
    ...defaultOptions,
    barThickness: 20,
    borderRadius: {
      topLeft: 4,
      topRight: 4
    },
    scales: {
      ...defaultOptions.scales,
      x: {
        ...defaultOptions.scales.x,
        title: {
          display: true,
          text: 'Value',
          font: 10
        },
        ticks: {
          align: 'left',
          autoSkip: false,
          offset: -20
        },
        grid: {
          ...defaultOptions.scales.x.grid,
          drawOnChartArea: false
        }
      },
      y: {
        ...defaultOptions.scales.y,
        grid: {
          drawBorder: false,
          borderColor: mischkaColor
        },
        title: {
          display: true,
          text: 'Percentage',
          font: 10
        }
      }
    }
  }

  switch (type) {
    case CHART_TYPE_BAR:
      return { type: CHART_TYPE_BAR, options: barOptions }
    case CHART_TYPE_GRADIENT_LINE:
      return { type: CHART_TYPE_LINE, options: gradientLineOptions }
    default:
      return { type: CHART_TYPE_LINE, options: lineOptions }
  }
}

export const getHistogramChartConfig = () => {
  return {
    type: CHART_TYPE_BAR,
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
          external: context =>
            generateCustomTooltip(context, CHART_TYPE_HISTOGRAM, setHistogramChartText),
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

export const getMEPsWithDetectionChartConfig = () => {
  const barConfig = getMetricChartConfig(CHART_TYPE_BAR)
  
  return {
    ...barConfig,
    options: {
      ...barConfig.options,
      scales: {
        ...barConfig.options.scales,
        x: {
          ...barConfig.options.scales.x,
          title: {
            display: false
          }
        },
        y: {
          ...barConfig.options.scales.y,
          title: {
            ...barConfig.options.scales.y.title,
            text: 'Model endpoint with detections'
          }
        }
      },
      plugins: {
        ...barConfig.options.plugins,
        tooltip: {
          enabled: false,
          intersect: false,
          mode: 'index',
          external: context =>
            generateCustomTooltip(context, null, setMEPWithDetectionChartText),
        }
      }
    }
  }
}

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
import { sortBy } from 'lodash'

const metricsColorsById = {}
const usedColors = new Set()

const getMetricsLabel = (metric, metricColor) => {
  return (
    <>
      <span className="metrics-selector-color-indicator" style={{ backgroundColor: metricColor }} />
      <span className="data-ellipsis">{metric.label}</span>
    </>
  )
}

const getRandomHexColor = () => {
  const hue = Math.floor(Math.random() * 361)
  const saturation = Math.floor(Math.random() * 56) + 45 // from 45 to 100
  const lightness = Math.floor(Math.random() * 71) // max 70
  // max number of combinations: 360 * 55 * 70 = 1 386 000

  const hslToHex = (h, s, l) => {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = n => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0') // convert to Hex and prefix "0" if needed
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  return hslToHex(hue, saturation, lightness)
}

export const generateUniqueColor = () => {
  for (;;) {
    let color = getRandomHexColor()

    if (!usedColors.has(color)) {
      usedColors.add(color)
      return color
    }
  }
}

export const getMetricColorById = id => {
  if (metricsColorsById[id]) {
    return metricsColorsById[id]
  } else {
    const newColor = generateUniqueColor()
    
    return newColor
  }
}

export const setMetricColorById = (id, color) => {
  metricsColorsById[id] = color
}

export const filterMetrics = (metrics, nameFilter) => {
  return metrics.map(applicationData => {
    return {
      ...applicationData,
      metrics: applicationData.metrics.filter(metric => {
        return metric.originalLabel.toLowerCase().includes(nameFilter.toLowerCase())
      })
    }
  })
}

export const generateMetricsItemsByApplication = (metrics, preselectedMetrics) => {
  preselectedMetrics.forEach(metric => {
    setMetricColorById(metric.id, metric.color)
  })

  return sortBy(
    Object.values(
      sortBy(metrics, metric => metric.label).reduce((groupedMetrics, metric) => {
        const metricColor = getMetricColorById(metric.id)
        const modifiedMetric = {
          ...metric,
          label: getMetricsLabel(metric, metricColor),
          colorIndicator: metricColor,
          originalLabel: metric.label
        }

        if (groupedMetrics[metric.application]?.metrics) {
          groupedMetrics[metric.application].metrics.push(modifiedMetric)
        } else {
          groupedMetrics[metric.application] = {
            applicationId: metric.application,
            applicationLabel: metric.application,
            metrics: [modifiedMetric]
          }
        }

        return groupedMetrics
      }, {})
    ),
    metricsGroup => metricsGroup.applicationLabel
  )
}

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
import { chain } from 'lodash'

const mlrunInfra = 'mlrun-infra'
const metricsColorsByFullName = {}
const usedColors = new Set()

// TODO: verify with Jonathan the drift status option
const driftStatusConfig = {
  0: {
    color: '#00FF00',
    text: 'No drift'
  },
  1: {
    color: '#FFD077',
    text: 'Possible drift'
  },
  2: {
    color: '#FF0000',
    text: 'Drift detected'
  }
}

const hslToHex = (hue, saturation, lightness) => {
  const normalizedLightness = lightness / 100
  const chroma = (saturation * Math.min(normalizedLightness, 1 - normalizedLightness)) / 100

  const calculateColorComponent = step => {
    const rotation = (step + hue / 30) % 12
    const color =
      normalizedLightness - chroma * Math.max(Math.min(rotation - 3, 9 - rotation, 1), -1)

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${calculateColorComponent(0)}${calculateColorComponent(8)}${calculateColorComponent(4)}`
}

const getRandomHexColor = () => {
  const hue = Math.floor(Math.random() * 361)
  const saturation = Math.floor(Math.random() * 56) + 45
  const lightness = Math.floor(Math.random() * 71)

  return hslToHex(hue, saturation, lightness)
}

const setMetricColorByFullName = (name, color) => {
  metricsColorsByFullName[name] = color
}

const generateUniqueColor = () => {
  for (;;) {
    let color = getRandomHexColor()

    if (!usedColors.has(color)) {
      usedColors.add(color)

      return color
    }
  }
}

export const getMetricColorByFullName = name => {
  if (metricsColorsByFullName[name]) {
    return metricsColorsByFullName[name]
  } else {
    const newColor = generateUniqueColor()

    setMetricColorByFullName(name, newColor)

    return newColor
  }
}

export const generateMetricsItems = metrics => {
  return chain(metrics)
    .filter(metric => metric.app !== mlrunInfra)
    .sortBy(metric => metric.label)
    .map(metric => {
      return {
        ...metric,
        color: getMetricColorByFullName(metric.full_name),
        id: metric.full_name
      }
    })
    .value()
}

const getTitle = fullName => fullName.substring(fullName.lastIndexOf('.') + 1).replace(/-/g, ' ')

const formatMetricsTime = dates => {
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
  return dates.map(date => new Date(date).toLocaleTimeString('en-US', options))
}

const formatMetricsDate = dates => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return dates.map(date => new Date(date).toLocaleDateString('en-US', options))
}

const getMetricLabels = (values, dateRange) => {
  const dates = values.map(([date]) => date)
  const oneDayInMillis = 86400000
  const differenceInDays = dateRange.end - dateRange.start
  return differenceInDays > oneDayInMillis ? formatMetricsDate(dates) : formatMetricsTime(dates)
}

export const formatNumber = num => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(0) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(0) + 'k'
  } else {
    return num.toString()
  }
}

const getAppName = inputString => {
  const firstDotIndex = inputString.indexOf('.')
  if (firstDotIndex !== -1) {
    const secondDotIndex = inputString.indexOf('.', firstDotIndex + 1)
    if (secondDotIndex !== -1) {
      return inputString.substring(firstDotIndex + 1, secondDotIndex)
    } else {
      return ''
    }
  } else {
    return ''
  }
}

export const parseMetrics = (metric, params, id) => {
  const { full_name, values, type } = metric

  if (!metric.data || !values || !Array.isArray(values)) {
    return {
      metric,
      app: getAppName(full_name),
      title: getTitle(full_name)
    }
  }

  const getStatus = dataArray => {
    let status = 'No drift'
    for (const item of dataArray) {
      if (item.text === 'Drift detected') {
        status = driftStatusConfig[2]
        break
      } else if (item.text === 'Possible drift' && status !== 'Drift detected') {
        status = driftStatusConfig[1]
      }
    }
    return status
  }

  const points = values.map(([_, value]) => parseFloat(value.toFixed(2)))
  let driftStatus = []
  if (type === 'result') {
    values.map(([_, __, driftStatus]) => driftStatus)
    driftStatus = values.map(([_, __, driftStatus]) => driftStatusConfig[driftStatus])
    metric.driftStatus = driftStatus
    metric.totalDriftStatus = getStatus(driftStatus)
  }

  const isInvocationsRate = full_name.includes('invocations')

  const totalOrAvg = isInvocationsRate
    ? formatNumber(points.reduce((sum, value) => sum + value, 0))
    : formatNumber((points.reduce((sum, value) => sum + value, 0) / points.length).toFixed(2))

  const modifiedMetric = {
    ...metric,
    id,
    title: getTitle(full_name),
    app: getAppName(full_name),
    color: getMetricColorByFullName(full_name),
    labels: getMetricLabels(values, params),
    points,
    [isInvocationsRate ? 'total' : 'avg']: totalOrAvg
  }

  return modifiedMetric
}

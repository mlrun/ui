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
import { capitalize, chain } from 'lodash'
import {
  CUSTOM_RANGE_DATE_OPTION,
  PAST_24_HOUR_DATE_OPTION,
  PAST_HOUR_DATE_OPTION,
  PAST_MONTH_DATE_OPTION,
  PAST_WEEK_DATE_OPTION
} from '../../utils/datePicker.util'

export const AVG = 'avg'
export const AVG_RAW = 'avgRaw'
export const ML_RUN_INFRA = 'mlrun-infra'
export const RAW_DATA_TOTAL = 'rawDataTotal'
export const TOTAL = 'total'

const metricsColorsByFullName = {}
const usedColors = new Set()

export const timeRangeMapping = {
  [PAST_24_HOUR_DATE_OPTION]: 'last 24 day',
  [PAST_WEEK_DATE_OPTION]: 'last week',
  [PAST_MONTH_DATE_OPTION]: 'last month',
  [PAST_HOUR_DATE_OPTION]: 'last hour',
  [CUSTOM_RANGE_DATE_OPTION]: 'custom range'
}

export const calculatePercentageDrift = (previousTotalInvocation, currentTotalInvocation) => {
  if (!previousTotalInvocation)
    return {
      className: 'drift_up',
      percentageChange: 'N/A',
      positive: true
    }

  const result =
    ((currentTotalInvocation - previousTotalInvocation) / Math.abs(previousTotalInvocation)) * 100

  return {
    className: result > 0 ? 'drift_up' : 'drift_down',
    percentageChange: `${result.toFixed(0)}%`,
    positive: result > 0 ? true : false
  }
}

const resultKindConfig = {
  0: 'data drift',
  1: 'concept drift',
  2: 'model performance drift',
  3: 'system performance drift',
  4: 'custom-defined anomaly'
}

const driftStatusConfig = {
  '-1': {
    className: 'no_status',
    text: 'No status'
  },
  0: {
    className: 'no_drift',
    text: 'No drift'
  },
  1: {
    className: 'possible_drift',
    text: 'Possible drift'
  },
  2: {
    className: 'drift_detected',
    text: 'Drift detected'
  }
}

const generateResultMessage = (driftStatus, resultKind) => {
  const resultKindMessage = resultKindConfig[resultKind]
  const { text } = driftStatusConfig[driftStatus]

  if (driftStatus === 0) {
    return `No ${resultKindMessage}`
  } else if (driftStatus === -1) {
    return `${text} ${resultKindMessage}`
  }

  return `${capitalize(resultKindMessage)} ${text.toLowerCase().replace('drift', '').trim()}`
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

export const getDateRangeBefore = range => {
  const rangeDuration = range.end - range.start

  return {
    start: range.start - rangeDuration,
    end: range.end - rangeDuration
  }
}

const getMetricTitle = fullName =>
  fullName.substring(fullName.lastIndexOf('.') + 1).replace(/-/g, ' ')

const timeFormatters = {
  hours: {
    formatMetricsTime: dates => {
      const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }
      return dates.map(([date]) => new Date(date).toLocaleTimeString('en-US', options))
    }
  },
  days: {
    formatMetricsTime: dates => {
      const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }
      return dates.map(([date]) => new Date(date).toLocaleDateString('en-US', options))
    }
  }
}

export const formatNumber = num => {
  let result

  if (num >= 1e6) {
    result = (num / 1e6).toFixed(0) + 'M'
  } else if (num >= 1e3) {
    result = (num / 1e3).toFixed(0) + 'k'
  } else {
    result = num.toString()
  }

  return {
    formattedResult: result,
    rawResult: num
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

export const parseMetrics = (data, timeUnit) => {
  return data.map((metric, index) => {
    const { full_name, result_kind: resultKind, values, type } = metric

    if (!metric.data || !values || !Array.isArray(values)) {
      return {
        ...metric,
        id: index,
        app: getAppName(full_name),
        title: getMetricTitle(full_name)
      }
    }

    const points = values.map(([_, value]) => parseFloat(value.toFixed(2)))

    let driftStatusList = []
    let totalDriftStatus = null

    if (type === 'result') {
      let highestDrift = { status: -1 }

      driftStatusList = values.map(([date, __, driftStatus], index) => {
        if (highestDrift.status < driftStatus) highestDrift = { status: driftStatus, index }
        return driftStatusConfig[driftStatus]
      })

      totalDriftStatus = {
        ...driftStatusConfig[highestDrift.status],
        index: highestDrift.index,
        text: generateResultMessage(highestDrift.status, resultKind)
      }
    }

    const withInvocationRate = full_name.includes('invocations')

    const totalOrAvg = withInvocationRate
      ? formatNumber(points.reduce((sum, value) => sum + value, 0))
      : formatNumber((points.reduce((sum, value) => sum + value, 0) / points.length).toFixed(2))

    return {
      ...metric,
      app: getAppName(full_name),
      color: getMetricColorByFullName(full_name),
      id: index,
      labels: timeFormatters[timeUnit].formatMetricsTime(values),
      points,
      title: getMetricTitle(full_name),
      driftStatusList,
      totalDriftStatus,
      [withInvocationRate ? TOTAL : AVG]: totalOrAvg.formattedResult,
      [withInvocationRate ? RAW_DATA_TOTAL : AVG_RAW]: totalOrAvg.rawResult
    }
  })
}

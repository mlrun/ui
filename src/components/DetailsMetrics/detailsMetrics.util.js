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
import { capitalize, chain, isNil } from 'lodash'

import {
  CUSTOM_RANGE_DATE_OPTION,
  PAST_24_HOUR_DATE_OPTION,
  PAST_HOUR_DATE_OPTION,
  PAST_MONTH_DATE_OPTION,
  PAST_WEEK_DATE_OPTION
} from '../../utils/datePicker.util'
import { CHART_TYPE_BAR } from '../../constants'

import { ReactComponent as ArrowUp } from 'igz-controls/images/arrow-up.svg'
import { ReactComponent as ArrowDown } from 'igz-controls/images/arrow-down.svg'
import { ReactComponent as DoubleArrow } from 'igz-controls/images/double-arrow.svg'

import colors from 'igz-controls/scss/colors.scss'

export const METRIC_COMPUTED_AVG_POINTS = 'metric_computed_avg_points'
export const METRIC_RAW_AVG_POINTS = 'metric_raw_avg_points'
export const DRIFT_UP = 'drift_up'
export const DRIFT_DOWN = 'drift_down'
export const INVOCATION_CARD_SCROLL_THRESHOLD = 20
export const INVOCATION_CARD_SCROLL_DELAY = 500
export const ML_RUN_INFRA = 'mlrun-infra'
export const METRIC_RAW_TOTAL_POINTS = 'metric_raw_total_points'
export const METRIC_COMPUTED_TOTAL_POINTS = 'metric_computed_total_points'
export const TWO_DIGIT = '2-digit'

export const timeRangeMapping = {
  [PAST_24_HOUR_DATE_OPTION]: 'last 24 hours',
  [PAST_WEEK_DATE_OPTION]: 'last week',
  [PAST_MONTH_DATE_OPTION]: 'last month',
  [PAST_HOUR_DATE_OPTION]: 'last hour',
  [CUSTOM_RANGE_DATE_OPTION]: 'custom range'
}

export const calculatePercentageDrift = (previousTotalInvocation, currentTotalInvocation) => {
  if (!previousTotalInvocation) {
    if (currentTotalInvocation > 0) {
      return {
        className: DRIFT_UP,
        percentageChange: 'N/A',
        icon: <ArrowUp />
      }
    }

    return {
      className: '',
      percentageChange: 'N/A',
      icon: <DoubleArrow />
    }
  }

  if (previousTotalInvocation === currentTotalInvocation) {
    return {
      className: '',
      percentageChange: '0%',
      icon: <DoubleArrow />
    }
  }

  const percentageChangeResult =
    ((currentTotalInvocation - previousTotalInvocation) / Math.abs(previousTotalInvocation)) * 100
  const isPositive = percentageChangeResult > 0

  return {
    className: isPositive ? DRIFT_UP : DRIFT_DOWN,
    percentageChange: `${percentageChangeResult.toFixed(0)}%`,
    icon: isPositive ? <ArrowUp /> : <ArrowDown />
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
    text: 'No status',
    chartColor: colors.doveGray
  },
  0: {
    className: 'no_drift',
    text: 'No drift',
    chartColor: colors.brightTurquoise
  },
  1: {
    className: 'possible_drift',
    text: 'Possible drift',
    chartColor: colors.grandis
  },
  2: {
    className: 'drift_detected',
    text: 'Drift detected',
    chartColor: colors.ceriseRed
  }
}

const timeFormatters = {
  hours: {
    handler: date =>
      new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: TWO_DIGIT,
        hour12: true
      })
  },
  days: {
    handler: date =>
      new Date(date).toLocaleDateString('en-US', {
        year: TWO_DIGIT,
        month: TWO_DIGIT,
        day: TWO_DIGIT
      })
  },
  full: {
    handler: date =>
      new Date(date).toLocaleDateString('en-US', {
        year: TWO_DIGIT,
        month: TWO_DIGIT,
        day: TWO_DIGIT,
        hour: 'numeric',
        minute: TWO_DIGIT,
        hour12: true
      })
  }
}

const generateResultMessage = (driftStatus, resultKind) => {
  const resultKindMessage = resultKindConfig[resultKind]
  const { text } = driftStatusConfig[driftStatus]

  if (driftStatus === 0) {
    return 'No drift or anomalies detected'
  } else if (driftStatus === -1) {
    return `${text} ${resultKindMessage}`
  }

  return `${capitalize(resultKindMessage)} ${text.toLowerCase().replace('drift', '').trim()}`
}

export const generateMetricsItems = metrics => {
  return chain(metrics)
    .sortBy(metric => metric.label)
    .map(metric => {
      return {
        ...metric,
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
    const { full_name, result_kind: resultKind, values, type, data } = metric

    if (!metric.data || !values || !Array.isArray(values)) {
      return {
        ...metric,
        id: index,
        app: getAppName(full_name),
        title: getMetricTitle(full_name)
      }
    }

    const withInvocationRate = full_name.includes('invocations')
    const parsedMetric = {
      type,
      data,
      full_name,
      resultKind,
      app: getAppName(full_name),
      id: index,
      labels: [],
      dates: [],
      points: [],
      title: getMetricTitle(full_name),
      driftStatusList: [],
      totalDriftStatus: null,
      minPointValue: null,
      maxPointValue: null,
      [withInvocationRate ? METRIC_COMPUTED_TOTAL_POINTS : METRIC_COMPUTED_AVG_POINTS]: '0',
      [withInvocationRate ? METRIC_RAW_TOTAL_POINTS : METRIC_RAW_AVG_POINTS]: 0
    }
    let metricsValueSum = 0
    let highestDrift = type === 'result' ? { status: -1 } : null

    values.forEach(([date, value, driftStatus], index) => {
      const parsedValue = parseFloat(value.toFixed(2))
      parsedMetric.points.push(parsedValue)

      if (isNil(parsedMetric.minPointValue) || parsedMetric.minPointValue > parsedValue)
        parsedMetric.minPointValue = parsedValue

      if (isNil(parsedMetric.maxPointValue) || parsedMetric.maxPointValue < parsedValue)
        parsedMetric.maxPointValue = parsedValue

      if (type === 'result') {
        if (highestDrift?.status < driftStatus) {
          highestDrift = { status: driftStatus, index }
        }

        parsedMetric.driftStatusList.push(driftStatusConfig[driftStatus])
      }

      metricsValueSum += parsedValue
      parsedMetric.labels.push(timeFormatters[timeUnit].handler(date))
      parsedMetric.dates.push(timeFormatters['full'].handler(date))
    })

    if (highestDrift) {
      parsedMetric.totalDriftStatus = {
        ...driftStatusConfig[highestDrift.status],
        index: highestDrift.index,
        text: generateResultMessage(highestDrift.status, resultKind)
      }
    }

    const totalOrAvg = withInvocationRate
      ? formatNumber(metricsValueSum)
      : formatNumber((metricsValueSum / parsedMetric.points.length).toFixed(2))

    parsedMetric[withInvocationRate ? METRIC_COMPUTED_TOTAL_POINTS : METRIC_COMPUTED_AVG_POINTS] =
      totalOrAvg.formattedResult
    parsedMetric[withInvocationRate ? METRIC_RAW_TOTAL_POINTS : METRIC_RAW_AVG_POINTS] =
      totalOrAvg.rawResult

    return parsedMetric
  })
}

export const calculateHistogram = metric => {
  const numberOfBins = 5
  const { maxPointValue = 0, minPointValue = 0 } = metric
  const range = maxPointValue - minPointValue === 0 ? 1 : maxPointValue - minPointValue
  const binSize = range / numberOfBins
  const bins = Array(numberOfBins)
    .fill()
    .map(() => ({ count: 0, minBinValue: null, maxBinValue: null }))
  const roundValue = (value, fraction = 100) => Math.round(value * fraction) / fraction

  metric.points.forEach(value => {
    const binIndex = Math.min(Math.floor((value - minPointValue) / binSize), numberOfBins - 1)
    bins[binIndex].count++

    if (isNil(bins[binIndex].minBinValue) || bins[binIndex].minBinValue > value)
      bins[binIndex].minBinValue = value

    if (isNil(bins[binIndex].maxBinValue) || bins[binIndex].maxBinValue < value)
      bins[binIndex].maxBinValue = value
  })

  const totalCount = metric.points.length

  const binPercentages = bins.map(bin => roundValue((bin.count / totalCount) * 100, 1000))

  const binLabels = Array.from({ length: numberOfBins }, (_, i) => {
    if (parseFloat(binPercentages[i]) === 0) return ''

    if (maxPointValue === minPointValue) return `${roundValue(maxPointValue)}`

    const rangeStart = bins[i].minBinValue
    const rangeEnd = bins[i].maxBinValue

    if (rangeStart === rangeEnd) return String(roundValue(rangeStart))

    return `${roundValue(rangeStart)} - ${roundValue(rangeEnd)}`
  })

  return {
    labels: binLabels,
    datasets: [
      {
        data: binPercentages,
        chartType: CHART_TYPE_BAR,
        tension: 0.2,
        borderWidth: 2,
        backgroundColor: colors.java,
        borderColor: colors.java
      }
    ]
  }
}

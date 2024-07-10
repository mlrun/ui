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
  [PAST_24_HOUR_DATE_OPTION]: 'last 24 day',
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
    return `No ${resultKindMessage}`
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

const formatMetricsTime = (timeUnit, dates) => {
  return dates.reduce(
    (dates, [date]) => {
      dates.labels.push(timeFormatters[timeUnit].handler(date))
      dates.fullDates.push(timeFormatters['full'].handler(date))
      
      return dates
    },
    { fullDates: [], labels: [] }
  )
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
    const formattedMetricsTime = formatMetricsTime(timeUnit, values)

    return {
      ...metric,
      app: getAppName(full_name),
      id: index,
      labels: formattedMetricsTime.labels,
      dates: formattedMetricsTime.fullDates,
      points,
      title: getMetricTitle(full_name),
      driftStatusList,
      totalDriftStatus,
      [withInvocationRate ? METRIC_COMPUTED_TOTAL_POINTS : METRIC_COMPUTED_AVG_POINTS]:
        totalOrAvg.formattedResult,
      [withInvocationRate ? METRIC_RAW_TOTAL_POINTS : METRIC_RAW_AVG_POINTS]: totalOrAvg.rawResult
    }
  })
}

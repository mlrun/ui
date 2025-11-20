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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import ApplicationMetricCard from './MetricsCards/ApplicationMetricCard/ApplicationMetricCard'
import DatePicker from '../../common/DatePicker/DatePicker'
import InvocationsMetricCard from './MetricsCards/InvocationsMetricCard/InvocationsMetricCard'
import MetricsSelector from '../../elements/MetricsSelector/MetricsSelector'
import NoData from '../../common/NoData/NoData'
import NoMetricData from './MetricsCards/NoMetricData/NoMetricData'
import StatsCard from '../../common/StatsCard/StatsCard'

import {
  getDateRangeBefore,
  METRIC_RAW_TOTAL_POINTS,
  ML_RUN_INFRA,
  timeRangeMapping
} from './detailsMetrics.util'
import {
  datePickerPastOptions,
  PAST_24_HOUR_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'
import {
  clearMetricsOptions,
  fetchModelEndpointMetrics,
  fetchModelEndpointMetricsValues,
  setDetailsDates,
  setSelectedMetricsOptions
} from '../../reducers/detailsReducer'
import { groupMetricByApplication } from '../../elements/MetricsSelector/metricsSelector.util'
import { REQUEST_CANCELED } from '../../constants'

import MetricsIcon from 'igz-controls/images/metrics-icon.svg?react'

import './DetailsMetrics.scss'

const DetailsMetrics = ({
  applicationNameProp = '',
  selectedItem,
  renderTitle = null,
  isDetailsPopUp = false
}) => {
  const [metrics, setMetrics] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [previousTotalInvocation, setPreviousTotalInvocation] = useState(0)
  const [isInvocationCardExpanded, setIsInvocationCardExpanded] = useState(false)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const invocationBodyCardRef = useRef(null)
  const metricsContainerRef = useRef(null)
  const metricsValuesAbortController = useRef(new AbortController())
  const prevSelectedEndPointNameRef = useRef('')
  const [metricOptionsAreLoaded, setMetricOptionsAreLoaded] = useState(false)
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics, true)
  }, [metrics])

  const hasMetricsList = useMemo(() => {
    return detailsStore.metricsOptions.all.filter(metric => metric.app !== ML_RUN_INFRA).length > 0
  }, [detailsStore.metricsOptions.all])

  const chooseMetricsDataCard = useMemo(() => {
    return (
      generatedMetrics.length === 1 &&
      hasMetricsList && (
        <StatsCard className="metrics__empty-select">
          <MetricsIcon />
          <div>Choose metrics to view endpoint’s data</div>
        </StatsCard>
      )
    )
  }, [hasMetricsList, generatedMetrics.length])

  const handleChangeDates = useCallback(
    (dates, isPredefined, selectedOptionId) => {
      const generatedDates = [...dates]

      if (generatedDates.length === 1) {
        generatedDates.push(new Date())
      }

      dispatch(
        setDetailsDates({
          value: generatedDates,
          selectedOptionId,
          isPredefined
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    const past24hoursOption = datePickerPastOptions.find(
      option => option.id === PAST_24_HOUR_DATE_OPTION
    )

    handleChangeDates(past24hoursOption.handler(), true, PAST_24_HOUR_DATE_OPTION)
  }, [handleChangeDates])

  useEffect(() => {
    dispatch(
      fetchModelEndpointMetrics({
        project: selectedItem.metadata.project,
        uid: selectedItem.metadata.uid,
        applicationName: applicationNameProp
      })
    )
      .unwrap()
      .then(() => setMetricOptionsAreLoaded(true))
  }, [applicationNameProp, dispatch, selectedItem.metadata.project, selectedItem.metadata.uid])

  useEffect(() => {
    const selectedDate = detailsStore.dates.selectedOptionId
    if (!selectedDate || !(selectedDate in timeRangeMapping)) return

    queueMicrotask(() => {
      setSelectedDate(timeRangeMapping[selectedDate])
    })
  }, [detailsStore.dates.selectedOptionId])

  const fetchData = useCallback(
    (selectedMetricsParams, preInvocationMetricParams, selectedItemProject, selectedItemUid) => {
      metricsValuesAbortController.current = new AbortController()

      return Promise.all([
        dispatch(
          fetchModelEndpointMetricsValues({
            project: selectedItemProject,
            uid: selectedItemUid,
            params: selectedMetricsParams,
            abortController: metricsValuesAbortController.current,
            setRequestErrorMessage
          })
        ).unwrap(),
        dispatch(
          fetchModelEndpointMetricsValues({
            project: selectedItemProject,
            uid: selectedItemUid,
            params: preInvocationMetricParams,
            abortController: metricsValuesAbortController.current,
            setRequestErrorMessage
          })
        ).unwrap()
      ]).then(([metrics, previousInvocation]) => {
        if (metrics) setMetrics(metrics)

        if (!!previousInvocation && previousInvocation.length !== 0) {
          setPreviousTotalInvocation(previousInvocation[0][METRIC_RAW_TOTAL_POINTS])
        }
      })
    },
    [dispatch, setMetrics, metricsValuesAbortController]
  )

  useEffect(() => {
    if (selectedItem.metadata.uid !== prevSelectedEndPointNameRef.current) {
      prevSelectedEndPointNameRef.current = selectedItem.metadata.uid
      return
    }
    if (
      metricOptionsAreLoaded &&
      selectedItem.metadata?.uid &&
      detailsStore.metricsOptions.all.length > 0 &&
      detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
    ) {
      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
      const invocationMetric = detailsStore.metricsOptions.all.find(
        metric => metric.app === ML_RUN_INFRA
      )

      const params = { name: [] }

      if (detailsStore.dates.value[0] && detailsStore.dates.value[1]) {
        params.start = detailsStore.dates.value[0].getTime()
        params.end = detailsStore.dates.value[1].getTime()
      }

      ;[invocationMetric, ...selectedMetrics].forEach(metric => {
        params.name.push(metric.full_name)
      })

      const preInvocationMetricParams = { name: [] }

      if (params.start && params.end) {
        const newRange = getDateRangeBefore(params)
        preInvocationMetricParams.start = newRange.start
        preInvocationMetricParams.end = newRange.end
      }

      const [{ full_name }] = detailsStore.metricsOptions.all.filter(
        metric => metric.app === ML_RUN_INFRA
      )
      preInvocationMetricParams.name.push(full_name)
      fetchData(
        params,
        preInvocationMetricParams,
        selectedItem.metadata.project,
        selectedItem.metadata.uid
      )
    } else {
      queueMicrotask(() => {
        setMetrics([])
      })
    }

    return () => {
      metricsValuesAbortController.current?.abort(REQUEST_CANCELED)
      setMetrics([])
    }
  }, [
    metricOptionsAreLoaded,
    fetchData,
    selectedItem.metadata.uid,
    selectedItem.metadata.project,
    detailsStore.dates.value,
    detailsStore.metricsOptions.all,
    detailsStore.metricsOptions.selectedByEndpoint,
    setMetrics,
    metricsValuesAbortController
  ])

  useEffect(() => {
    if (isDetailsPopUp) {
      return () => {
        dispatch(clearMetricsOptions())
      }
    }
  }, [dispatch, isDetailsPopUp])

  return (
    <div className="metrics-wrapper">
      <div className="metrics-wrapper__header">
        {renderTitle && <h3 className="metrics-wrapper__header__title">{renderTitle()}</h3>}
        <div className="metrics-wrapper__header__custom-filters">
          <MetricsSelector
            applicationName={applicationNameProp}
            name="metrics"
            disabled={!hasMetricsList}
            metrics={detailsStore.metricsOptions.all}
            onSelect={metrics =>
              dispatch(
                setSelectedMetricsOptions({
                  endpointUid: selectedItem.metadata.uid,
                  metrics
                })
              )
            }
            preselectedMetrics={detailsStore.metricsOptions.preselected}
          />
          <DatePicker
            className="details-date-picker"
            date={detailsStore.dates.value[0]}
            dateTo={detailsStore.dates.value[1]}
            selectedOptionId={detailsStore.dates.selectedOptionId}
            label=""
            onChange={handleChangeDates}
            type="date-range-time"
            timeFrameLimit={TIME_FRAME_LIMITS.MONTH}
            withLabels
          />
        </div>
      </div>
      {generatedMetrics.length === 0 ? (
        !detailsStore.loadingCounter ? (
          requestErrorMessage ? (
            <NoData message={requestErrorMessage} />
          ) : (
            <StatsCard className="metrics__empty-select">
              <MetricsIcon />
              <div>Choose metrics to view endpoint’s data</div>
            </StatsCard>
          )
        ) : null
      ) : (
        <div ref={metricsContainerRef} className="metrics">
          {generatedMetrics.map(([applicationName, applicationMetrics]) => {
            return (
              <React.Fragment key={applicationName}>
                <div className="metrics__app-name">
                  {applicationName === ML_RUN_INFRA || applicationNameProp ? '' : applicationName}
                </div>
                {applicationMetrics.map(metric => {
                  if (applicationName === ML_RUN_INFRA) {
                    if (!metric.data || isEmpty(metric.points)) {
                      return (
                        <React.Fragment key={metric.id}>
                          <NoMetricData
                            className="empty-invocation-card"
                            key={metric.id}
                            title="Endpoint call count"
                            tip="All values are approximate when using sampling to monitor this model endpoint"
                          />
                          {chooseMetricsDataCard}
                        </React.Fragment>
                      )
                    } else {
                      return (
                        <React.Fragment key={metric.id}>
                          <InvocationsMetricCard
                            ref={invocationBodyCardRef}
                            isInvocationCardExpanded={isInvocationCardExpanded}
                            key={metric.id}
                            metric={metric}
                            previousTotalInvocation={previousTotalInvocation}
                            selectedDate={selectedDate}
                            setIsInvocationCardExpanded={setIsInvocationCardExpanded}
                          />
                          {chooseMetricsDataCard}
                        </React.Fragment>
                      )
                    }
                  } else if (!metric.data || isEmpty(metric.points)) {
                    return <NoMetricData key={metric.id} title={metric.title} />
                  } else {
                    return <ApplicationMetricCard metric={metric} key={metric.id} />
                  }
                })}
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

DetailsMetrics.propTypes = {
  applicationNameProp: PropTypes.string,
  selectedItem: PropTypes.object.isRequired,
  renderTitle: PropTypes.func,
  isDetailsPopUp: PropTypes.bool
}

export default React.memo(DetailsMetrics)

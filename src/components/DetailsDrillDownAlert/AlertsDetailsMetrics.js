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

import ApplicationMetricCard from '../DetailsMetrics/ApplicationMetricCard'
import DatePicker from '../../common/DatePicker/DatePicker'
import NoData from '../../common/NoData/NoData'
import NoMetricData from '../DetailsMetrics/NoMetricData'

import { REQUEST_CANCELED } from '../../constants'
import detailsActions from '../../actions/details'
import modelEndpointsActions from '../../actions/modelEndpoints'
import { groupMetricByApplication } from '../../elements/MetricsSelector/metricsSelector.util'

import {
  datePickerPastOptions,
  PAST_24_HOUR_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'

const AlertsDetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const metricsValuesAbortController = useRef(new AbortController())
  const prevSelectedEndPointNameRef = useRef('')
  const [metricOptionsAreLoaded, setMetricOptionsAreLoaded] = useState(false)
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()

  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics, true)
  }, [metrics])

  const handleChangeDates = useCallback(
    (dates, isPredefined, selectedOptionId) => {
      const generatedDates = [...dates]

      if (generatedDates.length === 1) {
        generatedDates.push(new Date())
      }

      dispatch(
        detailsActions.setDetailsDates({
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
      modelEndpointsActions.fetchModelEndpointMetrics(selectedItem.project, selectedItem.uid)
    ).then(() => setMetricOptionsAreLoaded(true))
  }, [dispatch, selectedItem.project, selectedItem.uid])

  const fetchData = useCallback(
    (params, projectName, uid) => {
      metricsValuesAbortController.current = new AbortController()
      return dispatch(
        modelEndpointsActions.fetchModelEndpointMetricsValues(
          projectName,
          uid,
          params,
          metricsValuesAbortController.current,
          setRequestErrorMessage
        )
      ).then(metrics => {
        if (metrics) setMetrics(metrics)
      })
    },
    [dispatch, setMetrics, metricsValuesAbortController]
  )

  useEffect(() => {
    if (selectedItem.uid !== prevSelectedEndPointNameRef.current) {
      prevSelectedEndPointNameRef.current = selectedItem.uid
      return
    }
    if (
      metricOptionsAreLoaded &&
      selectedItem?.uid &&
      detailsStore.metricsOptions.all.length > 0 &&
      detailsStore.metricsOptions.selectedByEndpoint[selectedItem?.uid]
    ) {
      const params = { name: [selectedItem.fullName] }

      if (detailsStore.dates.value[0] && detailsStore.dates.value[1]) {
        params.start = detailsStore.dates.value[0].getTime()
        params.end = detailsStore.dates.value[1].getTime()
      }

      fetchData(params, selectedItem.project, selectedItem.uid).then()
    } else {
      setMetrics([])
    }

    return () => {
      metricsValuesAbortController.current?.abort(REQUEST_CANCELED)
      setMetrics([])
    }
  }, [
    metricOptionsAreLoaded,
    fetchData,
    selectedItem.fullName,
    selectedItem.project,
    selectedItem.uid,
    detailsStore.dates.value,
    detailsStore.metricsOptions.all,
    detailsStore.metricsOptions.selectedByEndpoint,
    setMetrics,
    metricsValuesAbortController
  ])

  return (
    <div className="metrics-wrapper">
      <div className="metrics__custom-filters">
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

      {generatedMetrics.length === 0 && !detailsStore.loadingCounter && requestErrorMessage ? (
        <NoData message={requestErrorMessage} />
      ) : (
        <div className="metrics">
          {generatedMetrics.map(([applicationName, applicationMetrics]) => (
            <React.Fragment key={applicationName}>
              <div className="metrics__app-name">{applicationName}</div>
              {applicationMetrics.map(metric =>
                !metric.data || isEmpty(metric.points) ? (
                  <NoMetricData key={metric.id} title={metric.title} />
                ) : (
                  <ApplicationMetricCard metric={metric} key={metric.id} />
                )
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

AlertsDetailsMetrics.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

export default React.memo(AlertsDetailsMetrics)

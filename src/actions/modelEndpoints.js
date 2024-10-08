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
import modelEndpointsApi from '../api/modelEndpoints-api'
import {
  DEFAULT_ABORT_MSG,
  FETCH_ENDPOINT_METRICS_BEGIN,
  FETCH_ENDPOINT_METRICS_SUCCESS,
  FETCH_ENDPOINT_METRICS_FAILURE,
  FETCH_ENDPOINT_METRICS_VALUES_BEGIN,
  FETCH_ENDPOINT_METRICS_VALUES_SUCCESS,
  FETCH_ENDPOINT_METRICS_VALUES_FAILURE,
  SET_SELECTED_METRICS_OPTIONS
} from '../constants'

import {
  generateMetricsItems,
  parseMetrics
} from '../components/DetailsMetrics/detailsMetrics.util'
import { TIME_FRAME_LIMITS } from '../utils/datePicker.util'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const modelEndpointsActions = {
  fetchModelEndpointMetrics: (project, uid) => dispatch => {
    dispatch(modelEndpointsActions.fetchEndpointMetricsBegin())

    return modelEndpointsApi
      .getModelEndpointMetrics(project, uid)
      .then(({ data = [] }) => {
        const metrics = generateMetricsItems(data)

        dispatch(modelEndpointsActions.fetchEndpointMetricsSuccess({ endpointUid: uid, metrics }))

        return metrics
      })
      .catch(error => {
        dispatch(modelEndpointsActions.fetchEndpointMetricsFailure(error))
      })
  },
  fetchEndpointMetricsBegin: () => ({
    type: FETCH_ENDPOINT_METRICS_BEGIN
  }),
  fetchEndpointMetricsFailure: error => ({
    type: FETCH_ENDPOINT_METRICS_FAILURE,
    payload: error
  }),
  fetchEndpointMetricsSuccess: payload => ({
    type: FETCH_ENDPOINT_METRICS_SUCCESS,
    payload
  }),
  fetchModelEndpointMetricsValues: (
    project,
    uid,
    params,
    abortController,
    setRequestErrorMessage = () => {}
  ) => dispatch => {
    const config = {
      params,
      ui: {
        controller: abortController,
        setRequestErrorMessage,
        customErrorMessage: 'The query result is too large to display. Reduce either the number of metrics or the time period.'
      }
    }

    setRequestErrorMessage('')
    dispatch(modelEndpointsActions.fetchEndpointMetricsValuesBegin())

    return modelEndpointsApi
      .getModelEndpointMetricsValues(project, uid, config)
      .then(({ data = [] }) => {
        const differenceInDays = params.end - params.start
        const timeUnit = differenceInDays > TIME_FRAME_LIMITS['24_HOURS'] ? 'days' : 'hours'
        const metrics = parseMetrics(data, timeUnit)

        dispatch(modelEndpointsActions.fetchEndpointMetricsValuesSuccess())

        return metrics
      })
      .catch(error => {
        dispatch(
          modelEndpointsActions.fetchEndpointMetricsValuesFailure(
            error?.message === DEFAULT_ABORT_MSG ? null : error
          )
        )
        largeResponseCatchHandler(error, 'Failed to fetch metrics', dispatch, setRequestErrorMessage)
      })
  },
  fetchEndpointMetricsValuesBegin: () => ({
    type: FETCH_ENDPOINT_METRICS_VALUES_BEGIN
  }),
  fetchEndpointMetricsValuesFailure: error => ({
    type: FETCH_ENDPOINT_METRICS_VALUES_FAILURE,
    payload: error
  }),
  fetchEndpointMetricsValuesSuccess: () => ({
    type: FETCH_ENDPOINT_METRICS_VALUES_SUCCESS
  }),
  setSelectedMetricsOptions: payload => ({
    type: SET_SELECTED_METRICS_OPTIONS,
    payload
  })
}

export default modelEndpointsActions

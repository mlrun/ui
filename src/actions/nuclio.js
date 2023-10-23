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
import { groupBy, property } from 'lodash'

import nuclioApi from '../api/nuclio'
import {
  FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS,
  FETCH_API_GATEWAYS_BEGIN,
  FETCH_API_GATEWAYS_FAILURE,
  FETCH_API_GATEWAYS_SUCCESS,
  FETCH_NUCLIO_FUNCTIONS_BEGIN,
  FETCH_NUCLIO_FUNCTIONS_FAILURE,
  FETCH_NUCLIO_FUNCTIONS_SUCCESS,
  FETCH_NUCLIO_V3IO_STREAMS_BEGIN,
  FETCH_NUCLIO_V3IO_STREAMS_FAILURE,
  FETCH_NUCLIO_V3IO_STREAMS_SUCCESS,
  FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_BEGIN,
  FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_FAILURE,
  FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_SUCCESS,
  REMOVE_V3IO_STREAMS,
  RESET_V3IO_STREAMS_ERROR,
  RESET_V3IO_STREAM_SHARD_LAG_ERROR
} from '../constants'
import { parseV3ioStreams } from '../utils/parseV3ioStreams'
import { parseV3ioStreamShardLags } from '../utils/parseV3ioStreamShardLags'

const nuclioActions = {
  fetchApiGateways: project => dispatch => {
    dispatch(nuclioActions.fetchApiGatewaysBegin())

    return nuclioApi
      .getApiGateways(project)
      .then(({ data }) => {
        dispatch(nuclioActions.fetchApiGatewaysSuccess(Object.keys(data).length))
      })
      .catch(error => {
        dispatch(nuclioActions.fetchApiGatewaysFailure(error.message))
      })
  },
  fetchApiGatewaysBegin: () => ({
    type: FETCH_API_GATEWAYS_BEGIN
  }),
  fetchApiGatewaysFailure: error => ({
    type: FETCH_API_GATEWAYS_FAILURE,
    payload: error
  }),
  fetchApiGatewaysSuccess: apiGateways => ({
    type: FETCH_API_GATEWAYS_SUCCESS,
    payload: apiGateways
  }),
  fetchNuclioFunctions: project => dispatch => {
    dispatch(nuclioActions.fetchNuclioFunctionsBegin())

    return nuclioApi
      .getFunctions(project)
      .then(({ data }) => {
        if (project) {
          dispatch(nuclioActions.fetchNuclioFunctionsSuccess(Object.values(data)))
        } else {
          let functionsByProject = groupBy(
            data,
            property(['metadata', 'labels', 'nuclio.io/project-name'])
          )

          dispatch(nuclioActions.fetchAllNuclioFunctionsSuccess(functionsByProject))
        }
      })
      .catch(error => {
        dispatch(nuclioActions.fetchNuclioFunctionsFailure(error.message))
      })
  },
  fetchNuclioFunctionsBegin: () => ({
    type: FETCH_NUCLIO_FUNCTIONS_BEGIN
  }),
  fetchNuclioFunctionsFailure: error => ({
    type: FETCH_NUCLIO_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchNuclioFunctionsSuccess: functions => ({
    type: FETCH_NUCLIO_FUNCTIONS_SUCCESS,
    payload: functions
  }),
  fetchAllNuclioFunctionsSuccess: functions => ({
    type: FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS,
    payload: functions
  }),
  fetchNuclioV3ioStreamShardLags: (project, body) => dispatch => {
    dispatch(nuclioActions.fetchNuclioV3ioStreamShardLagsBegin())

    return nuclioApi
      .getV3ioStreamShardLags(project, body)
      .then(({ data }) => {
        const parsedV3ioStreamShardLags = parseV3ioStreamShardLags(data, body)

        return dispatch(
          nuclioActions.fetchNuclioV3ioStreamShardLagsSuccess({
            data,
            parsedData: parsedV3ioStreamShardLags
          })
        )
      })
      .catch(error => {
        dispatch(nuclioActions.fetchNuclioV3ioStreamShardLagsFailure(error))
      })
  },
  fetchNuclioV3ioStreamShardLagsBegin: () => ({
    type: FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_BEGIN
  }),
  fetchNuclioV3ioStreamShardLagsFailure: error => ({
    type: FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_FAILURE,
    payload: error
  }),
  fetchNuclioV3ioStreamShardLagsSuccess: summary => ({
    type: FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_SUCCESS,
    payload: summary
  }),
  fetchNuclioV3ioStreams: project => dispatch => {
    dispatch(nuclioActions.fetchNuclioV3ioStreamsBegin())

    return nuclioApi
      .getV3ioStreams(project)
      .then(({ data }) => {
        const parsedV3ioStreams = parseV3ioStreams(data)

        return dispatch(
          nuclioActions.fetchNuclioV3ioStreamsSuccess({
            data: data,
            parsedData: parsedV3ioStreams
          })
        )
      })
      .catch(error => {
        dispatch(nuclioActions.fetchNuclioV3ioStreamsFailure(error))
      })
  },
  fetchNuclioV3ioStreamsBegin: () => ({
    type: FETCH_NUCLIO_V3IO_STREAMS_BEGIN
  }),
  fetchNuclioV3ioStreamsFailure: error => ({
    type: FETCH_NUCLIO_V3IO_STREAMS_FAILURE,
    payload: error
  }),
  fetchNuclioV3ioStreamsSuccess: summary => ({
    type: FETCH_NUCLIO_V3IO_STREAMS_SUCCESS,
    payload: summary
  }),
  removeV3ioStreams: () => ({
    type: REMOVE_V3IO_STREAMS
  }),
  resetV3ioStreamsError: () => ({
    type: RESET_V3IO_STREAMS_ERROR
  }),
  resetV3ioStreamShardLagsError: () => ({
    type: RESET_V3IO_STREAM_SHARD_LAG_ERROR
  })
}

export default nuclioActions

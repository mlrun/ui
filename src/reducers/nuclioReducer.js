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

const initialState = {
  apiGateways: 0,
  functions: {},
  v3ioStreams: {
    error: null,
    loading: false,
    data: {},
    parsedData: []
  },
  v3ioStreamShardLags: {
    error: null,
    loading: false,
    data: {},
    parsedData: []
  },
  currentProjectFunctions: [],
  loading: false,
  error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_ALL_NUCLIO_FUNCTIONS_SUCCESS:
      return {
        ...state,
        functions: payload,
        loading: false,
        error: null
      }
    case FETCH_API_GATEWAYS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_API_GATEWAYS_FAILURE:
      return {
        ...state,
        apiGateways: 0,
        error: payload,
        loading: false
      }
    case FETCH_API_GATEWAYS_SUCCESS:
      return {
        ...state,
        apiGateways: payload,
        loading: false
      }
    case FETCH_NUCLIO_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_NUCLIO_FUNCTIONS_FAILURE:
      return {
        ...state,
        functions: [],
        loading: false,
        error: payload
      }
    case FETCH_NUCLIO_FUNCTIONS_SUCCESS:
      return {
        ...state,
        currentProjectFunctions: payload,
        loading: false,
        error: null
      }
    case FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_BEGIN:
      return {
        ...state,
        v3ioStreamShardLags: {
          loading: true,
          error: null,
          data: {},
          parsedData: []
        }
      }
    case FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_FAILURE:
      return {
        ...state,
        v3ioStreamShardLags: {
          loading: false,
          error: payload,
          data: {},
          parsedData: []
        }
      }
    case FETCH_NUCLIO_V3IO_STREAM_SHARD_LAGS_SUCCESS:
      return {
        ...state,
        v3ioStreamShardLags: {
          loading: false,
          error: null,
          data: payload.data,
          parsedData: payload.parsedData
        }
      }
    case FETCH_NUCLIO_V3IO_STREAMS_BEGIN:
      return {
        ...state,
        v3ioStreams: {
          loading: true,
          error: null,
          data: {},
          parsedData: []
        }
      }
    case FETCH_NUCLIO_V3IO_STREAMS_FAILURE:
      return {
        ...state,
        v3ioStreams: {
          loading: false,
          error: payload,
          data: {},
          parsedData: []
        }
      }
    case FETCH_NUCLIO_V3IO_STREAMS_SUCCESS:
      return {
        ...state,
        v3ioStreams: {
          loading: false,
          error: null,
          data: payload.data,
          parsedData: payload.parsedData
        }
      }
    case REMOVE_V3IO_STREAMS:
      return {
        ...state,
        v3ioStreams: {
          loading: false,
          error: null,
          data: {},
          parsedData: []
        }
      }
    case RESET_V3IO_STREAMS_ERROR:
      return {
        ...state,
        v3ioStreams: {
          ...state.v3ioStreams,
          error: null
        }
      }
    case RESET_V3IO_STREAM_SHARD_LAG_ERROR:
      return {
        ...state,
        v3ioStreamShardLags: {
          ...state.v3ioStreamShardLags,
          error: null
        }
      }
    default:
      return state
  }
}

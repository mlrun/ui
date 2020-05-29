import {
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  SHOW_ARTIFACT_PREVIEW,
  CLOSE_ARTIFACT_PREVIEW
} from '../constants'

const initialState = {
  artifacts: [],
  loading: false,
  error: null,
  preview: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_ARTIFACTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_ARTIFACTS_SUCCESS:
      return {
        ...state,
        artifacts: payload,
        loading: false
      }
    case FETCH_ARTIFACTS_FAILURE:
      return {
        ...state,
        artifacts: [],
        loading: false,
        error: payload
      }
    case SHOW_ARTIFACT_PREVIEW:
      return {
        ...state,
        preview: payload
      }
    case CLOSE_ARTIFACT_PREVIEW:
      return {
        ...state,
        preview: payload
      }
    default:
      return state
  }
}

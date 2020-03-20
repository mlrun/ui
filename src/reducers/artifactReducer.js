import {
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS
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
    // case FETCH_ARTIFACT_PREVIEW_BEGIN:
    //   return {
    //     ...state,
    //     loading: true
    //   }
    // case FETCH_ARTIFACT_PREVIEW_SUCCESS:
    //   return {
    //     ...state,
    //     preview: payload,
    //     loading: false
    //   }
    // case FETCH_ARTIFACT_PREVIEW_FAILURE:
    //   return {
    //     ...state,
    //     preview: {},
    //     error: payload,
    //     loading: false
    //   }
    default:
      return state
  }
}

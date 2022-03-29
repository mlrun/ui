import { FETCH_FRONTEND_SPEC_SUCCESS } from '../constants'

const initialState = {
  frontendSpec: {}
}

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_FRONTEND_SPEC_SUCCESS:
      return {
        ...state,
        frontendSpec: payload
      }
    default:
      return state
  }
}

export default appReducer

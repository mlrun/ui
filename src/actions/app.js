import appApi from '../api/app-api'
import { FETCH_FRONTEND_SPEC_SUCCESS } from '../constants'

const appActions = {
  fetchFrontendSpec: () => dispatch => {
    return appApi.getFrontendSpec().then(({ data }) => {
      dispatch({
        type: FETCH_FRONTEND_SPEC_SUCCESS,
        payload: data
      })
    })
  }
}

export default appActions

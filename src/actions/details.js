import detailsApi from '../api/details-api'
import {
  FETCH_JOB_PODS_SUCCESS,
  FETCH_JOB_PODS_FAILURE,
  REMOVE_JOB_PODS
} from '../constants'
import { generatePods } from '../utils/generatePods'

const detailsActions = {
  fetchJobPods: (project, uid) => dispatch => {
    return detailsApi
      .getJobPods(project)
      .then(({ data }) => {
        let podsData = generatePods(uid, data)

        dispatch(detailsActions.fetchPodsSuccess(podsData))

        return podsData
      })
      .catch(err => {
        dispatch(detailsActions.fetchPodsFailure(err))
      })
  },
  fetchPodsSuccess: pods => ({
    type: FETCH_JOB_PODS_SUCCESS,
    payload: pods
  }),
  fetchPodsFailure: error => ({
    type: FETCH_JOB_PODS_FAILURE,
    payload: error
  }),
  removePods: () => ({
    type: REMOVE_JOB_PODS
  })
}

export default detailsActions

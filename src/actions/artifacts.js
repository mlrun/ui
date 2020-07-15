import artifactsApi from '../api/artifacts-api'
import {
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  REMOVE_ARTIFACTS,
  SHOW_ARTIFACT_PREVIEW
} from '../constants'

const artifactsAction = {
  fetchArtifacts: item => dispatch => {
    dispatch(artifactsAction.fetchArtifactsBegin())
    return artifactsApi
      .getArtifacts(item)
      .then(({ data }) => {
        let artifacts = Object.values(
          data.artifacts.reduce((prev, curr) => {
            if (!prev[curr.db_key])
              prev[curr.db_key] = { key: curr.db_key, data: [] }

            if ('link_iteration' in curr) {
              prev[curr.db_key] = Object.assign(prev[curr.db_key], {
                link_iteration: curr
              })
            } else {
              prev[curr.db_key].data.push(curr)
            }
            return prev
          }, {})
        )

        dispatch(artifactsAction.fetchArtifactsSuccess(artifacts))
        return artifacts
      })
      .catch(err => dispatch(artifactsAction.fetchArtifactsFailure(err)))
  },
  fetchArtifactsBegin: () => ({
    type: FETCH_ARTIFACTS_BEGIN
  }),
  fetchArtifactsSuccess: artifactsList => ({
    type: FETCH_ARTIFACTS_SUCCESS,
    payload: artifactsList
  }),
  fetchArtifactsFailure: error => ({
    type: FETCH_ARTIFACTS_FAILURE,
    payload: error
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  }),
  closeArtifactsPreview: item => ({
    type: CLOSE_ARTIFACT_PREVIEW,
    payload: item
  }),
  removeArtifacts: () => ({
    type: REMOVE_ARTIFACTS
  })
}

export default artifactsAction

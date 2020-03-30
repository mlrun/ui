import artifactsApi from '../api/artifacts-api'
import {
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS
} from '../constants'

const artifactsAction = {
  fetchArtifacts: item => dispatch => {
    dispatch(artifactsAction.fetchArtifactsBegin())
    return artifactsApi
      .getArtifacts(item)
      .then(({ data }) => {
        let artifacts = Object.values(
          data.artifacts.reduce((prev, curr) => {
            if (!prev[curr.key]) prev[curr.key] = { key: curr.key, data: [] }
            if ('link_iteration' in curr) {
              prev[curr.key] = Object.assign(prev[curr.key], {
                link_iteration: curr
              })
            } else {
              prev[curr.key].data.push(curr)
            }
            return prev
          }, {})
        )

        dispatch(artifactsAction.fetchArtifactsSuccess(artifacts))

        return artifacts
      })
      .catch(() => dispatch(artifactsAction.fetchArtifactsFailure()))
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
  })
  // fetchArtifactPreview: (schema, path) => dispatch => {
  //   dispatch(artifactsAction.fetchArtifactPreviewBegin())
  //
  //   return artifactsApi
  //     .getArtifactPreview(schema, path)
  //     .then(handleErrors)
  //     .then(res => {
  //       const preview = createArtifactPreviewContent(res)
  //
  //       dispatch(artifactsAction.fetchArtifactPreviewSuccess(preview))
  //     })
  //     .catch(error =>
  //       dispatch(artifactsAction.fetchArtifactPreviewFailure(error))
  //     )
  // },
  // fetchArtifactPreviewBegin: () => ({
  //   type: FETCH_ARTIFACT_PREVIEW_BEGIN
  // }),
  // fetchArtifactPreviewSuccess: preview => ({
  //   type: FETCH_ARTIFACT_PREVIEW_SUCCESS,
  //   payload: preview
  // }),
  // fetchArtifactPreviewFailure: error => ({
  //   type: FETCH_ARTIFACT_PREVIEW_FAILURE,
  //   payload: error
  // })
}

export default artifactsAction

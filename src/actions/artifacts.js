import artifactsApi from '../api/artifacts-api'
import { parseKeyValues, truncateUid } from '../utils'
const artifactsAction = {
  fetchArtifacts: () => dispatch => {
    return artifactsApi.getArtifacts().then(({ data }) => {
      const newArtifacts = data.artifacts.map(item => {
        return Object.assign(item, {
          labels: parseKeyValues(item.labels),
          hash: truncateUid(item.hash)
        })
      })
      dispatch(artifactsAction.setArtifacts({ artifacts: newArtifacts }))
      return newArtifacts
    })
  },
  setArtifacts: artifactsList => ({
    type: 'SET_ARTIFACTS',
    payload: artifactsList
  })
}

export default artifactsAction

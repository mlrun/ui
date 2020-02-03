import artifactsApi from '../api/artifacts-api'
import { parseKeyValues } from '../utils'
// import artifactsMock from '../artifacts.json'
const artifactsAction = {
  fetchArtifacts: () => dispatch => {
    return artifactsApi.getArtifacts().then(({ data }) => {
      // data.artifacts = artifactsMock.artifacts
      const newArtifacts = data.artifacts.map(item => {
        return Object.assign(item, {
          labels: parseKeyValues(item.labels)
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

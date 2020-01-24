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
  }),
  refreshArtifacts: state => {
    return {
      type: 'REFRESH_ARTIFACTS',
      payload: state
    }
  }
}

export default artifactsAction

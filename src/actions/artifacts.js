import artifactsApi from '../api/artifacts-api'

const artifactsAction = {
  fetchArtifacts: item => dispatch => {
    return artifactsApi.getArtifacts(item).then(({ data }) => {
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

      dispatch(artifactsAction.setArtifacts({ artifacts: artifacts }))
      return artifacts
    })
  },
  selectArtifact: selectArtifact => ({
    type: 'SELECT_ARTIFACT',
    payload: selectArtifact
  }),
  setArtifacts: artifactsList => ({
    type: 'SET_ARTIFACTS',
    payload: artifactsList
  })
}

export default artifactsAction

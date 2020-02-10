import artifactsApi from '../api/artifacts-api'
import { parseKeyValues } from '../utils'
import _ from 'lodash'

// import artifactsMock from '../artifacts.json'
const artifactsAction = {
  fetchArtifacts: () => dispatch => {
    return artifactsApi.getArtifacts().then(({ data }) => {
      let groupArtifacts = _(data.artifacts)
        .groupBy('key')
        .mapValues(item => _.groupBy(item, 'tree'))
        .value()

      let newArtifacts = []

      for (const key in groupArtifacts) {
        let newTree = []
        for (const _key in groupArtifacts[key]) {
          let group = groupArtifacts[key][_key].map(item => {
            return Object.assign(item, { labels: parseKeyValues(item.labels) })
          })
          newTree.push(group)
        }
        newArtifacts.push({
          key: key,
          tree: newTree
        })
      }
      dispatch(artifactsAction.setArtifacts({ artifacts: newArtifacts }))
      return newArtifacts
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

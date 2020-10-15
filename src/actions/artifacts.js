import artifactsApi from '../api/artifacts-api'
import {
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  REMOVE_ARTIFACTS,
  REMOVE_DATASETS,
  SHOW_ARTIFACT_PREVIEW,
  SET_ARTIFACT_FILTER
} from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'

const artifactsAction = {
  closeArtifactsPreview: item => ({
    type: CLOSE_ARTIFACT_PREVIEW,
    payload: item
  }),
  fetchArtifacts: item => dispatch => {
    dispatch(artifactsAction.fetchArtifactsBegin())

    return artifactsApi
      .getArtifacts(item)
      .then(({ data }) => {
        let artifacts = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchArtifactsSuccess(artifacts))

        return artifacts
      })
      .catch(err => {
        dispatch(artifactsAction.fetchArtifactsFailure(err))
      })
  },
  fetchArtifactsBegin: () => ({
    type: FETCH_ARTIFACTS_BEGIN
  }),
  fetchArtifactsFailure: error => ({
    type: FETCH_ARTIFACTS_FAILURE,
    payload: error
  }),
  fetchArtifactsSuccess: artifactsList => ({
    type: FETCH_ARTIFACTS_SUCCESS,
    payload: artifactsList
  }),
  fetchDataSets: project => dispatch => {
    console.log('here')
    dispatch(artifactsAction.fetchDataSetsBegin())

    return artifactsApi
      .getArtifactsDataSets(project)
      .then(({ data }) => {
        let dataSets = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchDataSetsSuccess(dataSets))

        return dataSets
      })
      .catch(err => {
        dispatch(artifactsAction.fetchDataSetsFailure(err))
      })
  },
  fetchDataSetsBegin: () => ({
    type: FETCH_DATASETS_BEGIN
  }),
  fetchDataSetsFailure: () => ({
    type: FETCH_DATASETS_FAILURE
  }),
  fetchDataSetsSuccess: dataSets => ({
    type: FETCH_DATASETS_SUCCESS,
    payload: dataSets
  }),
  removeArtifacts: () => ({
    type: REMOVE_ARTIFACTS
  }),
  removeDataSets: () => ({
    type: REMOVE_DATASETS
  }),
  setArtifactFilter: filter => ({
    type: SET_ARTIFACT_FILTER,
    payload: filter
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  })
}

export default artifactsAction

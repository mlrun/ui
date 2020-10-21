import artifactsApi from '../api/artifacts-api'
import {
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
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
  fetchFiles: project => dispatch => {
    dispatch(artifactsAction.fetchFilesBegin())

    return artifactsApi
      .getArtifactsFiles(project)
      .then(({ data }) => {
        let files = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchFilesSuccess(files))

        return files
      })
      .catch(err => {
        dispatch(artifactsAction.fetchFilesFailure(err))
      })
  },
  fetchFilesBegin: () => ({
    type: FETCH_FILES_BEGIN
  }),
  fetchFilesFailure: () => ({
    type: FETCH_FILES_FAILURE
  }),
  fetchFilesSuccess: files => ({
    type: FETCH_FILES_SUCCESS,
    payload: files
  }),
  fetchModels: project => dispatch => {
    dispatch(artifactsAction.fetchModelsBegin())

    return artifactsApi
      .getArtifactsModels(project)
      .then(({ data }) => {
        let models = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchModelsSuccess(models))

        return models
      })
      .catch(err => {
        dispatch(artifactsAction.fetchModelsFailure(err))
      })
  },
  fetchModelsBegin: () => ({
    type: FETCH_MODELS_BEGIN
  }),
  fetchModelsFailure: () => ({
    type: FETCH_MODELS_FAILURE
  }),
  fetchModelsSuccess: models => ({
    type: FETCH_MODELS_SUCCESS,
    payload: models
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

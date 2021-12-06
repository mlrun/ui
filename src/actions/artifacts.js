import artifactsApi from '../api/artifacts-api'
import functionsApi from '../api/functions-api'
import {
  BUILD_FUNCTION_BEGIN,
  BUILD_FUNCTION_FAILURE,
  BUILD_FUNCTION_SUCCESS,
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATA_SET_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FILE_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_MODEL_ENDPOINTS_BEGIN,
  FETCH_MODEL_ENDPOINTS_FAILURE,
  FETCH_MODEL_ENDPOINTS_SUCCESS,
  FETCH_MODEL_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
  REMOVE_ARTIFACTS,
  REMOVE_ARTIFACTS_ERROR,
  REMOVE_DATASET,
  REMOVE_DATASETS,
  REMOVE_FILE,
  REMOVE_FILES,
  REMOVE_MODEL,
  REMOVE_MODELS,
  SHOW_ARTIFACT_PREVIEW
} from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'
import { generateArtifacts } from '../utils/generateArtifacts'
import { getArtifactIdentifier } from '../utils/getUniqueIdentifier'
import { generateModelEndpoints } from '../utils/generateModelEndpoints'

const artifactsAction = {
  buildFunction: func => dispatch => {
    dispatch(artifactsAction.buildFunctionBegin())

    return artifactsApi
      .buildFunction(func)
      .then(result => {
        dispatch(artifactsAction.buildFunctionSuccess())

        return result
      })
      .catch(err => {
        dispatch(artifactsAction.buildFunctionFailure(err))
      })
  },
  buildFunctionBegin: () => ({
    type: BUILD_FUNCTION_BEGIN
  }),
  buildFunctionFailure: error => ({
    type: BUILD_FUNCTION_FAILURE,
    payload: error
  }),
  buildFunctionSuccess: () => ({
    type: BUILD_FUNCTION_SUCCESS
  }),
  closeArtifactsPreview: item => ({
    type: CLOSE_ARTIFACT_PREVIEW,
    payload: item
  }),
  createNewFeatureVector: data => () => artifactsApi.createFeatureVector(data),
  fetchArtifact: (project, artifact) => () => {
    return artifactsApi.getArtifact(project, artifact).then(({ data }) => {
      return filterArtifacts(data.artifacts)
    })
  },
  fetchArtifacts: (project, filters) => dispatch => {
    dispatch(artifactsAction.fetchArtifactsBegin())

    return artifactsApi
      .getArtifacts(project, filters)
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
  fetchArtifactTags: project => () => artifactsApi.getArtifactTag(project),
  fetchDataSet: (project, dataSet, iter) => dispatch => {
    return artifactsApi
      .getDataSet(project, dataSet)
      .then(response => {
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(response.data.artifacts),
          iter
        )

        dispatch(
          artifactsAction.fetchDataSetSuccess({
            [getArtifactIdentifier(generatedArtifacts[0])]: generatedArtifacts
          })
        )

        return response.data.artifacts
      })
      .catch(error => {
        throw error
      })
  },
  fetchDataSetSuccess: dataSets => ({
    type: FETCH_DATA_SET_SUCCESS,
    payload: dataSets
  }),
  fetchDataSets: (project, filters, config) => dispatch => {
    dispatch(artifactsAction.fetchDataSetsBegin())

    return artifactsApi
      .getDataSets(project, filters, config)
      .then(({ data }) => {
        dispatch(
          artifactsAction.fetchDataSetsSuccess(
            generateArtifacts(filterArtifacts(data.artifacts))
          )
        )

        return data.artifacts
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
  fetchFile: (project, file, iter) => dispatch => {
    return artifactsApi
      .getFile(project, file)
      .then(response => {
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(response.data.artifacts),
          iter
        )

        dispatch(
          artifactsAction.fetchFileSuccess({
            [getArtifactIdentifier(generatedArtifacts[0])]: generatedArtifacts
          })
        )

        return response.data.artifacts
      })
      .catch(error => {
        throw error
      })
  },
  fetchFileSuccess: files => ({
    type: FETCH_FILE_SUCCESS,
    payload: files
  }),
  fetchFiles: (project, filters) => dispatch => {
    dispatch(artifactsAction.fetchFilesBegin())

    return artifactsApi
      .getFiles(project, filters)
      .then(({ data }) => {
        dispatch(
          artifactsAction.fetchFilesSuccess(
            generateArtifacts(filterArtifacts(data.artifacts))
          )
        )

        return data.artifacts
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
  fetchFunctions: projectName => dispatch => {
    dispatch(artifactsAction.fetchFunctionsBegin())

    return functionsApi
      .getAll(projectName)
      .then(({ data }) => {
        dispatch(artifactsAction.fetchFunctionsSuccess())

        return data.funcs
      })
      .catch(err => {
        dispatch(artifactsAction.fetchFunctionsFailure(err))
      })
  },
  fetchFunctionsBegin: () => ({
    type: FETCH_FUNCTIONS_BEGIN
  }),
  fetchFunctionsFailure: error => ({
    type: FETCH_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchFunctionsSuccess: () => ({
    type: FETCH_FUNCTIONS_SUCCESS
  }),
  fetchModelEndpoints: (project, filters, params) => dispatch => {
    dispatch(artifactsAction.fetchModelEndpointsBegin())

    return artifactsApi
      .getModelEndpoints(project, filters, params)
      .then(({ data: { endpoints = [] } }) => {
        dispatch(
          artifactsAction.fetchModelEndpointsSuccess(
            generateModelEndpoints(endpoints)
          )
        )

        return endpoints
      })
      .catch(err => {
        dispatch(artifactsAction.fetchModelEndpointsFailure(err))
      })
  },
  fetchModelEndpointsBegin: () => ({
    type: FETCH_MODEL_ENDPOINTS_BEGIN
  }),
  fetchModelEndpointsFailure: () => ({
    type: FETCH_MODEL_ENDPOINTS_FAILURE
  }),
  fetchModelEndpointsSuccess: models => ({
    type: FETCH_MODEL_ENDPOINTS_SUCCESS,
    payload: models
  }),
  fetchModel: (project, model, iter) => dispatch => {
    return artifactsApi
      .getModel(project, model)
      .then(response => {
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(response.data.artifacts),
          iter
        )

        dispatch(
          artifactsAction.fetchModelSuccess({
            [getArtifactIdentifier(generatedArtifacts[0])]: generatedArtifacts
          })
        )

        return response.data.artifacts
      })
      .catch(error => {
        throw error
      })
  },
  fetchModelSuccess: models => ({
    type: FETCH_MODEL_SUCCESS,
    payload: models
  }),
  fetchModels: (project, filters) => dispatch => {
    dispatch(artifactsAction.fetchModelsBegin())

    return artifactsApi
      .getModels(project, filters)
      .then(({ data }) => {
        dispatch(
          artifactsAction.fetchModelsSuccess(
            generateArtifacts(filterArtifacts(data.artifacts))
          )
        )

        return data.artifacts
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
  removeArtifactsError: () => ({
    type: REMOVE_ARTIFACTS_ERROR
  }),
  removeDataSet: dataSets => ({
    type: REMOVE_DATASET,
    payload: dataSets
  }),
  removeDataSets: () => ({
    type: REMOVE_DATASETS
  }),
  removeFile: files => ({
    type: REMOVE_FILE,
    payload: files
  }),
  removeFiles: () => ({
    type: REMOVE_FILES
  }),
  removeModel: models => ({
    type: REMOVE_MODEL,
    payload: models
  }),
  removeModels: () => ({
    type: REMOVE_MODELS
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  })
}

export default artifactsAction

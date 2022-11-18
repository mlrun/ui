/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import artifactsApi from '../api/artifacts-api'
import functionsApi from '../api/functions-api'
import {
  ARTIFACTS,
  BUILD_FUNCTION_BEGIN,
  BUILD_FUNCTION_FAILURE,
  BUILD_FUNCTION_SUCCESS,
  CLOSE_ARTIFACT_PREVIEW,
  DATASETS,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_FUNCTIONS_BEGIN,
  FETCH_ARTIFACTS_FUNCTIONS_FAILURE,
  FETCH_ARTIFACTS_FUNCTIONS_SUCCESS,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATA_SET_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FILE_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_MODEL_ENDPOINTS_BEGIN,
  FETCH_MODEL_ENDPOINTS_FAILURE,
  FETCH_MODEL_ENDPOINTS_SUCCESS,
  FETCH_MODEL_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
  MODELS_TAB,
  REMOVE_ARTIFACTS,
  REMOVE_ARTIFACTS_ERROR,
  REMOVE_DATASET,
  REMOVE_DATASETS,
  REMOVE_FILE,
  REMOVE_FILES,
  REMOVE_MODEL,
  REMOVE_MODEL_ENDPOINTS,
  REMOVE_MODELS,
  REMOVE_PIPELINES,
  SHOW_ARTIFACT_PREVIEW
} from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'
import { generateArtifacts } from '../utils/generateArtifacts'
import { getArtifactIdentifier } from '../utils/getUniqueIdentifier'
import { generateModelEndpoints } from '../utils/generateModelEndpoints'
import { parseArtifacts } from '../utils/parseArtifacts'
import { parseFunctions } from '../utils/parseFunctions'

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
  fetchArtifactTags: (project, category) => () => artifactsApi.getArtifactTag(project, category),
  fetchDataSet: (project, dataSet, iter, tag) => dispatch => {
    return artifactsApi
      .getDataSet(project, dataSet, iter, tag)
      .then(response => {
        const result = parseArtifacts(response.data.artifacts)
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(result),
          DATASETS,
          response.data.artifacts
        )

        dispatch(
          artifactsAction.fetchDataSetSuccess({
            [getArtifactIdentifier(generatedArtifacts[0])]: generatedArtifacts
          })
        )

        return generatedArtifacts
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
        const result = parseArtifacts(data.artifacts)
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(result),
          DATASETS,
          data.artifacts
        )

        dispatch(artifactsAction.fetchDataSetsSuccess(generatedArtifacts))

        return generatedArtifacts
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
  fetchFile: (project, file, iter, tag) => dispatch => {
    return artifactsApi
      .getFile(project, file, iter, tag)
      .then(response => {
        const result = parseArtifacts(response.data.artifacts)
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(result),
          ARTIFACTS,
          response.data.artifacts
        )

        dispatch(
          artifactsAction.fetchFileSuccess({
            [getArtifactIdentifier(generatedArtifacts[0])]: generatedArtifacts
          })
        )

        return generatedArtifacts
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
        const result = parseArtifacts(data.artifacts)
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(result),
          ARTIFACTS,
          data.artifacts
        )

        dispatch(artifactsAction.fetchFilesSuccess(generatedArtifacts))

        return generatedArtifacts
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
  fetchFunctions:
    (project, filters, showLoader = true) =>
    dispatch => {
      dispatch(artifactsAction.fetchFunctionsBegin(showLoader))

      return functionsApi
        .getFunctions(project, filters)
        .then(({ data }) => {
          const result = parseFunctions(
            data.funcs.filter(func => func.kind === 'serving' && func.metadata.tag?.length)
          )
          dispatch(artifactsAction.fetchFunctionsSuccess(result))

          return result
        })
        .catch(err => {
          dispatch(artifactsAction.fetchFunctionsFailure(err))
        })
    },
  fetchFunctionsBegin: showLoader => ({
    type: FETCH_ARTIFACTS_FUNCTIONS_BEGIN,
    payload: showLoader
  }),
  fetchFunctionsFailure: error => ({
    type: FETCH_ARTIFACTS_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchFunctionsSuccess: () => ({
    type: FETCH_ARTIFACTS_FUNCTIONS_SUCCESS
  }),
  fetchModelEndpoints: (project, filters, params) => dispatch => {
    dispatch(artifactsAction.fetchModelEndpointsBegin())

    return artifactsApi
      .getModelEndpoints(project, filters, params)
      .then(({ data: { endpoints = [] } }) => {
        const result = generateModelEndpoints(endpoints)

        dispatch(artifactsAction.fetchModelEndpointsSuccess(result))

        return result
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
  fetchModel: (project, model, iter, tag) => dispatch => {
    return artifactsApi
      .getModel(project, model, iter, tag)
      .then(response => {
        const result = parseArtifacts(response.data.artifacts)
        const generatedArtifacts = generateArtifacts(
          filterArtifacts(result),
          MODELS_TAB,
          response.data.artifacts
        )

        dispatch(
          artifactsAction.fetchModelSuccess({
            [getArtifactIdentifier(generatedArtifacts[0])]: generatedArtifacts
          })
        )

        return generatedArtifacts
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
        const result = filterArtifacts(parseArtifacts(data.artifacts))
        const generatedArtifacts = generateArtifacts(result, MODELS_TAB, data.artifacts)

        dispatch(artifactsAction.fetchModelsSuccess(generatedArtifacts))

        return generatedArtifacts
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
  removeModelEndpoints: () => ({
    type: REMOVE_MODEL_ENDPOINTS
  }),
  removeModels: () => ({
    type: REMOVE_MODELS
  }),
  removePipelines: () => ({
    type: REMOVE_PIPELINES
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  }),
  updateArtifact: (project, data) => () => {
    return artifactsApi.updateArtifact(project, data)
  }
}

export default artifactsAction

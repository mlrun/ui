import artifactsApi from '../api/artifacts-api'
import functionsApi from '../api/functions-api'
import {
  BUILD_FUNCTION_BEGIN,
  BUILD_FUNCTION_FAILURE,
  BUILD_FUNCTION_SUCCESS,
  CLOSE_ARTIFACT_PREVIEW,
  CREATE_NEW_FEATURE_SET_BEGIN,
  CREATE_NEW_FEATURE_SET_FAILURE,
  CREATE_NEW_FEATURE_SET_SUCCESS,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATA_SET_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FEATURE_SETS_BEGIN,
  FETCH_FEATURE_SETS_FAILURE,
  FETCH_FEATURE_SETS_SUCCESS,
  FETCH_FEATURE_SUCCESS,
  FETCH_FEATURE_VECTOR_SUCCESS,
  FETCH_FEATURE_VECTORS_BEGIN,
  FETCH_FEATURE_VECTORS_FAILURE,
  FETCH_FEATURE_VECTORS_SUCCESS,
  FETCH_FEATURES_BEGIN,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_SUCCESS,
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
  REMOVE_FEATURE,
  REMOVE_FEATURE_SETS,
  REMOVE_FEATURE_VECTOR,
  REMOVE_FEATURE_VECTORS,
  REMOVE_FEATURES,
  REMOVE_FILE,
  REMOVE_FILES,
  REMOVE_MODEL,
  REMOVE_MODELS,
  REMOVE_NEW_FEATURE_SET,
  SET_ARTIFACT_FILTER,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KEY,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KIND,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_URL,
  SET_NEW_FEATURE_SET_DESCRIPTION,
  SET_NEW_FEATURE_SET_LABELS,
  SET_NEW_FEATURE_SET_NAME,
  SET_NEW_FEATURE_SET_SCHEDULE,
  SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY,
  SET_NEW_FEATURE_SET_TARGET,
  SET_NEW_FEATURE_SET_VERSION,
  SHOW_ARTIFACT_PREVIEW,
  START_FEATURE_SET_INGEST_BEGIN,
  START_FEATURE_SET_INGEST_SUCCESS
} from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'
import { parseFeatureVectors } from '../utils/parseFeatureVectors'
import { parseFeatures } from '../utils/parseFeatures'
import { generateArtifacts } from '../utils/generateArtifacts'

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
  createNewFeatureSet: (project, data) => dispatch => {
    dispatch(artifactsAction.createNewFeatureSetBegin())

    return artifactsApi
      .createFeatureSet(project, data)
      .then(result => {
        dispatch(artifactsAction.createNewFeatureSetSuccess())
        return result
      })
      .catch(error => {
        dispatch(artifactsAction.createNewFeatureSetFailure(error.message))

        throw error
      })
  },
  createNewFeatureSetBegin: () => ({
    type: CREATE_NEW_FEATURE_SET_BEGIN
  }),
  createNewFeatureSetFailure: error => ({
    type: CREATE_NEW_FEATURE_SET_FAILURE,
    payload: error
  }),
  createNewFeatureSetSuccess: () => ({
    type: CREATE_NEW_FEATURE_SET_SUCCESS
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
  fetchDataSet: (project, dataSet) => dispatch => {
    return artifactsApi
      .getDataSet(project, dataSet)
      .then(response => {
        dispatch(
          artifactsAction.fetchDataSetSuccess({
            [dataSet]: generateArtifacts(
              filterArtifacts(response.data.artifacts)
            )
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
  fetchDataSets: (project, filters) => dispatch => {
    dispatch(artifactsAction.fetchDataSetsBegin())

    return artifactsApi
      .getDataSets(project, filters)
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
  fetchFeatureSets: (project, filters, config) => dispatch => {
    dispatch(artifactsAction.fetchFeatureSetsBegin())

    return artifactsApi
      .getFeatureSets(project, filters, config)
      .then(response => {
        dispatch(
          artifactsAction.fetchFeatureSetsSuccess(response.data?.feature_sets)
        )

        return response.data?.feature_sets
      })
      .catch(err => {
        dispatch(artifactsAction.fetchFeatureSetsFailure(err))
      })
  },
  fetchFeatureSetsBegin: () => ({
    type: FETCH_FEATURE_SETS_BEGIN
  }),
  fetchFeatureSetsFailure: error => ({
    type: FETCH_FEATURE_SETS_FAILURE,
    payload: error
  }),
  fetchFeatureSetsSuccess: featureSets => ({
    type: FETCH_FEATURE_SETS_SUCCESS,
    payload: featureSets
  }),
  fetchFeatureVector: (project, featureVector) => dispatch => {
    return artifactsApi
      .getFeatureVector(project, featureVector)
      .then(response => {
        let featureVectors = parseFeatureVectors(response.data?.feature_vectors)

        dispatch(
          artifactsAction.fetchFeatureVectorSuccess({
            [featureVector]: featureVectors
          })
        )

        return response.data?.feature_vectors
      })
      .catch(error => {
        throw error
      })
  },
  fetchFeatureVectorSuccess: featureSets => ({
    type: FETCH_FEATURE_VECTOR_SUCCESS,
    payload: featureSets
  }),
  fetchFeatureVectors: (project, filters, config) => dispatch => {
    dispatch(artifactsAction.fetchFeatureVectorsBegin())

    return artifactsApi
      .getFeatureVectors(project, filters, config)
      .then(response => {
        let featureVectors = parseFeatureVectors(response.data.feature_vectors)

        dispatch(artifactsAction.fetchFeatureVectorsSuccess(featureVectors))

        return response.data.feature_vectors
      })
      .catch(err => {
        dispatch(artifactsAction.fetchFeatureVectorsFailure(err))
      })
  },
  fetchFeatureVectorsBegin: () => ({
    type: FETCH_FEATURE_VECTORS_BEGIN
  }),
  fetchFeatureVectorsFailure: error => ({
    type: FETCH_FEATURE_VECTORS_FAILURE,
    payload: error
  }),
  fetchFeatureVectorsSuccess: featureSets => ({
    type: FETCH_FEATURE_VECTORS_SUCCESS,
    payload: featureSets
  }),
  fetchFeature: (project, featureName, featureMetadataName) => dispatch => {
    return artifactsApi
      .getFeature(project, featureName)
      .then(response => {
        const filteredFeatures = response.data.features.filter(
          responseItem =>
            responseItem.feature_set_digest.metadata.name ===
            featureMetadataName
        )
        let features = parseFeatures(filteredFeatures)

        dispatch(artifactsAction.fetchFeatureSuccess(features))

        return filteredFeatures
      })
      .catch(error => {
        throw error
      })
  },
  fetchFeatureSuccess: features => ({
    type: FETCH_FEATURE_SUCCESS,
    payload: features
  }),
  fetchFeatures: (project, filters) => dispatch => {
    dispatch(artifactsAction.fetchFeaturesBegin())

    return artifactsApi
      .getFeatures(project, filters)
      .then(response => {
        dispatch(artifactsAction.fetchFeaturesSuccess(response.data.features))

        return response.data.features
      })
      .catch(err => {
        dispatch(artifactsAction.fetchFeaturesFailure(err))
      })
  },
  fetchFeaturesBegin: () => ({
    type: FETCH_FEATURES_BEGIN
  }),
  fetchFeaturesFailure: error => ({
    type: FETCH_FEATURES_FAILURE,
    payload: error
  }),
  fetchFeaturesSuccess: features => ({
    type: FETCH_FEATURES_SUCCESS,
    payload: features
  }),
  fetchFile: (project, file) => dispatch => {
    return artifactsApi
      .getFile(project, file)
      .then(response => {
        dispatch(
          artifactsAction.fetchFileSuccess({
            [file]: generateArtifacts(filterArtifacts(response.data.artifacts))
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
  fetchModelEndpoints: (project, filters) => dispatch => {
    dispatch(artifactsAction.fetchModelEndpointsBegin())

    return artifactsApi
      .getModelEndpoints(project, filters)
      .then(({ data: { endpoints = [] } }) => {
        dispatch(artifactsAction.fetchModelEndpointsSuccess(endpoints))

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
  fetchModel: (project, model) => dispatch => {
    return artifactsApi
      .getModel(project, model)
      .then(response => {
        dispatch(
          artifactsAction.fetchModelSuccess({
            [model]: generateArtifacts(filterArtifacts(response.data.artifacts))
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
  removeFeatureSets: () => ({
    type: REMOVE_FEATURE_SETS
  }),
  removeFeatureVector: featureVectors => ({
    type: REMOVE_FEATURE_VECTOR,
    payload: featureVectors
  }),
  removeFeatureVectors: () => ({
    type: REMOVE_FEATURE_VECTORS
  }),
  removeFeature: features => ({
    type: REMOVE_FEATURE,
    payload: features
  }),
  removeFeatures: () => ({
    type: REMOVE_FEATURES
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
  removeNewFeatureSet: () => ({
    type: REMOVE_NEW_FEATURE_SET
  }),
  setArtifactFilter: filter => ({
    type: SET_ARTIFACT_FILTER,
    payload: filter
  }),
  setNewFeatureSetDataSourceAttributes: attributes => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES,
    payload: attributes
  }),
  setNewFeatureSetDataSourceEntities: entities => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES,
    payload: entities
  }),
  setNewFeatureSetDataSourceKey: key => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_KEY,
    payload: key
  }),
  setNewFeatureSetDataSourceKind: kind => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_KIND,
    payload: kind
  }),
  setNewFeatureSetDataSourceTime: time => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_TIME,
    payload: time
  }),
  setNewFeatureSetDataSourceUrl: url => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_URL,
    payload: url
  }),
  setNewFeatureSetDescription: description => ({
    type: SET_NEW_FEATURE_SET_DESCRIPTION,
    payload: description
  }),
  setNewFeatureSetLabels: labels => ({
    type: SET_NEW_FEATURE_SET_LABELS,
    payload: labels
  }),
  setNewFeatureSetName: name => ({
    type: SET_NEW_FEATURE_SET_NAME,
    payload: name
  }),
  setNewFeatureSetSchedule: schedule => ({
    type: SET_NEW_FEATURE_SET_SCHEDULE,
    payload: schedule
  }),
  setNewFeatureSetSchemaTimestampKey: timestamp_key => ({
    type: SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY,
    payload: timestamp_key
  }),
  setNewFeatureSetTarget: target => ({
    type: SET_NEW_FEATURE_SET_TARGET,
    payload: target
  }),
  setNewFeatureSetVersion: version => ({
    type: SET_NEW_FEATURE_SET_VERSION,
    payload: version
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  }),
  startFeatureSetIngest: (
    project,
    featureSet,
    reference,
    source,
    targets
  ) => dispatch => {
    dispatch(artifactsAction.startFeatureSetIngestBegin())

    return artifactsApi
      .startIngest(project, featureSet, reference, source, targets)
      .then(result => {
        dispatch(artifactsAction.startFeatureSetIngestSuccess())

        return result
      })
      .catch(error => {
        dispatch(artifactsAction.createNewFeatureSetFailure(error.message))

        throw error
      })
  },
  startFeatureSetIngestBegin: () => ({
    type: START_FEATURE_SET_INGEST_BEGIN
  }),
  startFeatureSetIngestSuccess: () => ({
    type: START_FEATURE_SET_INGEST_SUCCESS
  }),
  updateFeatureStoreData: (
    projectName,
    featureData,
    tag,
    data,
    pageTab
  ) => () => {
    return artifactsApi.updateFeatureStoreData(
      projectName,
      featureData,
      tag,
      data,
      pageTab
    )
  },
  updateFeatureVectorData: data => () => {
    return artifactsApi.updateFeatureVectorData(data)
  }
}

export default artifactsAction

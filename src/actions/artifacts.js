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
  SET_ARTIFACT_FILTER,
  REMOVE_FILES,
  REMOVE_MODELS,
  FETCH_FEATURE_SETS_BEGIN,
  FETCH_FEATURE_SETS_FAILURE,
  FETCH_FEATURE_SETS_SUCCESS,
  FETCH_FEATURES_BEGIN,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_SUCCESS,
  REMOVE_FEATURE_SETS,
  REMOVE_FEATURES,
  FETCH_FEATURE_VECTORS_BEGIN,
  FETCH_FEATURE_VECTORS_FAILURE,
  FETCH_FEATURE_VECTORS_SUCCESS,
  REMOVE_FEATURE_VECTORS,
  FETCH_FEATURE_VECTOR_SUCCESS,
  REMOVE_FEATURE_VECTOR,
  FETCH_FEATURE_SUCCESS,
  REMOVE_FEATURE
} from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'
import { parseFeatureVectors } from '../utils/parseFeatureVectors'
import { parseFeatures } from '../utils/parseFeatures'

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
  fetchFeatureSets: (project, config) => dispatch => {
    dispatch(artifactsAction.fetchFeatureSetsBegin())

    return artifactsApi
      .getFeatureSets(project, config)
      .then(response => {
        dispatch(
          artifactsAction.fetchFeatureSetsSuccess(response.data.feature_sets)
        )

        return response.data.feature_sets
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
  fetchFeatureVector: (featureVector, project) => dispatch => {
    return artifactsApi
      .getFeatureVector(featureVector, project)
      .then(response => {
        let featureVectors = parseFeatureVectors(response.data.feature_vectors)

        dispatch(
          artifactsAction.fetchFeatureVectorSuccess({
            [featureVector]: featureVectors
          })
        )

        return response.data.feature_vectors
      })
      .catch(error => {
        throw error
      })
  },
  fetchFeatureVectorSuccess: featureSets => ({
    type: FETCH_FEATURE_VECTOR_SUCCESS,
    payload: featureSets
  }),
  fetchFeatureVectors: (project, config) => dispatch => {
    dispatch(artifactsAction.fetchFeatureVectorsBegin())

    return artifactsApi
      .getFeatureVectors(project, config)
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
  fetchFeature: (project, feature) => dispatch => {
    return artifactsApi
      .getFeature(project, feature.name)
      .then(response => {
        const filteredFeatures = response.data.features.filter(
          responseItem =>
            responseItem.feature_set_digest.metadata.name ===
            feature.metadata.name
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
  fetchFeatures: item => dispatch => {
    dispatch(artifactsAction.fetchFeaturesBegin())

    return artifactsApi
      .getFeatures(item)
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
  fetchFiles: project => dispatch => {
    dispatch(artifactsAction.fetchFilesBegin())

    return artifactsApi
      .getArtifactsFiles(project)
      .then(({ data }) => {
        let files = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchFilesSuccess(files))

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
  fetchModels: project => dispatch => {
    dispatch(artifactsAction.fetchModelsBegin())

    return artifactsApi
      .getArtifactsModels(project)
      .then(({ data }) => {
        let models = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchModelsSuccess(models))

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
  removeFiles: () => ({
    type: REMOVE_FILES
  }),
  removeModels: () => ({
    type: REMOVE_MODELS
  }),
  setArtifactFilter: filter => ({
    type: SET_ARTIFACT_FILTER,
    payload: filter
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  }),
  updateFeatureSetData: (projectName, featureSet, tag, data) => () => {
    return artifactsApi.updateFeatureSetData(projectName, featureSet, tag, data)
  }
}

export default artifactsAction

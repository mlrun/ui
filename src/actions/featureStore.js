import featureStoreApi from '../api/featureStore-api'
import {
  CREATE_NEW_FEATURE_SET_BEGIN,
  CREATE_NEW_FEATURE_SET_FAILURE,
  CREATE_NEW_FEATURE_SET_SUCCESS,
  FETCH_ENTITIES_BEGIN,
  FETCH_ENTITIES_FAILURE,
  FETCH_ENTITIES_SUCCESS,
  FETCH_ENTITY_SUCCESS,
  FETCH_FEATURES_BEGIN,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_SUCCESS,
  FETCH_FEATURE_SETS_BEGIN,
  FETCH_FEATURE_SETS_FAILURE,
  FETCH_FEATURE_SETS_SUCCESS,
  FETCH_FEATURE_SUCCESS,
  FETCH_FEATURE_VECTORS_BEGIN,
  FETCH_FEATURE_VECTORS_FAILURE,
  FETCH_FEATURE_VECTORS_SUCCESS,
  FETCH_FEATURE_VECTOR_SUCCESS,
  REMOVE_ENTITIES,
  REMOVE_ENTITY,
  REMOVE_FEATURE,
  REMOVE_FEATURES,
  REMOVE_FEATURES_ERROR,
  REMOVE_FEATURE_SETS,
  REMOVE_FEATURE_VECTOR,
  REMOVE_FEATURE_VECTORS,
  REMOVE_NEW_FEATURE_SET,
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
  START_FEATURE_SET_INGEST_BEGIN,
  START_FEATURE_SET_INGEST_SUCCESS,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN,
  SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME,
  FETCH_FEATURE_SET_SUCCESS,
  SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY
} from '../constants'
import { parseFeatureVectors } from '../utils/parseFeatureVectors'
import { parseFeatures } from '../utils/parseFeatures'
import {
  getFeatureIdentifier,
  getFeatureSetIdentifier,
  getFeatureVectorIdentifier
} from '../utils/getUniqueIdentifier'
import { parseFeatureSets } from '../utils/parseFeatureSets'

const featureStoreActions = {
  createNewFeatureSet: (project, data) => dispatch => {
    dispatch(featureStoreActions.createNewFeatureSetBegin())

    return featureStoreApi
      .createFeatureSet(project, data)
      .then(result => {
        dispatch(featureStoreActions.createNewFeatureSetSuccess())

        return result
      })
      .catch(error => {
        dispatch(featureStoreActions.createNewFeatureSetFailure(error.message))

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
  createNewFeatureVector: data => () =>
    featureStoreApi.createFeatureVector(data),
  fetchEntity: (project, entityName, entityMetadataName) => dispatch => {
    return featureStoreApi
      .getEntity(project, entityName)
      .then(response => {
        const filteredEntities = response.data.entities.filter(
          responseItem =>
            responseItem.feature_set_digest.metadata.name === entityMetadataName
        )
        const parsedEntities = parseFeatures(filteredEntities)

        dispatch(
          featureStoreActions.fetchEntitySuccess({
            [getFeatureIdentifier(parsedEntities[0])]: parsedEntities
          })
        )

        return filteredEntities
      })
      .catch(error => {
        throw error
      })
  },
  fetchEntitySuccess: entities => ({
    type: FETCH_ENTITY_SUCCESS,
    payload: entities
  }),
  fetchEntities: (project, filters) => dispatch => {
    dispatch(featureStoreActions.fetchEntitiesBegin())

    return featureStoreApi
      .getEntities(project, filters)
      .then(response => {
        dispatch(
          featureStoreActions.fetchEntitiesSuccess(response.data.entities)
        )

        return response.data.entities
      })
      .catch(err => {
        dispatch(featureStoreActions.fetchEntitiesFailure(err))
      })
  },
  fetchEntitiesBegin: () => ({
    type: FETCH_ENTITIES_BEGIN
  }),
  fetchEntitiesFailure: error => ({
    type: FETCH_ENTITIES_FAILURE,
    payload: error
  }),
  fetchEntitiesSuccess: entities => ({
    type: FETCH_ENTITIES_SUCCESS,
    payload: entities
  }),
  fetchFeatureSets: (project, filters, config) => dispatch => {
    dispatch(featureStoreActions.fetchFeatureSetsBegin())

    return featureStoreApi
      .getFeatureSets(project, filters, config)
      .then(response => {
        dispatch(
          featureStoreActions.fetchFeatureSetsSuccess(
            parseFeatureSets(response.data?.feature_sets)
          )
        )

        return response.data?.feature_sets
      })
      .catch(err => {
        dispatch(featureStoreActions.fetchFeatureSetsFailure(err))
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
  fetchFeatureSet: (project, featureSet) => dispatch => {
    return featureStoreApi
      .getFeatureSet(project, featureSet)
      .then(response => {
        const generatedFeatureSets = parseFeatureSets(
          response.data?.feature_sets
        )

        dispatch(
          featureStoreActions.fetchFeatureSetSuccess({
            [getFeatureSetIdentifier(
              generatedFeatureSets[0]
            )]: generatedFeatureSets
          })
        )

        return response.data?.feature_sets
      })
      .catch(error => {
        throw error
      })
  },
  fetchFeatureSetSuccess: featureSets => ({
    type: FETCH_FEATURE_SET_SUCCESS,
    payload: featureSets
  }),
  fetchFeatureVector: (project, featureVector) => dispatch => {
    return featureStoreApi
      .getFeatureVector(project, featureVector)
      .then(response => {
        dispatch(
          featureStoreActions.fetchFeatureVectorSuccess({
            [getFeatureVectorIdentifier(featureVector)]: parseFeatureVectors(
              response.data?.feature_vectors
            )
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
    dispatch(featureStoreActions.fetchFeatureVectorsBegin())

    return featureStoreApi
      .getFeatureVectors(project, filters, config)
      .then(response => {
        dispatch(
          featureStoreActions.fetchFeatureVectorsSuccess(
            parseFeatureVectors(response.data.feature_vectors)
          )
        )

        return response.data.feature_vectors
      })
      .catch(err => {
        dispatch(featureStoreActions.fetchFeatureVectorsFailure(err))
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
    return featureStoreApi
      .getFeature(project, featureName)
      .then(response => {
        const filteredFeatures = response.data.features.filter(
          responseItem =>
            responseItem.feature_set_digest.metadata.name ===
            featureMetadataName
        )
        const parsedFeatures = parseFeatures(filteredFeatures)

        dispatch(
          featureStoreActions.fetchFeatureSuccess({
            [getFeatureIdentifier(parsedFeatures[0])]: parsedFeatures
          })
        )

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
    dispatch(featureStoreActions.fetchFeaturesBegin())

    return featureStoreApi
      .getFeatures(project, filters)
      .then(response => {
        dispatch(
          featureStoreActions.fetchFeaturesSuccess(response.data.features)
        )

        return response.data.features
      })
      .catch(err => {
        dispatch(featureStoreActions.fetchFeaturesFailure(err))
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
  fetchFeatureSetsTags: project => () =>
    featureStoreApi.fetchFeatureSetsTags(project),
  fetchFeatureVectorsTags: project => () =>
    featureStoreApi.fetchFeatureVectorsTags(project),
  removeEntity: entities => ({
    type: REMOVE_ENTITY,
    payload: entities
  }),
  removeEntities: () => ({
    type: REMOVE_ENTITIES
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
  removeFeatureStoreError: () => ({
    type: REMOVE_FEATURES_ERROR
  }),
  removeNewFeatureSet: () => ({
    type: REMOVE_NEW_FEATURE_SET
  }),
  setNewFeatureSetCredentialsAccessKey: access_key => ({
    type: SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY,
    payload: access_key
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
  setNewFeatureSetDataSourceEndTime: endTIme => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME,
    payload: endTIme
  }),
  setNewFeatureSetDataSourceParseDates: parseDates => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES,
    payload: parseDates
  }),
  setNewFeatureSetDataSourceStartTime: startTime => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME,
    payload: startTime
  }),
  setNewFeatureSetDataSourceTimestampColumn: timestampKEy => ({
    type: SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN,
    payload: timestampKEy
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
  startFeatureSetIngest: (project, featureSet, reference, data) => dispatch => {
    dispatch(featureStoreActions.startFeatureSetIngestBegin())

    return featureStoreApi
      .startIngest(project, featureSet, reference, data)
      .then(result => {
        dispatch(featureStoreActions.startFeatureSetIngestSuccess())

        return result
      })
      .catch(error => {
        dispatch(featureStoreActions.createNewFeatureSetFailure(error.message))

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
    return featureStoreApi.updateFeatureStoreData(
      projectName,
      featureData,
      tag,
      data,
      pageTab
    )
  },
  updateFeatureVectorData: data => () => {
    return featureStoreApi.updateFeatureVectorData(data)
  }
}

export default featureStoreActions

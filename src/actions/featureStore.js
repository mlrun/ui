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
  FETCH_FEATURE_SET_SUCCESS,
  FETCH_FEATURE_SUCCESS,
  FETCH_FEATURE_VECTORS_BEGIN,
  FETCH_FEATURE_VECTORS_FAILURE,
  FETCH_FEATURE_VECTORS_SUCCESS,
  FETCH_FEATURE_VECTOR_SUCCESS,
  REMOVE_ENTITIES,
  REMOVE_ENTITY,
  REMOVE_FEATURE,
  REMOVE_FEATURES,
  REMOVE_FEATURE_SET,
  REMOVE_FEATURE_SETS,
  REMOVE_FEATURE_VECTOR,
  REMOVE_FEATURE_VECTORS,
  REMOVE_NEW_FEATURE_SET,
  SET_NEW_FEATURE_SET_CREDENTIALS_ACCESS_KEY,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ATTRIBUTES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_END_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_ENTITIES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KEY,
  SET_NEW_FEATURE_SET_DATA_SOURCE_KIND,
  SET_NEW_FEATURE_SET_DATA_SOURCE_PARSE_DATES,
  SET_NEW_FEATURE_SET_DATA_SOURCE_START_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIME,
  SET_NEW_FEATURE_SET_DATA_SOURCE_TIMESTAMP_COLUMN,
  SET_NEW_FEATURE_SET_DATA_SOURCE_URL,
  SET_NEW_FEATURE_SET_DESCRIPTION,
  SET_NEW_FEATURE_SET_NAME,
  SET_NEW_FEATURE_SET_PASSTHROUGH,
  SET_NEW_FEATURE_SET_SCHEDULE,
  SET_NEW_FEATURE_SET_SCHEMA_TIMESTAMP_KEY,
  SET_NEW_FEATURE_SET_TARGET,
  SET_NEW_FEATURE_SET_VERSION,
  START_FEATURE_SET_INGEST_BEGIN,
  START_FEATURE_SET_INGEST_SUCCESS
} from '../constants'
import { CONFLICT_ERROR_STATUS_CODE, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { parseFeatureVectors } from '../utils/parseFeatureVectors'
import { parseFeatures } from '../utils/parseFeatures'
import {
  getFeatureIdentifier,
  getFeatureSetIdentifier,
  getFeatureVectorIdentifier
} from '../utils/getUniqueIdentifier'
import { parseFeatureSets } from '../utils/parseFeatureSets'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import { showErrorNotification } from '../utils/notifications.util'

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
        const message =
          error.response.status === CONFLICT_ERROR_STATUS_CODE
            ? 'Cannot create the feature set: the name is already in use.'
            : error.response.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'You are not permitted to create a feature set.'
              : error.message

        showErrorNotification(dispatch, error, '', message)
        dispatch(featureStoreActions.createNewFeatureSetFailure())

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
  createNewFeatureVector: data => () => featureStoreApi.createFeatureVector(data),
  deleteFeatureVector: (project, featureVector) => () => {
    return featureStoreApi.deleteFeatureVector(project, featureVector)
  },
  fetchEntity: (project, entityName, entityMetadataName) => dispatch => {
    return featureStoreApi
      .getEntity(project, entityName)
      .then(response => {
        const parsedEntities = parseFeatures(response.data, entityMetadataName)

        dispatch(
          featureStoreActions.fetchEntitySuccess({
            [getFeatureIdentifier(parsedEntities[0])]: parsedEntities
          })
        )

        return parsedEntities
      })
      .catch(error => {
        throw error
      })
  },
  fetchEntitySuccess: entities => ({
    type: FETCH_ENTITY_SUCCESS,
    payload: entities
  }),
  fetchEntities: (project, filters, config) => dispatch => {
    dispatch(featureStoreActions.fetchEntitiesBegin())

    return featureStoreApi
      .getEntities(project, filters, config)
      .then(response => {
        const entities = parseFeatures(response.data)

        dispatch(featureStoreActions.fetchEntitiesSuccess(entities))

        return entities
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
          featureStoreActions.fetchFeatureSetsSuccess(parseFeatureSets(response.data?.feature_sets))
        )

        return response.data?.feature_sets
      })
      .catch(error => {
        dispatch(featureStoreActions.fetchFeatureSetsFailure(error.message))
        largeResponseCatchHandler(error, 'Failed to fetch feature sets', dispatch)
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
  fetchFeatureSet: (project, featureSet, tag) => dispatch => {
    return featureStoreApi
      .getFeatureSet(project, featureSet, tag)
      .then(response => {
        const generatedFeatureSets = parseFeatureSets(response.data?.feature_sets)

        dispatch(
          featureStoreActions.fetchFeatureSetSuccess({
            [getFeatureSetIdentifier(generatedFeatureSets[0])]: generatedFeatureSets
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
  fetchFeatureVector: (project, featureVector, tag) => dispatch => {
    return featureStoreApi
      .getFeatureVector(project, featureVector, tag)
      .then(response => {
        const generatedFeatureVectors = parseFeatureVectors(response.data?.feature_vectors)

        dispatch(
          featureStoreActions.fetchFeatureVectorSuccess({
            [getFeatureVectorIdentifier(generatedFeatureVectors[0])]: generatedFeatureVectors
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
  fetchFeatureVectors:
    (project, filters, config = {}, skipErrorNotification) =>
    dispatch => {
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
        .catch(error => {
          dispatch(featureStoreActions.fetchFeatureVectorsFailure(error))

          if (!skipErrorNotification) {
            largeResponseCatchHandler(error, 'Failed to fetch feature vectors', dispatch)
          }
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
        const parsedFeatures = parseFeatures(response.data, featureMetadataName)

        dispatch(
          featureStoreActions.fetchFeatureSuccess({
            [getFeatureIdentifier(parsedFeatures[0])]: parsedFeatures
          })
        )

        return parsedFeatures
      })
      .catch(error => {
        throw error
      })
  },
  fetchFeatureSuccess: features => ({
    type: FETCH_FEATURE_SUCCESS,
    payload: features
  }),
  fetchFeatures: (project, filters, config) => dispatch => {
    dispatch(featureStoreActions.fetchFeaturesBegin())

    return featureStoreApi
      .getFeatures(project, filters, config)
      .then(response => {
        const features = parseFeatures(response.data)

        dispatch(featureStoreActions.fetchFeaturesSuccess(features))

        return features
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
  fetchFeatureSetsTags:
    ({ project }) =>
    () =>
      featureStoreApi.fetchFeatureSetsTags(project),
  fetchFeatureVectorsTags:
    ({ project }) =>
    () =>
      featureStoreApi.fetchFeatureVectorsTags(project),
  removeEntity: entities => ({
    type: REMOVE_ENTITY,
    payload: entities
  }),
  removeEntities: () => ({
    type: REMOVE_ENTITIES
  }),
  removeFeatureSet: featureSets => ({
    type: REMOVE_FEATURE_SET,
    payload: featureSets
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
  setNewFeatureSetName: name => ({
    type: SET_NEW_FEATURE_SET_NAME,
    payload: name
  }),
  setNewFeatureSetPassthrough: isChecked => ({
    type: SET_NEW_FEATURE_SET_PASSTHROUGH,
    payload: isChecked
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
        const message =
          error.response.status === CONFLICT_ERROR_STATUS_CODE
            ? 'Cannot create the feature set: the name is already in use.'
            : error.response.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'You do not have permission to create a new feature set.'
              : error.message

        showErrorNotification(dispatch, error, '', message)
        dispatch(featureStoreActions.createNewFeatureSetFailure(message))

        throw error
      })
  },
  startFeatureSetIngestBegin: () => ({
    type: START_FEATURE_SET_INGEST_BEGIN
  }),
  startFeatureSetIngestSuccess: () => ({
    type: START_FEATURE_SET_INGEST_SUCCESS
  }),
  updateFeatureStoreData: (projectName, featureData, tag, data, pageTab) => () => {
    return featureStoreApi.updateFeatureStoreData(projectName, featureData, tag, data, pageTab)
  },
  updateFeatureVectorData: data => () => {
    return featureStoreApi.updateFeatureVectorData(data)
  }
}

export default featureStoreActions

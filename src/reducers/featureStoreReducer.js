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
import {
  getFeatureIdentifier,
  getFeatureSetIdentifier,
  getFeatureVectorIdentifier
} from '../utils/getUniqueIdentifier'
import featureStoreApi from '../api/featureStore-api'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { PANEL_DEFAULT_ACCESS_KEY } from '../constants'
import { REDISNOSQL } from '../components/FeatureSetsPanel/FeatureSetsPanelTargetStore/featureSetsPanelTargetStore.util'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { hideLoading, showLoading } from './redux.util'
import { isCommunityEdition } from '../utils/helper'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import { parseFeatureSets } from '../utils/parseFeatureSets'
import { parseFeatureVectors } from '../utils/parseFeatureVectors'
import { parseFeatures } from '../utils/parseFeatures'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

const initialState = {
  error: null,
  featureSets: {
    allData: [],
    selectedRowData: {
      content: {}
    },
    featureSetLoading: false
  },
  featureVectors: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  features: {
    allData: [],
    selectedRowData: {
      content: {}
    },
    loading: false
  },
  entities: {
    allData: [],
    selectedRowData: {
      content: {}
    },
    loading: false
  },
  loading: false,
  newFeatureSet: {
    credentials: {
      access_key: PANEL_DEFAULT_ACCESS_KEY
    },
    metadata: {
      name: '',
      tag: ''
    },
    spec: {
      description: '',
      entities: [],
      passthrough: false,
      source: {
        attributes: {},
        end_time: '',
        key_field: '',
        kind: 'csv',
        parse_dates: '',
        path: '',
        schedule: '',
        start_time: '',
        time_field: ''
      },
      targets: [
        {
          kind: 'parquet',
          name: 'parquet',
          path: '',
          partitioned: ''
        },
        {
          name: 'nosql',
          kind: isCommunityEdition() ? REDISNOSQL : 'nosql',
          online: true,
          path: ''
        }
      ],
      timestamp_key: '',
      features: []
    },
    status: {}
  }
}

export const createNewFeatureSet = createAsyncThunk(
  'createNewFeatureSet',
  ({ project, data }, thunkAPI) => {
    return featureStoreApi
      .createFeatureSet(project, data)
      .then(result => {
        return result
      })
      .catch(error => {
        const message =
          error.response.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'You are not permitted to create a feature set.'
            : error.message

        showErrorNotification(thunkAPI.dispatch, error, '', message)
        thunkAPI.rejectWithValue(error)
      })
  }
)
export const createNewFeatureVector = createAsyncThunk(
  'createNewFeatureVector',
  ({ data }, thunkAPI) => {
    return featureStoreApi.createFeatureVector(data).catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const deleteFeatureVector = createAsyncThunk(
  'deleteFeatureVector',
  ({ project, featureVector }, thunkAPI) => {
    return featureStoreApi
      .deleteFeatureVector(project, featureVector)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchEntity = createAsyncThunk(
  'fetchEntity',
  ({ project, name, metadataName, labels }, thunkAPI) => {
    return featureStoreApi
      .getEntity(project, name, labels)
      .then(response => {
        return parseFeatures(response.data, metadataName)
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchEntities = createAsyncThunk(
  'fetchEntities',
  ({ project, filters, config }, thunkAPI) => {
    return featureStoreApi
      .getEntities(project, filters, config)
      .then(response => {
        return parseFeatures(response.data)
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFeatureSets = createAsyncThunk(
  'fetchFeatureSets',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return featureStoreApi
      .getFeatureSets(project, filters, config)
      .then(response => {
        return response.data?.feature_sets
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch feature sets',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
        thunkAPI.rejectWithValue(error.message)
      })
  }
)
export const fetchExpandedFeatureSet = createAsyncThunk(
  'fetchExpandedFeatureSet',
  ({ project, featureSet, tag, labels }, thunkAPI) => {
    return featureStoreApi
      .getExpandedFeatureSet(project, featureSet, tag, labels)
      .then(response => {
        return response.data?.feature_sets
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFeatureSet = createAsyncThunk(
  'fetchFeatureSet',
  ({ project, featureSet, tag }, thunkAPI) => {
    return featureStoreApi
      .getFeatureSet(project, featureSet, tag)
      .then(response => {
        return parseFeatureSets(response.data?.feature_sets)[0]
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFeatureVector = createAsyncThunk(
  'fetchFeatureVector',
  ({ project, featureVector, tag, labels }, thunkAPI) => {
    return featureStoreApi
      .getFeatureVector(project, featureVector, tag, labels)
      .then(response => {
        return response.data?.feature_vectors
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFeatureVectors = createAsyncThunk(
  'fetchFeatureVectors',
  ({ project, filters, config = {}, skipErrorNotification }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return featureStoreApi
      .getFeatureVectors(project, filters, config)
      .then(response => {
        return response.data.feature_vectors
      })
      .catch(error => {
        if (!skipErrorNotification) {
          largeResponseCatchHandler(
            error,
            'Failed to fetch feature vectors',
            thunkAPI.dispatch,
            config?.ui?.setRequestErrorMessage
          )
          thunkAPI.rejectWithValue(error)
        }
      })
  }
)
export const fetchFeature = createAsyncThunk(
  'fetchFeature',
  ({ project, name, metadataName, labels, entities }, thunkAPI) => {
    return featureStoreApi
      .getFeature(project, name, labels, entities)
      .then(response => {
        return parseFeatures(response.data, metadataName)
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFeatures = createAsyncThunk(
  'fetchFeatures',
  ({ project, filters, config }, thunkAPI) => {
    return featureStoreApi
      .getFeatures(project, filters, config)
      .then(response => {
        return parseFeatures(response.data)
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFeatureSetsTags = createAsyncThunk(
  'fetchFeatureSetsTags',
  ({ project, config }, thunkAPI) => {
    return featureStoreApi.fetchFeatureSetsTags(project, config).catch(error => {
      largeResponseCatchHandler(error, 'Failed to fetch tags', thunkAPI.dispatch)
      thunkAPI.rejectWithValue(error)
    })
  }
)
export const fetchFeatureVectorsTags = createAsyncThunk(
  'fetchFeatureVectorsTags',
  ({ project, config }, thunkAPI) => {
    return featureStoreApi.fetchFeatureVectorsTags(project, config).catch(error => {
      largeResponseCatchHandler(error, 'Failed to fetch tags', thunkAPI.dispatch)
      thunkAPI.rejectWithValue(error)
    })
  }
)
export const startFeatureSetIngest = createAsyncThunk(
  'startFeatureSetIngest',
  ({ project, featureSet, reference, data }, thunkAPI) => {
    return featureStoreApi
      .startIngest(project, featureSet, reference, data)
      .then(result => {
        return result
      })
      .catch(error => {
        const message =
          error.response.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'You are not permitted to create a feature set.'
            : error.message

        showErrorNotification(thunkAPI.dispatch, error, '', message)
        thunkAPI.rejectWithValue(message)
      })
  }
)
export const updateFeatureStoreData = createAsyncThunk(
  'updateFeatureStoreData',
  ({ projectName, featureData, tag, data, pageTab }, thunkAPI) => {
    return featureStoreApi
      .updateFeatureStoreData(projectName, featureData, tag, data, pageTab)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const updateFeatureVectorData = createAsyncThunk(
  'updateFeatureVectorData',
  ({ data }, thunkAPI) => {
    return featureStoreApi
      .updateFeatureVectorData(data)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)

const featureStoreSlice = createSlice({
  name: 'featureStore',
  initialState,
  reducers: {
    removeEntity(state, action) {
      state.entities.selectedRowData = {
        content: action.payload ?? {},
        loading: false,
        error: null
      }
    },
    removeEntities(state) {
      state.entities = {
        allData: [],
        selectedRowData: { content: {} }
      }
    },
    removeFeatureSet(state, action) {
      state.featureSets.selectedRowData = {
        content: action.payload ?? {},
        loading: false,
        error: null
      }
    },
    removeFeatureSets(state) {
      state.featureSets = {
        allData: [],
        selectedRowData: { content: {} }
      }
    },
    removeFeatureVector(state, action) {
      state.featureVectors.selectedRowData = {
        content: action.payload ?? {},
        loading: false,
        error: null
      }
    },
    removeFeatureVectors(state) {
      state.featureVectors = {
        allData: [],
        selectedRowData: { content: {} }
      }
    },
    removeFeature(state, action) {
      state.features.selectedRowData = {
        content: action.payload ?? {},
        loading: false,
        error: null
      }
    },
    removeFeatures(state) {
      state.features = {
        allData: [],
        selectedRowData: { content: {} }
      }
    },
    removeNewFeatureSet(state) {
      state.newFeatureSet = { ...initialState.newFeatureSet }
    },
    setNewFeatureSetCredentialsAccessKey(state, action) {
      state.newFeatureSet.credentials.access_key = action.payload
    },
    setNewFeatureSetDataSourceAttributes(state, action) {
      state.newFeatureSet.spec.source.attributes = action.payload
    },
    setNewFeatureSetDataSourceEntities(state, action) {
      state.newFeatureSet.spec.entities = action.payload
    },
    setNewFeatureSetDataSourceKey(state, action) {
      state.newFeatureSet.spec.source.key_field = action.payload
    },
    setNewFeatureSetDataSourceKind(state, action) {
      state.newFeatureSet.spec.source.kind = action.payload
    },
    setNewFeatureSetDataSourceEndTime(state, action) {
      state.newFeatureSet.spec.source.end_time = action.payload
    },
    setNewFeatureSetDataSourceParseDates(state, action) {
      state.newFeatureSet.spec.source.parse_dates = action.payload
    },
    setNewFeatureSetDataSourceStartTime(state, action) {
      state.newFeatureSet.spec.source.start_time = action.payload
    },
    setNewFeatureSetDataSourceTimestampColumn(state, action) {
      state.newFeatureSet.spec.source.time_field = action.payload
    },
    setNewFeatureSetDataSourceUrl(state, action) {
      state.newFeatureSet.spec.source.path = action.payload
    },
    setNewFeatureSetDescription(state, action) {
      state.newFeatureSet.spec.description = action.payload
    },
    setNewFeatureSetName(state, action) {
      state.newFeatureSet.metadata.name = action.payload
    },
    setNewFeatureSetPassthrough(state, action) {
      state.newFeatureSet.spec.passthrough = action.payload
    },
    setNewFeatureSetSchedule(state, action) {
      state.newFeatureSet.spec.source.schedule = action.payload
    },
    setNewFeatureSetSchemaTimestampKey(state, action) {
      state.newFeatureSet.spec.timestamp_key = action.payload
    },
    setNewFeatureSetTarget(state, action) {
      state.newFeatureSet.spec.targets = action.payload
    },
    setNewFeatureSetVersion(state, action) {
      state.newFeatureSet.metadata.tag = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(createNewFeatureSet.pending, showLoading)
    builder.addCase(createNewFeatureSet.fulfilled, hideLoading)
    builder.addCase(createNewFeatureSet.rejected, hideLoading)
    builder.addCase(fetchEntity.fulfilled, (state, action) => {
      state.entities.selectedRowData.content = action.payload
    })
    builder.addCase(fetchEntities.pending, state => {
      state.entities.loading = true
    })
    builder.addCase(fetchEntities.fulfilled, (state, action) => {
      state.entities.loading = false
      state.entities.allData = action.payload
      state.error = false
    })
    builder.addCase(fetchEntities.rejected, (state, action) => {
      state.entities.loading = false
      state.error = action.payload
    })
    builder.addCase(fetchFeatureSets.pending, showLoading)
    builder.addCase(fetchFeatureSets.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    builder.addCase(fetchFeatureSets.fulfilled, (state, action) => {
      state.loading = false
      state.featureSets.allData = parseFeatureSets(action.payload)
      state.error = false
    })
    builder.addCase(fetchExpandedFeatureSet.fulfilled, (state, action) => {
      const generatedFeatureSets = parseFeatureSets(action.payload)

      state.featureSets.selectedRowData.content = {
        [getFeatureSetIdentifier(generatedFeatureSets[0])]: generatedFeatureSets
      }
    })
    builder.addCase(fetchFeatureSet.pending, state => {
      state.featureSets.featureSetLoading = true
    })
    builder.addCase(fetchFeatureSet.rejected, state => {
      state.featureSets.featureSetLoading = false
    })
    builder.addCase(fetchFeatureSet.fulfilled, state => {
      state.featureSets.featureSetLoading = false
    })
    builder.addCase(fetchFeatureVector.fulfilled, (state, action) => {
      const generatedFeatureVectors = parseFeatureVectors(action.payload)

      state.featureVectors.selectedRowData.content = {
        [getFeatureVectorIdentifier(generatedFeatureVectors[0])]: generatedFeatureVectors
      }
    })
    builder.addCase(fetchFeatureVectors.pending, showLoading)
    builder.addCase(fetchFeatureVectors.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    builder.addCase(fetchFeatureVectors.fulfilled, (state, action) => {
      state.loading = false
      state.error = false
      state.featureVectors.allData = parseFeatureVectors(action.payload)
    })
    builder.addCase(fetchFeature.fulfilled, (state, action) => {
      state.features.selectedRowData.content = {
        [getFeatureIdentifier(action.payload[0])]: action.payload
      }
    })
    builder.addCase(fetchFeatures.pending, state => {
      state.features.loading = true
    })
    builder.addCase(fetchFeatures.rejected, (state, action) => {
      state.features.loading = true
      state.error = action.payload
    })
    builder.addCase(fetchFeatures.fulfilled, (state, action) => {
      state.features.loading = false
      state.error = false
      state.features.allData = action.payload
    })
    builder.addCase(startFeatureSetIngest.pending, showLoading)
    builder.addCase(startFeatureSetIngest.fulfilled, hideLoading)
  }
})

export const {
  removeEntity,
  removeEntities,
  removeFeatureSet,
  removeFeatureSets,
  removeFeatureVector,
  removeFeatureVectors,
  removeFeature,
  removeFeatures,
  removeNewFeatureSet,
  setNewFeatureSetCredentialsAccessKey,
  setNewFeatureSetDataSourceAttributes,
  setNewFeatureSetDataSourceEntities,
  setNewFeatureSetDataSourceKey,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceEndTime,
  setNewFeatureSetDataSourceParseDates,
  setNewFeatureSetDataSourceStartTime,
  setNewFeatureSetDataSourceTimestampColumn,
  setNewFeatureSetDataSourceUrl,
  setNewFeatureSetDescription,
  setNewFeatureSetName,
  setNewFeatureSetPassthrough,
  setNewFeatureSetSchedule,
  setNewFeatureSetSchemaTimestampKey,
  setNewFeatureSetTarget,
  setNewFeatureSetVersion
} = featureStoreSlice.actions

export default featureStoreSlice.reducer

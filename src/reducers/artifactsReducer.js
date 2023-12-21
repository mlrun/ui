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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  defaultFulfilledHandler,
  defaultPendingHandler,
  defaultRejectedHandler,
  hideLoading,
  showLoading
} from './redux.util'
import artifactsApi from '../api/artifacts-api'
import functionsApi from '../api/functions-api'
import { ARTIFACTS, DATASETS, FUNCTION_TYPE_SERVING, MODELS_TAB } from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'
import { generateArtifacts } from '../utils/generateArtifacts'
import { generateModelEndpoints } from '../utils/generateModelEndpoints'
import { getArtifactIdentifier } from '../utils/getUniqueIdentifier'
import { parseArtifacts } from '../utils/parseArtifacts'
import { parseFunctions } from '../utils/parseFunctions'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const initialState = {
  artifacts: [],
  dataSets: {
    allData: [],
    filteredData: [],
    selectedRowData: {
      content: {},
      error: null,
      loading: false
    }
  },
  error: null,
  files: {
    allData: [],
    filteredData: [],
    selectedRowData: {
      content: {},
      error: null,
      loading: false
    }
  },
  loading: false,
  modelEndpoints: [],
  models: {
    allData: [],
    filteredData: [],
    selectedRowData: {
      content: {},
      error: null,
      loading: false
    }
  },
  pipelines: [],
  preview: {}
}

export const addTag = createAsyncThunk('addTag', ({ project, tag, data }) => {
  return artifactsApi.addTag(project, tag, data)
})
export const buildFunction = createAsyncThunk('buildFunction', ({ funcData }) => {
  return artifactsApi.buildFunction(funcData)
})
export const deleteArtifact = createAsyncThunk('deleteArtifact', ({ project, key, tag, tree }) => {
  return artifactsApi.deleteArtifact(project, key, tag, tree)
})
export const deleteTag = createAsyncThunk('deleteTag', ({ project, tag, data }) => {
  return artifactsApi.deleteTag(project, tag, data)
})
export const editTag = createAsyncThunk('editTag', ({ project, oldTag, tag, data }) => {
  return artifactsApi.addTag(project, tag, data).then(() => {
    if (oldTag) {
      return artifactsApi.deleteTag(project, oldTag, data)
    }
  })
})
export const fetchArtifact = createAsyncThunk('fetchArtifact', ({ project, artifact }) => {
  return artifactsApi.getArtifact(project, artifact).then(({ data }) => {
    return filterArtifacts(data.artifacts)
  })
})
export const fetchArtifacts = createAsyncThunk('fetchArtifacts', ({ project, filters, config }) => {
  return artifactsApi.getArtifacts(project, filters, config).then(({ data }) => {
    const result = parseArtifacts(data.artifacts)

    return generateArtifacts(filterArtifacts(result))
  })
})
export const fetchArtifactTags = createAsyncThunk('fetchArtifactTags', ({ project, category }) => {
  return artifactsApi.getArtifactTags(project, category)
})
export const fetchDataSet = createAsyncThunk('fetchDataSet', ({ project, dataSet, iter, tag }) => {
  return artifactsApi.getDataSet(project, dataSet, iter, tag).then(response => {
    const result = parseArtifacts(response.data.artifacts)

    return generateArtifacts(filterArtifacts(result), DATASETS, response.data.artifacts)
  })
})
export const fetchDataSets = createAsyncThunk(
  'fetchDataSets',
  ({ project, filters, config }, thunkAPI) => {
    setTimeout(() => {
      thunkAPI.dispatch(fetchDataSets.pending())
    })

    return artifactsApi
      .getDataSets(project, filters, config)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)

        return generateArtifacts(filterArtifacts(result), DATASETS, data.artifacts)
      })
      .catch(error =>
        largeResponseCatchHandler(error, 'Failed to fetch datasets', thunkAPI.dispatch)
      )
  }
)
export const fetchFile = createAsyncThunk('fetchFile', ({ project, file, iter, tag }) => {
  return artifactsApi.getFile(project, file, iter, tag).then(response => {
    const result = parseArtifacts(response.data.artifacts)

    return generateArtifacts(filterArtifacts(result), ARTIFACTS, response.data.artifacts)
  })
})
export const fetchFiles = createAsyncThunk(
  'fetchFiles',
  ({ project, filters, config }, thunkAPI) => {
    setTimeout(() => {
      thunkAPI.dispatch(fetchFiles.pending())
    })

    return artifactsApi
      .getFiles(project, filters, config)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)

        return generateArtifacts(filterArtifacts(result), ARTIFACTS, data.artifacts)
      })
      .catch(error =>
        largeResponseCatchHandler(error, 'Failed to fetch artifacts', thunkAPI.dispatch)
      )
  }
)
export const fetchArtifactsFunctions = createAsyncThunk(
  'fetchArtifactsFunctions',
  ({ project, filters, config }) => {
    return functionsApi.getFunctions(project, filters, config, null).then(({ data }) => {
      return parseFunctions(
        data.funcs.filter(func => func.kind === FUNCTION_TYPE_SERVING && func.metadata.tag?.length)
      )
    })
  }
)
export const fetchModelEndpoints = createAsyncThunk(
  'fetchModelEndpoints',
  ({ project, filters, config, params }, thunkAPI) => {
    return artifactsApi
      .getModelEndpoints(project, filters, config, params)
      .then(({ data: { endpoints = [] } }) => {
        return generateModelEndpoints(endpoints)
      })
      .catch(error =>
        largeResponseCatchHandler(error, 'Failed to fetch model endpoints', thunkAPI.dispatch)
      )
  }
)
export const fetchModel = createAsyncThunk('fetchModel', ({ project, model, iter, tag }) => {
  return artifactsApi.getModel(project, model, iter, tag).then(response => {
    const result = parseArtifacts(response.data.artifacts)

    return generateArtifacts(filterArtifacts(result), MODELS_TAB, response.data.artifacts)
  })
})
export const fetchModels = createAsyncThunk(
  'fetchModels',
  ({ project, filters, config }, thunkAPI) => {
    setTimeout(() => {
      thunkAPI.dispatch(fetchModels.pending())
    })

    return artifactsApi
      .getModels(project, filters, config)
      .then(({ data }) => {
        const result = filterArtifacts(parseArtifacts(data.artifacts))

        return generateArtifacts(result, MODELS_TAB, data.artifacts)
      })
      .catch(error => {
        largeResponseCatchHandler(error, 'Failed to fetch models', thunkAPI.dispatch)
      })
  }
)
export const replaceTag = createAsyncThunk('replaceTag', ({ project, tag, data }) => {
  return artifactsApi.replaceTag(project, tag, data)
})
export const updateArtifact = createAsyncThunk('updateArtifact', ({ project, data }) => {
  return artifactsApi.updateArtifact(project, data)
})

const artifactsSlice = createSlice({
  name: 'artifactsStore',
  initialState,
  reducers: {
    closeArtifactsPreview(state) {
      state.preview = {
        isPreview: false,
        selectedItem: {}
      }
    },
    removeDataSet(state, action) {
      state.dataSets.selectedRowData = {
        content: action.payload,
        error: null,
        loading: false
      }
    },
    removeDataSets(state) {
      state.dataSets = initialState.dataSets
    },
    removeFile(state, action) {
      state.files.selectedRowData = {
        content: action.payload,
        error: null,
        loading: false
      }
    },
    removeFiles(state) {
      state.files = initialState.files
    },
    removeModel(state, action) {
      state.models.selectedRowData = {
        content: initialState.models.selectedRowData.content,
        error: null,
        loading: false
      }
    },
    removeModels(state) {
      state.models = initialState.models
    },
    removeModelEndpoints(state) {
      state.modelEndpoints = initialState.modelEndpoints
    },
    removePipelines(state) {
      state.pipelines = initialState.pipelines
    },
    showArtifactsPreview(state, action) {
      state.preview = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(addTag.pending, showLoading)
    builder.addCase(addTag.fulfilled, hideLoading)
    builder.addCase(addTag.rejected, hideLoading)
    builder.addCase(buildFunction.pending, defaultPendingHandler)
    builder.addCase(buildFunction.fulfilled, defaultFulfilledHandler)
    builder.addCase(buildFunction.rejected, defaultRejectedHandler)
    builder.addCase(deleteArtifact.pending, showLoading)
    builder.addCase(deleteArtifact.fulfilled, hideLoading)
    builder.addCase(deleteArtifact.rejected, hideLoading)
    builder.addCase(deleteTag.pending, showLoading)
    builder.addCase(deleteTag.fulfilled, hideLoading)
    builder.addCase(deleteTag.rejected, hideLoading)
    builder.addCase(editTag.pending, showLoading)
    builder.addCase(editTag.fulfilled, hideLoading)
    builder.addCase(editTag.rejected, hideLoading)
    builder.addCase(fetchArtifacts.pending, defaultPendingHandler)
    builder.addCase(fetchArtifacts.fulfilled, (state, action) => {
      state.artifacts = action.payload
      state.loading = false
    })
    builder.addCase(fetchArtifacts.rejected, (state, action) => {
      state.artifacts = []
      state.error = action.payload
      state.loading = false
    })
    builder.addCase(fetchArtifactsFunctions.pending, defaultPendingHandler)
    builder.addCase(fetchArtifactsFunctions.fulfilled, (state, action) => {
      state.error = null
      state.pipelines = action.payload
      state.loading = false
    })
    builder.addCase(fetchArtifactsFunctions.rejected, defaultRejectedHandler)
    builder.addCase(fetchDataSet.fulfilled, (state, action) => {
      state.dataSets.selectedRowData.content[getArtifactIdentifier(action.payload[0])] =
        action.payload
    })
    builder.addCase(fetchDataSets.pending, defaultPendingHandler)
    builder.addCase(fetchDataSets.fulfilled, (state, action) => {
      state.error = null
      state.dataSets.allData = action.payload
      state.loading = false
    })
    builder.addCase(fetchDataSets.rejected, defaultRejectedHandler)
    builder.addCase(fetchFile.fulfilled, (state, action) => {
      state.files.selectedRowData.content[getArtifactIdentifier(action.payload[0])] = action.payload
    })
    builder.addCase(fetchFiles.pending, defaultPendingHandler)
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.error = null
      state.files.allData = action.payload
      state.loading = false
    })
    builder.addCase(fetchFiles.rejected, defaultRejectedHandler)
    builder.addCase(fetchModel.pending, (state, action) => {
      state.models.selectedRowData = {
        content: initialState.models.selectedRowData.content,
        error: null,
        loading: true
      }
    })
    builder.addCase(fetchModel.fulfilled, (state, action) => {
      state.models.selectedRowData.error = null
      state.models.selectedRowData.content[getArtifactIdentifier(action.payload[0])] =
        action.payload
      state.models.selectedRowData.loading = false
    })
    builder.addCase(fetchModel.rejected, (state, action) => {
      state.models.selectedRowData.error = {
        content: initialState.models.selectedRowData.content,
        error: action.payload,
        loading: true
      }
    })
    builder.addCase(fetchModelEndpoints.pending, defaultPendingHandler)
    builder.addCase(fetchModelEndpoints.fulfilled, (state, action) => {
      state.error = null
      state.modelEndpoints = action.payload
      state.loading = false
    })
    builder.addCase(fetchModelEndpoints.rejected, (state, action) => {
      state.error = action.payload
      state.modelEndpoints = []
      state.loading = false
    })
    builder.addCase(fetchModels.pending, defaultPendingHandler)
    builder.addCase(fetchModels.fulfilled, (state, action) => {
      state.error = null
      state.models.allData = action.payload
      state.loading = false
    })
    builder.addCase(fetchModels.rejected, defaultRejectedHandler)
  }
})

export const {
  showArtifactsPreview,
  closeArtifactsPreview,
  removeDataSet,
  removeDataSets,
  removeFile,
  removeFiles,
  removeModel,
  removeModels,
  removeModelEndpoints,
  removePipelines
} = artifactsSlice.actions

export default artifactsSlice.reducer

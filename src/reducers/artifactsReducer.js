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
import artifactsApi from '../api/artifacts-api'
import {
  defaultFulfilledHandler,
  defaultPendingHandler,
  defaultRejectedHandler,
  hideLoading,
  showLoading
} from './redux.util'
import { filterArtifacts } from '../utils/filterArtifacts'
import { parseArtifacts } from '../utils/parseArtifacts'
import { generateArtifacts } from '../utils/generateArtifacts'
import { ARTIFACTS, DATASETS, MODELS_TAB } from '../constants'
import { getArtifactIdentifier } from '../utils/getUniqueIdentifier'
import functionsApi from '../api/functions-api'
import { parseFunctions } from '../utils/parseFunctions'
import { generateModelEndpoints } from '../utils/generateModelEndpoints'

const initialState = {
  artifacts: [],
  dataSets: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  error: null,
  files: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  modelEndpoints: [],
  models: {
    allData: [],
    selectedRowData: {
      content: {}
    }
  },
  pipelines: [],
  preview: {},
  loading: false
}

export const addTag = createAsyncThunk('addTag', ({ project, tag, data }) => {
  return artifactsApi.addTag(project, tag, data)
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
export const replaceTag = createAsyncThunk('replaceTag', ({ project, tag, data }) => {
  return artifactsApi.replaceTag(project, tag, data)
})
export const buildFunction = createAsyncThunk('buildFunction', ({ funcData }) => {
  return artifactsApi.buildFunction(funcData)
})
export const fetchArtifact = createAsyncThunk('fetchArtifact', ({ project, artifact }) => {
  return artifactsApi.getArtifact(project, artifact).then(({ data }) => {
    return filterArtifacts(data.artifacts)
  })
})
export const fetchArtifacts = createAsyncThunk('fetchArtifacts', ({ project, filters }) => {
  return artifactsApi.getArtifacts(project, filters).then(({ data }) => {
    return filterArtifacts(data.artifacts)
  })
})
export const fetchArtifactTags = createAsyncThunk('fetchArtifactTags', ({ project, category }) => {
  return artifactsApi.getArtifactTags(project, category)
})
export const fetchDataSet = createAsyncThunk('fetchDataSet', ({ project, dataSet, iter, tag }) => {
  return artifactsApi.getDataSet(project, dataSet, tag, iter).then(response => {
    const result = parseArtifacts(response.data.artifacts)

    return generateArtifacts(filterArtifacts(result), DATASETS, response.data.artifacts)
  })
})
export const fetchDataSets = createAsyncThunk('fetchDataSets', ({ project, filters, config }) => {
  return artifactsApi.getDataSets(project, filters, config).then(({ data }) => {
    const result = parseArtifacts(data.artifacts)

    return generateArtifacts(filterArtifacts(result), DATASETS, data.artifacts)
  })
})
export const fetchFile = createAsyncThunk('fetchFile', ({ project, file, iter, tag }) => {
  return artifactsApi.getFile(project, file, tag).then(response => {
    const result = parseArtifacts(response.data.artifacts)

    return generateArtifacts(filterArtifacts(result), ARTIFACTS, response.data.artifacts)
  })
})
export const fetchFiles = createAsyncThunk('fetchFiles', ({ project, filters }) => {
  return artifactsApi.getFiles(project, filters).then(({ data }) => {
    const result = parseArtifacts(data.artifacts)

    return generateArtifacts(filterArtifacts(result), ARTIFACTS, data.artifacts)
  })
})
export const fetchArtifactsFunctions = createAsyncThunk(
  'fetchArtifactsFunctions',
  ({ project, filters }) => {
    return functionsApi.getFunctions(project, filters).then(({ data }) => {
      return parseFunctions(
        data.funcs.filter(func => func.kind === 'serving' && func.metadata.tag?.length)
      )
    })
  }
)
export const fetchModelEndpoints = createAsyncThunk(
  'fetchModelEndpoints',
  ({ project, filters, params }) => {
    return artifactsApi
      .getModelEndpoints(project, filters, params)
      .then(({ data: { endpoints = [] } }) => {
        return generateModelEndpoints(endpoints)
      })
  }
)
export const fetchModel = createAsyncThunk('fetchModel', ({ project, model, iter, tag }) => {
  return artifactsApi.getModel(project, model.db_key, tag, iter).then(response => {
    const result = parseArtifacts(response.data.artifacts)

    return generateArtifacts(filterArtifacts(result), MODELS_TAB, response.data.artifacts)
  })
})
export const fetchModels = createAsyncThunk('fetchModels', ({ project, filters }) => {
  return artifactsApi.getModels(project, filters).then(({ data }) => {
    const result = filterArtifacts(parseArtifacts(data.artifacts))
    return generateArtifacts(result, MODELS_TAB, data.artifacts)
  })
})
export const updateArtifact = createAsyncThunk('updateArtifact', ({ project, data }) => {
  return artifactsApi.updateArtifact(project, data)
})

const artifactsSlice = createSlice({
  name: 'artifactsStore',
  initialState,
  reducers: {
    showArtifactsPreview(state, action) {
      state.preview = action.payload
    },
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
      state.files = initialState.dataSets
    },
    removeModel(state, action) {
      state.models.selectedRowData = {
        content: action.payload,
        error: null,
        loading: false
      }
    },
    removeModels(state) {
      state.models = initialState.dataSets
    },
    removeModelEndpoints(state) {
      state.modelEndpoints = initialState.modelEndpoints
    },
    removePipelines(state) {
      state.pipelines = initialState.pipelines
    }
  },
  extraReducers: builder => {
    builder.addCase(addTag.pending, showLoading)
    builder.addCase(addTag.fulfilled, hideLoading)
    builder.addCase(addTag.rejected, hideLoading)
    builder.addCase(deleteTag.pending, showLoading)
    builder.addCase(deleteTag.fulfilled, hideLoading)
    builder.addCase(deleteTag.rejected, hideLoading)
    builder.addCase(editTag.pending, showLoading)
    builder.addCase(editTag.fulfilled, hideLoading)
    builder.addCase(editTag.rejected, hideLoading)
    builder.addCase(buildFunction.pending, defaultPendingHandler)
    builder.addCase(buildFunction.fulfilled, defaultFulfilledHandler)
    builder.addCase(buildFunction.rejected, defaultRejectedHandler)
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
    builder.addCase(fetchArtifactsFunctions.fulfilled, (state, action) => {
      state.error = null
      state.pipelines = action.payload
      state.loading = false
    })
    builder.addCase(fetchArtifactsFunctions.rejected, defaultRejectedHandler)
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
    builder.addCase(fetchModel.fulfilled, (state, action) => {
      state.models.selectedRowData.content[getArtifactIdentifier(action.payload[0])] =
        action.payload
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

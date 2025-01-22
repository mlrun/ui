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
import { defaultPendingHandler, hideLoading, showLoading } from './redux.util'
import artifactsApi from '../api/artifacts-api'
import functionsApi from '../api/functions-api'
import modelEndpointsApi from '../api/modelEndpoints-api'
import { ARTIFACTS_TAB, DATASETS_TAB, MODELS_TAB, DOCUMENTS_TAB } from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'
import { generateArtifacts } from '../utils/generateArtifacts'
import { parseModelEndpoints } from '../utils/parseModelEndpoints'
import { parseArtifacts } from '../utils/parseArtifacts'
import { parseFunctions } from '../utils/parseFunctions'
import { parseFunction } from '../utils/parseFunction'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const initialState = {
  artifacts: [],
  documents: {
    allData: [],
    filteredData: [],
    loading: false,
    documentLoading: false,
    selectedRowData: {
      content: {},
      error: null,
      loading: false
    }
  },
  dataSets: {
    allData: [],
    filteredData: [],
    loading: false,
    datasetLoading: false,
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
    loading: false,
    fileLoading: false,
    selectedRowData: {
      content: {},
      error: null,
      loading: false
    }
  },
  loading: false,
  modelEndpoints: {
    allData: [],
    loading: false,
    modelEndpointLoading: false
  },
  models: {
    allData: [],
    filteredData: [],
    loading: false,
    modelLoading: false,
    selectedRowData: {
      content: {},
      error: null,
      loading: false
    }
  },
  pipelines: {
    allData: [],
    loading: false
  },
  preview: {}
}

export const addTag = createAsyncThunk('addTag', ({ project, tag, data }) => {
  return artifactsApi.addTag(project, tag, data)
})
export const buildFunction = createAsyncThunk('buildFunction', ({ funcData }) => {
  return artifactsApi.buildFunction(funcData)
})
export const deleteArtifact = createAsyncThunk(
  'deleteArtifact',
  ({ project, key, uid, deletion_strategy, secrets }) => {
    return artifactsApi.deleteArtifact(project, key, uid, deletion_strategy, secrets)
  }
)
export const deleteArtifacts = createAsyncThunk(
  'deleteArtifacts',
  ({ project, name, category }) => {
    return artifactsApi.deleteArtifacts(project, name, category)
  }
)
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
  return artifactsApi.getExpandedArtifact(project, artifact).then(({ data }) => {
    const result = parseArtifacts(data.artifacts)

    return filterArtifacts(result)
  })
})
export const fetchArtifacts = createAsyncThunk(
  'fetchArtifacts',
  ({ project, filters, config, setRequestErrorMessage = () => {}, withExactName }, thunkAPI) => {
    setRequestErrorMessage('')

    return artifactsApi
      .getArtifacts(project, filters, config, withExactName)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)

        return generateArtifacts(filterArtifacts(result))
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch artifacts',
          thunkAPI.dispatch,
          setRequestErrorMessage
        )
      })
  }
)
export const fetchArtifactTags = createAsyncThunk(
  'fetchArtifactTags',
  ({ project, category, config }, thunkAPI) => {
    return artifactsApi
      .getArtifactTags(project, category, config)
      .catch(error => largeResponseCatchHandler(error, 'Failed to fetch tags', thunkAPI.dispatch))
  }
)
export const fetchDataSet = createAsyncThunk(
  'fetchDataSet',
  ({ projectName, artifactName, uid, tree, tag, iter }) => {
    return artifactsApi
      .getArtifact(projectName, artifactName, uid, tree, tag, iter)
      .then(response => {
        const result = parseArtifacts([response.data])

        return generateArtifacts(filterArtifacts(result), DATASETS_TAB, [response.data])?.[0]
      })
  }
)
export const fetchDataSets = createAsyncThunk(
  'fetchDataSets',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return artifactsApi
      .getDataSets(project, filters, config)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)

        return {
          ...data,
          artifacts: generateArtifacts(filterArtifacts(result), DATASETS_TAB, data.artifacts)
        }
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch datasets',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )

        throw error
      })
  }
)
export const fetchDocument = createAsyncThunk(
  'fetchDocument',
  ({ projectName, artifactName, uid, tree, tag, iter }) => {
    return artifactsApi
      .getArtifact(projectName, artifactName, uid, tree, tag, iter)
      .then(response => {
        const result = parseArtifacts([response.data])

        return generateArtifacts(filterArtifacts(result), DOCUMENTS_TAB, [response.data])?.[0]
      })
  }
)
export const fetchDocuments = createAsyncThunk(
  'fetchDocuments',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return artifactsApi
      .getDocuments(project, filters, config)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)

        return {
          ...data,
          artifacts: generateArtifacts(filterArtifacts(result), DOCUMENTS_TAB, data.artifacts)
        }
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch documents',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )

        throw error
      })
  }
)
export const fetchFile = createAsyncThunk(
  'fetchFile',
  ({ projectName, artifactName, uid, tree, tag, iter }) => {
    return artifactsApi
      .getArtifact(projectName, artifactName, uid, tree, tag, iter)
      .then(response => {
        const result = parseArtifacts([response.data])

        return generateArtifacts(filterArtifacts(result), ARTIFACTS_TAB, [response.data])?.[0]
      })
  }
)
export const fetchFiles = createAsyncThunk(
  'fetchFiles',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return artifactsApi
      .getFiles(project, filters, config)
      .then(({ data }) => {
        const result = parseArtifacts(data.artifacts)

        return {
          ...data,
          artifacts: generateArtifacts(filterArtifacts(result), ARTIFACTS_TAB, data.artifacts)
        }
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch artifacts',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )

        throw error
      })
  }
)
export const fetchArtifactsFunctions = createAsyncThunk(
  'fetchArtifactsFunctions',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return functionsApi
      .getFunctions(project, filters, config, null)
      .then(({ data }) => {
        return parseFunctions(data.funcs)
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch real-time pipelines',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  }
)
export const fetchArtifactsFunction = createAsyncThunk(
  'fetchArtifactsFunction',
  ({ project, name, hash, tag }) => {
    return functionsApi.getFunction(project, name, hash, tag).then(({ data }) => {
      return parseFunction(data.func, project)
    })
  }
)
export const fetchModelEndpoint = createAsyncThunk(
  'fetchModelEndpoint',
  ({ project, name, uid }) => {
    return modelEndpointsApi.getModelEndpoint(project, name, uid).then(({ data: endpoint }) => {
      return parseModelEndpoints([endpoint])?.[0]
    })
  }
)
export const fetchModelEndpoints = createAsyncThunk(
  'fetchModelEndpoints',
  ({ project, filters, config, params }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return modelEndpointsApi
      .getModelEndpoints(project, filters, config, params)
      .then(({ data: { endpoints = [] } }) => {
        return parseModelEndpoints(endpoints)
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch model endpoints',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  }
)
export const fetchModel = createAsyncThunk(
  'fetchModel',
  ({ projectName, artifactName, uid, tree, tag, iter }) => {
    return artifactsApi
      .getArtifact(projectName, artifactName, uid, tree, tag, iter)
      .then(response => {
        const result = parseArtifacts([response.data])

        return generateArtifacts(filterArtifacts(result), MODELS_TAB, [response.data])?.[0]
      })
  }
)
export const fetchModels = createAsyncThunk(
  'fetchModels',
  ({ project, filters, config }, thunkAPI) => {
    config?.ui?.setRequestErrorMessage?.('')

    return artifactsApi
      .getModels(project, filters, config)
      .then(({ data }) => {
        const result = filterArtifacts(parseArtifacts(data.artifacts))

        return { ...data, artifacts: generateArtifacts(result, MODELS_TAB, data.artifacts) }
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          'Failed to fetch models',
          thunkAPI.dispatch,
          config?.ui?.setRequestErrorMessage
        )

        throw error
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
    removeDocuments(state) {
      state.documents = initialState.documents
    },
    removeDocument(state, action) {
      state.documents.selectedRowData = {
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
    removeModel(state) {
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
      state.modelEndpoints.allData = initialState.modelEndpoints.allData
    },
    removePipelines(state) {
      state.pipelines.allData = initialState.pipelines.allData
    },
    showArtifactsPreview(state, action) {
      state.preview = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(addTag.pending, showLoading)
    builder.addCase(addTag.fulfilled, hideLoading)
    builder.addCase(addTag.rejected, hideLoading)
    builder.addCase(buildFunction.pending, state => {
      state.pipelines.loading = true
    })
    builder.addCase(buildFunction.fulfilled, state => {
      state.pipelines.loading = false
      state.error = null
    })
    builder.addCase(buildFunction.rejected, (state, action) => {
      state.error = action.error
      state.pipelines.loading = false
    })
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
    builder.addCase(fetchArtifactsFunctions.pending, state => {
      state.pipelines.loading = true
    })
    builder.addCase(fetchArtifactsFunctions.fulfilled, (state, action) => {
      state.error = null
      state.pipelines = { allData: action.payload, loading: false }
    })
    builder.addCase(fetchArtifactsFunctions.rejected, state => {
      state.pipelines.loading = false
    })
    builder.addCase(fetchArtifactsFunction.rejected, state => {
      state.pipelines.loading = false
    })
    builder.addCase(fetchArtifactsFunction.pending, state => {
      state.pipelines.loading = true
    })
    builder.addCase(fetchArtifactsFunction.fulfilled, (state, action) => {
      state.error = null
      state.pipelines.loading = false
    })
    builder.addCase(fetchDataSet.pending, state => {
      state.dataSets.datasetLoading = true
    })
    builder.addCase(fetchDataSet.fulfilled, state => {
      state.dataSets.datasetLoading = false
    })
    builder.addCase(fetchDataSet.rejected, state => {
      state.dataSets.datasetLoading = false
    })
    builder.addCase(fetchDataSets.pending, state => {
      state.dataSets.loading = true
      state.loading = true
    })
    builder.addCase(fetchDocument.pending, state => {
      state.documents.documentLoading = true
    })
    builder.addCase(fetchDocument.fulfilled, state => {
      state.documents.documentLoading = false
    })
    builder.addCase(fetchDocument.rejected, state => {
      state.documents.documentLoading = false
    })
    builder.addCase(fetchDocuments.pending, state => {
      state.documents.loading = true
      state.loading = true
    })
    builder.addCase(fetchDocuments.fulfilled, (state, action) => {
      state.error = null
      state.documents.allData = action.payload?.artifacts ?? []
      state.documents.loading = false
      state.loading = false
    })
    builder.addCase(fetchDocuments.rejected, state => {
      state.documents.loading = false
      state.loading = false
    })
    builder.addCase(fetchDataSets.fulfilled, (state, action) => {
      state.error = null
      state.dataSets.allData = action.payload?.artifacts ?? []
      state.dataSets.loading = false
      state.loading = state.models.loading || state.files.loading
    })
    builder.addCase(fetchDataSets.rejected, state => {
      state.dataSets.loading = false
      state.loading = state.models.loading || state.files.loading
    })
    builder.addCase(fetchFile.pending, state => {
      state.files.fileLoading = true
    })
    builder.addCase(fetchFile.fulfilled, state => {
      state.files.fileLoading = false
    })
    builder.addCase(fetchFile.rejected, state => {
      state.files.fileLoading = false
    })
    builder.addCase(fetchFiles.pending, state => {
      state.files.loading = true
      state.loading = true
    })
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.error = null
      state.files.allData = action.payload?.artifacts ?? []
      state.files.loading = false
      state.loading = state.models.loading || state.dataSets.loading
    })
    builder.addCase(fetchFiles.rejected, state => {
      state.files.loading = false
      state.loading = state.models.loading || state.dataSets.loading
    })
    builder.addCase(fetchModel.pending, state => {
      state.models.modelLoading = true
    })
    builder.addCase(fetchModel.fulfilled, state => {
      state.models.modelLoading = false
    })
    builder.addCase(fetchModel.rejected, state => {
      state.models.modelLoading = false
    })
    builder.addCase(fetchModelEndpoint.pending, state => {
      state.modelEndpoints.modelEndpointLoading = true
    })
    builder.addCase(fetchModelEndpoint.fulfilled, state => {
      state.modelEndpoints.modelEndpointLoading = false
    })
    builder.addCase(fetchModelEndpoint.rejected, state => {
      state.modelEndpoints.modelEndpointLoading = false
    })
    builder.addCase(fetchModelEndpoints.pending, state => {
      state.modelEndpoints.loading = true
    })
    builder.addCase(fetchModelEndpoints.fulfilled, (state, action) => {
      state.error = null
      state.modelEndpoints = { allData: action.payload, loading: false }
    })
    builder.addCase(fetchModelEndpoints.rejected, (state, action) => {
      state.error = action.payload
      state.modelEndpoints = { allData: [], loading: false }
    })
    builder.addCase(fetchModels.pending, state => {
      state.models.loading = true
      state.loading = true
    })
    builder.addCase(fetchModels.fulfilled, (state, action) => {
      state.error = null
      state.models.allData = action.payload?.artifacts ?? []
      state.models.loading = false
      state.loading = state.files.loading || state.dataSets.loading
    })
    builder.addCase(fetchModels.rejected, state => {
      state.models.loading = false
      state.loading = state.files.loading || state.dataSets.loading
    })
  }
})

export const {
  showArtifactsPreview,
  closeArtifactsPreview,
  removeDataSet,
  removeDataSets,
  removeDocuments,
  removeFile,
  removeFiles,
  removeModel,
  removeModels,
  removeModelEndpoints,
  removePipelines
} = artifactsSlice.actions

export default artifactsSlice.reducer

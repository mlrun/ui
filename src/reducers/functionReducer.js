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
import { FUNCTION_TYPE_JOB, PANEL_DEFAULT_ACCESS_KEY } from '../constants'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import functionsApi from '../api/functions-api'
import { hideLoading, showLoading } from './redux.util'
import mlrunNuclioApi from '../api/mlrun-nuclio-api'
import yaml from 'js-yaml'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import { generateCategories, generateHubCategories } from '../utils/generateTemplatesCategories'

const initialState = {
  hubFunctions: [],
  hubFunctionsCatalog: [],
  functions: [],
  func: {},
  funcLoading: false,
  logs: {
    loading: false,
    error: null
  },
  nuclioLogs: {
    loading: false,
    error: null
  },
  loading: false,
  error: null,
  newFunction: {
    kind: FUNCTION_TYPE_JOB,
    metadata: {
      credentials: {
        access_key: PANEL_DEFAULT_ACCESS_KEY
      },
      name: '',
      tag: ''
    },
    spec: {
      args: [],
      build: {
        base_image: '',
        commands: [],
        functionSourceCode: '',
        image: '',
        requirements: []
      },
      default_class: '',
      default_handler: '',
      description: '',
      env: [],
      image: '',
      priority_class_name: '',
      secret_sources: [],
      preemption_mode: '',
      volume_mounts: [],
      volumes: [],
      resources: {
        limits: {},
        requests: {}
      }
    }
  },
  templatesCatalog: {},
  templates: [],
  template: {}
}

export const createNewFunction = createAsyncThunk(
  'createNewFunction',
  ({ project, data }, thunkAPI) => {
    return functionsApi.createNewFunction(project, data).catch(error => {
      return thunkAPI.rejectWithValue(error)
    })
  }
)
export const deleteFunction = createAsyncThunk(
  'deleteFunction',
  ({ funcName, project }, thunkAPI) => {
    return functionsApi
      .deleteSelectedFunction(funcName, project)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const deployFunction = createAsyncThunk('deployFunction', ({ data }, thunkAPI) => {
  return functionsApi.deployFunction(data).catch(error => thunkAPI.rejectWithValue(error))
})
export const fetchFunctionLogs = createAsyncThunk(
  'fetchFunctionLogs',
  ({ project, name, tag }, thunkAPI) => {
    return functionsApi
      .getFunctionLogs(project, name, tag)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFunctionNuclioLogs = createAsyncThunk(
  'fetchFunctionNuclioLogs',
  ({ project, name, tag }, thunkAPI) => {
    const config = {
      params: {}
    }

    if (tag) {
      config.params.tag = tag
    }

    return mlrunNuclioApi
      .getDeployLogs(project, name, config)
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchFunctionTemplate = createAsyncThunk(
  'fetchFunctionTemplate',
  ({ path }, thunkAPI) => {
    return functionsApi
      .getFunctionTemplate(path)
      .then(response => {
        let parsedData = yaml.load(response.data)

        return {
          name: parsedData.metadata.name,
          functions: parsedData.spec.entry_point ? [] : [parsedData]
        }
      })
      .catch(error => {
        showErrorNotification(thunkAPI.dispatch, error)

        return thunkAPI.rejectWithValue(error)
      })
  }
)
export const fetchFunctions = createAsyncThunk(
  'fetchFunctions',
  ({ project, filters, config, setRequestErrorMessage = () => {} }, thunkAPI) => {
    const setRequestErrorMessageLocal = config?.ui?.setRequestErrorMessage || setRequestErrorMessage

    setRequestErrorMessageLocal('')

    return functionsApi
      .getFunctions(project, filters, config)
      .then(({ data }) => {
        return data
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          null,
          thunkAPI.dispatch,
          setRequestErrorMessageLocal
        )

        return thunkAPI.rejectWithValue(error)
      })
  }
)
export const fetchFunctionsTemplates = createAsyncThunk(
  'fetchFunctionsTemplates',
  (_, thunkAPI) => {
    return functionsApi
      .getFunctionTemplatesCatalog()
      .then(({ data: functionTemplates }) => {
        return generateCategories(functionTemplates)
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)
export const fetchHubFunction = createAsyncThunk(
  'fetchHubFunction',
  ({ hubFunctionName }, thunkAPI) => {
    return functionsApi
      .getHubFunction(hubFunctionName)
      .then(response => {
        return response.data
      })
      .catch(error => {
        showErrorNotification(thunkAPI.dispatch, error)

        return thunkAPI.rejectWithValue(error)
      })
  }
)
export const fetchHubFunctions = createAsyncThunk(
  'fetchHubFunctions',
  ({ allowedHubFunctions, setRequestErrorMessage = () => {} }, thunkAPI) => {
    setRequestErrorMessage('')

    return functionsApi
      .getHubFunctions()
      .then(({ data: functionTemplates }) => {
        return generateHubCategories(functionTemplates.catalog, allowedHubFunctions)
      })
      .catch(error => {
        largeResponseCatchHandler(
          error,
          null,
          thunkAPI.dispatch,
          setRequestErrorMessage
        )

        return thunkAPI.rejectWithValue(error)
      })
  }
)
export const fetchFunction = createAsyncThunk(
  'fetchFunction',
  ({ project, name, hash, tag }, thunkAPI) => {
    return functionsApi
      .getFunction(project, name, hash, tag)
      .then(result => {
        return result.data.func
      })
      .catch(error => thunkAPI.rejectWithValue(error))
  }
)

const functionsSlice = createSlice({
  name: 'functionsStore',
  initialState,
  reducers: {
    removeHubFunctions(state) {
      state.hubFunctions = []
      state.hubFunctionsCatalog = []
    },
    removeFunctionsError(state) {
      state.error = null
    },
    removeNewFunction(state) {
      state.newFunction = initialState.newFunction
    },
    resetNewFunctionCodeCustomImage(state) {
      state.newFunction.spec.build = {
        ...state.newFunction.spec.build,
        base_image: '',
        commands: '',
        image: ''
      }
    },
    setNewFunction(state, action) {
      state.newFunction = action.payload
    },
    setNewFunctionBaseImage(state, action) {
      state.newFunction.spec.build.base_image = action.payload
    },
    setNewFunctionBuildImage(state, action) {
      state.newFunction.spec.build.image = action.payload
    },
    setNewFunctionCommands(state, action) {
      state.newFunction.spec.build.commands = action.payload
    },
    setNewFunctionRequirements(state, action) {
      state.newFunction.spec.build.requirements = action.payload
    },
    setNewFunctionDefaultClass(state, action) {
      state.newFunction.spec.default_class = action.payload
    },
    setNewFunctionDescription(state, action) {
      state.newFunction.spec.description = action.payload
    },
    setNewFunctionDisableAutoMount(state, action) {
      state.newFunction.spec.disable_auto_mount = action.payload
    },
    setNewFunctionEnv(state, action) {
      state.newFunction.spec.env = action.payload
    },
    setNewFunctionErrorStream(state, action) {
      state.newFunction.spec.error_stream = action.payload
    },
    setNewFunctionForceBuild(state, action) {
      state.newFunction.skip_deployed = action.payload
    },
    setNewFunctionGraph(state, action) {
      state.newFunction.spec.graph = action.payload
    },
    setNewFunctionHandler(state, action) {
      state.newFunction.spec.default_handler = action.payload
    },
    setNewFunctionImage(state, action) {
      state.newFunction.spec.image = action.payload
    },
    setNewFunctionKind(state, action) {
      state.newFunction.kind = action.payload
    },
    setNewFunctionCredentialsAccessKey(state, action) {
      state.newFunction.metadata.credentials.access_key = action.payload
    },
    setNewFunctionName(state, action) {
      state.newFunction.metadata.name = action.payload
    },
    setNewFunctionParameters(state, action) {
      state.newFunction.spec.parameters = action.payload
    },
    setNewFunctionPriorityClassName(state, action) {
      state.newFunction.spec.priority_class_name = action.payload
    },
    setNewFunctionPreemtionMode(state, action) {
      state.newFunction.spec.preemption_mode = action.payload
    },
    setNewFunctionProject(state, action) {
      state.newFunction.metadata.project = action.payload
    },
    setNewFunctionResources(state, action) {
      state.newFunction.spec.resources = action.payload
    },
    setNewFunctionSecretSources(state, action) {
      state.newFunction.spec.secret_sources = action.payload
    },
    setNewFunctionSourceCode(state, action) {
      state.newFunction.spec.build.functionSourceCode = action.payload
    },
    setNewFunctionTag(state, action) {
      state.newFunction.metadata.tag = action.payload
    },
    setNewFunctionTrackModels(state, action) {
      state.newFunction.spec.track_models = action.payload
    },
    setNewFunctionVolumeMounts(state, action) {
      state.newFunction.spec.volume_mounts = action.payload
    },
    setNewFunctionVolumes(state, action) {
      state.newFunction.spec.volumes = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(createNewFunction.pending, showLoading)
    builder.addCase(createNewFunction.fulfilled, state => {
      state.loading = false
      state.error = null
    })
    builder.addCase(createNewFunction.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    builder.addCase(deployFunction.pending, showLoading)
    builder.addCase(deployFunction.fulfilled, state => {
      state.loading = false
      state.error = null
    })
    builder.addCase(deployFunction.rejected, hideLoading)
    builder.addCase(fetchFunctionLogs.pending, state => {
      state.logs.loading = true
    })
    builder.addCase(fetchFunctionLogs.fulfilled, state => {
      state.logs.loading = false
      state.logs.error = null
    })
    builder.addCase(fetchFunctionLogs.rejected, (state, action) => {
      state.logs.error = action.payload
      state.logs.loading = false
    })
    builder.addCase(fetchFunctionNuclioLogs.pending, state => {
      state.nuclioLogs.loading = true
    })
    builder.addCase(fetchFunctionNuclioLogs.fulfilled, state => {
      state.nuclioLogs.loading = false
      state.nuclioLogs.error = null
    })
    builder.addCase(fetchFunctionNuclioLogs.rejected, (state, action) => {
      state.nuclioLogs.error = action.payload
      state.nuclioLogs.loading = false
    })
    builder.addCase(fetchFunctionTemplate.pending, showLoading)
    builder.addCase(fetchFunctionTemplate.fulfilled, (state, action) => {
      state.loading = false
      state.template = action.payload
    })
    builder.addCase(fetchFunctionTemplate.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
      state.template = {}
    })
    builder.addCase(fetchFunctions.pending, showLoading)
    builder.addCase(fetchFunctions.fulfilled, (state, action) => {
      state.loading = false
      state.functions = action.payload.funcs
    })
    builder.addCase(fetchFunctions.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
      state.functions = []
    })
    builder.addCase(fetchFunctionsTemplates.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
      state.templates = []
      state.templatesCatalog = {}
    })
    builder.addCase(fetchHubFunction.pending, showLoading)
    builder.addCase(fetchHubFunction.fulfilled, hideLoading)
    builder.addCase(fetchHubFunction.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    builder.addCase(fetchHubFunctions.pending, showLoading)
    builder.addCase(fetchHubFunctions.fulfilled, (state, action) => {
      state.loading = false
      state.hubFunctions = action.payload.hubFunctions
      state.hubFunctionsCatalog = action.payload.hubFunctionsCategories
      state.error = null
    })
    builder.addCase(fetchHubFunctions.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
      state.hubFunctions = []
      state.hubFunctionsCatalog = []
    })
    builder.addCase(fetchFunction.pending, state => {
      state.funcLoading = true
    })
    builder.addCase(fetchFunction.fulfilled, (state, action) => {
      state.funcLoading = false
      state.func = action.payload.funcs
      state.error = null
    })
    builder.addCase(fetchFunction.rejected, (state, action) => {
      state.error = action.payload
      state.funcLoading = false
      state.func = {}
    })
  }
})

export const {
  removeHubFunctions,
  removeFunctionsError,
  removeNewFunction,
  resetNewFunctionCodeCustomImage,
  setNewFunction,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionCommands,
  setNewFunctionRequirements,
  setNewFunctionDefaultClass,
  setNewFunctionDescription,
  setNewFunctionDisableAutoMount,
  setNewFunctionEnv,
  setNewFunctionErrorStream,
  setNewFunctionForceBuild,
  setNewFunctionGraph,
  setNewFunctionHandler,
  setNewFunctionImage,
  setNewFunctionKind,
  setNewFunctionCredentialsAccessKey,
  setNewFunctionName,
  setNewFunctionParameters,
  setNewFunctionPriorityClassName,
  setNewFunctionPreemtionMode,
  setNewFunctionProject,
  setNewFunctionResources,
  setNewFunctionSecretSources,
  setNewFunctionSourceCode,
  setNewFunctionTag,
  setNewFunctionTrackModels,
  setNewFunctionVolumeMounts,
  setNewFunctionVolumes
} = functionsSlice.actions

export default functionsSlice.reducer

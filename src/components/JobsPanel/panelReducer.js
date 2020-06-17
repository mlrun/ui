export const initialState = {
  cpuUnit: '',
  currentFunctionInfo: {
    method: '',
    name: '',
    version: ''
  },
  editMode: false,
  inputPath: '',
  limits: {
    cpu: '',
    memory: '',
    nvidia_gpu: ''
  },
  memoryUnit: '',
  outputPath: '',
  previousPanelData: {
    tableData: {
      dataInputs: [],
      parameters: [],
      volumes: [],
      volumeMounts: [],
      environmentVariables: []
    },
    titleInfo: {
      method: '',
      version: ''
    }
  },
  requests: {
    cpu: '',
    memory: ''
  },
  tableData: {
    parameters: [],
    dataInputs: [],
    volumeMounts: [],
    volumes: [],
    environmentVariables: []
  }
}

export const panelActions = {
  REMOVE_PREVIOUS_PANEL_DATA: 'REMOVE_PREVIOUS_PANEL_DATA',
  SET_CPU_UNIT: 'SET_CPU_UNIT',
  SET_CURRENT_FUNCTION_INFO: 'SET_CURRENT_FUNCTION_INFO',
  SET_CURRENT_FUNCTION_INFO_METHOD: 'SET_CURRENT_FUNCTION_INFO_METHOD',
  SET_CURRENT_FUNCTION_INFO_NAME: 'SET_CURRENT_FUNCTION_INFO_NAME',
  SET_CURRENT_FUNCTION_INFO_VERSION: 'SET_CURRENT_FUNCTION_INFO_VERSION',
  SET_EDIT_MODE: 'SET_EDIT_MODE',
  SET_INPUT_PATH: 'SET_INPUT_PATH',
  SET_LIMITS: 'SET_LIMITS',
  SET_LIMITS_CPU: 'SET_LIMITS_CPU',
  SET_LIMITS_MEMORY: 'SET_LIMITS_MEMORY',
  SET_LIMITS_NVIDIA_GPU: 'SET_LIMITS_NVIDIA_GPU',
  SET_MEMORY_UNIT: 'SET_MEMORY_UNIT',
  SET_OUTPUT_PATH: 'SET_OUTPUT_PATH',
  SET_PREVIOUS_PANEL_DATA: 'SET_PREVIOUS_PANEL_DATA',
  SET_PREVIOUS_PANEL_DATA_INPUTS: 'SET_PREVIOUS_PANEL_DATA_INPUTS',
  SET_PREVIOUS_PANEL_DATA_METHOD: 'SET_PREVIOUS_PANEL_DATA_METHOD',
  SET_PREVIOUS_PANEL_DATA_PARAMETERS: 'SET_PREVIOUS_PANEL_DATA_PARAMETERS',
  SET_PREVIOUS_PANEL_DATA_TABLE_DATA: 'SET_PREVIOUS_PANEL_DATA_TABLE_DATA',
  SET_PREVIOUS_PANEL_DATA_TITLE_INFO: 'SET_PREVIOUS_PANEL_DATA_TITLE_INFO',
  SET_PREVIOUS_PANEL_DATA_VERSION: 'SET_PREVIOUS_PANEL_DATA_VERSION',
  SET_PREVIOUS_PANEL_DATA_VOLUMES: 'SET_PREVIOUS_PANEL_DATA_VOLUMES',
  SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS:
    'SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS',
  SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES:
    'SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES',
  SET_REQUESTS: 'SET_REQUESTS',
  SET_REQUESTS_CPU: 'SET_REQUESTS_CPU',
  SET_REQUESTS_MEMORY: 'SET_REQUESTS_MEMORY',
  SET_TABLE_DATA: 'SET_TABLE_DATA',
  SET_TABLE_DATA_INPUTS: 'SET_TABLE_DATA_INPUTS',
  SET_TABLE_DATA_PARAMETERS: 'SET_TABLE_DATA_PARAMETERS',
  SET_TABLE_DATA_VOLUMES: 'SET_TABLE_DATA_VOLUMES',
  SET_TABLE_DATA_VOLUME_MOUNTS: 'SET_TABLE_DATA_VOLUME_MOUNTS',
  SET_TABLE_DATA_ENVIRONMENT_VARIABLES: 'SET_TABLE_DATA_ENVIRONMENT_VARIABLES'
}

export const panelReducer = (state, { type, payload }) => {
  switch (type) {
    case panelActions.REMOVE_PREVIOUS_PANEL_DATA:
      return {
        ...state,
        previousPanelData: {
          tableData: {
            dataInputs: {},
            parameters: {},
            volumes: [],
            volumeMounts: []
          },
          titleInfo: {
            method: '',
            version: ''
          }
        }
      }
    case panelActions.SET_CPU_UNIT:
      return {
        ...state,
        cpuUnit: payload
      }
    case panelActions.SET_CURRENT_FUNCTION_INFO:
      return {
        ...state,
        currentFunctionInfo: payload
      }
    case panelActions.SET_CURRENT_FUNCTION_INFO_METHOD:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          method: payload
        }
      }
    case panelActions.SET_CURRENT_FUNCTION_INFO_NAME:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          name: payload
        }
      }
    case panelActions.SET_CURRENT_FUNCTION_INFO_VERSION:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          version: payload
        }
      }
    case panelActions.SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload
      }
    case panelActions.SET_INPUT_PATH:
      return {
        ...state,
        inputPath: payload
      }
    case panelActions.SET_LIMITS:
      return {
        ...state,
        limits: payload
      }
    case panelActions.SET_LIMITS_CPU:
      return {
        ...state,
        limits: {
          ...state.limits,
          cpu: payload
        }
      }
    case panelActions.SET_LIMITS_MEMORY:
      return {
        ...state,
        limits: {
          ...state.limits,
          memory: payload
        }
      }
    case panelActions.SET_LIMITS_NVIDIA_GPU:
      return {
        ...state,
        limits: {
          ...state.limits,
          nvidia_gpu: payload
        }
      }
    case panelActions.SET_MEMORY_UNIT:
      return {
        ...state,
        memoryUnit: payload
      }
    case panelActions.SET_OUTPUT_PATH:
      return {
        ...state,
        outputPath: payload
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA:
      return {
        ...state,
        previousPanelData: payload
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            environmentVariables: payload
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_INPUTS:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            dataInputs: payload
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_METHOD:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          titleInfo: {
            ...state.previousPanelData.titleInfo,
            method: payload
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            parameters: payload
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_TABLE_DATA:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: payload
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_TITLE_INFO:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          titleInfo: {
            method: payload.method,
            version: payload.version
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_VERSION:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          titleInfo: {
            ...state.previousPanelData.titleInfo,
            version: payload
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_VOLUMES:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            volumes: payload
          }
        }
      }
    case panelActions.SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            volumeMounts: payload
          }
        }
      }
    case panelActions.SET_REQUESTS:
      return {
        ...state,
        requests: payload
      }
    case panelActions.SET_REQUESTS_CPU:
      return {
        ...state,
        requests: {
          ...state.requests,
          cpu: payload
        }
      }
    case panelActions.SET_REQUESTS_MEMORY:
      return {
        ...state,
        requests: {
          ...state.requests,
          memory: payload
        }
      }
    case panelActions.SET_TABLE_DATA:
      return {
        ...state,
        tableData: payload
      }
    case panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          environmentVariables: payload
        }
      }
    case panelActions.SET_TABLE_DATA_INPUTS:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          dataInputs: payload
        }
      }
    case panelActions.SET_TABLE_DATA_PARAMETERS:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          parameters: payload
        }
      }
    case panelActions.SET_TABLE_DATA_VOLUMES:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          volumes: payload
        }
      }
    case panelActions.SET_TABLE_DATA_VOLUME_MOUNTS:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          volumeMounts: payload
        }
      }
    default:
      return state
  }
}

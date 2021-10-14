export const initialState = {
  access_key: '',
  cpuUnit: 'cpu',
  currentFunctionInfo: {
    labels: [],
    method: '',
    methodDescription: '',
    name: '',
    version: ''
  },
  editMode: false,
  inputPath: '',
  limits: {
    cpu: '',
    memory: '',
    'nvidia.com/gpu': ''
  },
  memoryUnit: 'Bytes',
  outputPath: 'v3io:///projects/{{run.project}}/artifacts/{{run.uid}}',
  previousPanelData: {
    access_key: '',
    tableData: {
      dataInputs: [],
      parameters: [],
      volumes: [],
      volume_mounts: [],
      environmentVariables: [],
      secretSources: [],
      node_selector: []
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
    volume_mounts: [],
    volumes: [],
    environmentVariables: [],
    secretSources: [],
    node_selector: []
  }
}

export const panelActions = {
  EDIT_JOB_LABEL: 'EDIT_JOB_LABEL',
  REMOVE_JOB_LABEL: 'REMOVE_JOB_LABEL',
  REMOVE_PREVIOUS_PANEL_DATA: 'REMOVE_PREVIOUS_PANEL_DATA',
  SET_ACCESS_KEY: 'SET_ACCESS_KEY',
  SET_CPU_UNIT: 'SET_CPU_UNIT',
  SET_CURRENT_FUNCTION_INFO: 'SET_CURRENT_FUNCTION_INFO',
  SET_CURRENT_FUNCTION_INFO_LABELS: 'SET_CURRENT_FUNCTION_INFO_LABELS',
  SET_CURRENT_FUNCTION_INFO_METHOD: 'SET_CURRENT_FUNCTION_INFO_METHOD',
  SET_CURRENT_FUNCTION_INFO_NAME: 'SET_CURRENT_FUNCTION_INFO_NAME',
  SET_CURRENT_FUNCTION_INFO_VERSION: 'SET_CURRENT_FUNCTION_INFO_VERSION',
  SET_EDIT_MODE: 'SET_EDIT_MODE',
  SET_INPUT_PATH: 'SET_INPUT_PATH',
  SET_JOB_LABELS: 'SET_JOB_LABELS',
  SET_LIMITS: 'SET_LIMITS',
  SET_LIMITS_CPU: 'SET_LIMITS_CPU',
  SET_LIMITS_MEMORY: 'SET_LIMITS_MEMORY',
  SET_LIMITS_NVIDIA_GPU: 'SET_LIMITS_NVIDIA_GPU',
  SET_MEMORY_UNIT: 'SET_MEMORY_UNIT',
  SET_OUTPUT_PATH: 'SET_OUTPUT_PATH',
  SET_PREVIOUS_PANEL_DATA: 'SET_PREVIOUS_PANEL_DATA',
  SET_PREVIOUS_PANEL_DATA_ACCESS_KEY: 'SET_PREVIOUS_PANEL_DATA_ACCESS_KEY',
  SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES:
    'SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES',
  SET_PREVIOUS_PANEL_DATA_INPUTS: 'SET_PREVIOUS_PANEL_DATA_INPUTS',
  SET_PREVIOUS_PANEL_DATA_METHOD: 'SET_PREVIOUS_PANEL_DATA_METHOD',
  SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR:
    'SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR',
  SET_PREVIOUS_PANEL_DATA_PARAMETERS: 'SET_PREVIOUS_PANEL_DATA_PARAMETERS',
  SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES:
    'SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES',
  SET_PREVIOUS_PANEL_DATA_TABLE_DATA: 'SET_PREVIOUS_PANEL_DATA_TABLE_DATA',
  SET_PREVIOUS_PANEL_DATA_TITLE_INFO: 'SET_PREVIOUS_PANEL_DATA_TITLE_INFO',
  SET_PREVIOUS_PANEL_DATA_VERSION: 'SET_PREVIOUS_PANEL_DATA_VERSION',
  SET_PREVIOUS_PANEL_DATA_VOLUMES: 'SET_PREVIOUS_PANEL_DATA_VOLUMES',
  SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS:
    'SET_PREVIOUS_PANEL_DATA_VOLUME_MOUNTS',
  SET_REQUESTS: 'SET_REQUESTS',
  SET_REQUESTS_CPU: 'SET_REQUESTS_CPU',
  SET_REQUESTS_MEMORY: 'SET_REQUESTS_MEMORY',
  SET_TABLE_DATA: 'SET_TABLE_DATA',
  SET_TABLE_DATA_ENVIRONMENT_VARIABLES: 'SET_TABLE_DATA_ENVIRONMENT_VARIABLES',
  SET_TABLE_DATA_INPUTS: 'SET_TABLE_DATA_INPUTS',
  SET_TABLE_DATA_NODE_SELECTOR: 'SET_TABLE_DATA_NODE_SELECTOR',
  SET_TABLE_DATA_PARAMETERS: 'SET_TABLE_DATA_PARAMETERS',
  SET_TABLE_DATA_SECRET_SOURCES: 'SET_TABLE_DATA_SECRET_SOURCES',
  SET_TABLE_DATA_VOLUMES: 'SET_TABLE_DATA_VOLUMES',
  SET_TABLE_DATA_VOLUME_MOUNTS: 'SET_TABLE_DATA_VOLUME_MOUNTS'
}

export const panelReducer = (state, { type, payload }) => {
  switch (type) {
    case panelActions.EDIT_JOB_LABEL:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          labels: payload
        }
      }
    case panelActions.REMOVE_PREVIOUS_PANEL_DATA:
      return {
        ...state,
        previousPanelData: initialState.previousPanelData
      }
    case panelActions.REMOVE_JOB_LABEL: {
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          labels: payload
        }
      }
    }
    case panelActions.SET_ACCESS_KEY:
      return {
        ...state,
        access_key: payload
      }
    case panelActions.SET_JOB_LABELS:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          labels: payload
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
    case panelActions.SET_CURRENT_FUNCTION_INFO_LABELS:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          labels: payload
        }
      }
    case panelActions.SET_CURRENT_FUNCTION_INFO_METHOD:
      return {
        ...state,
        currentFunctionInfo: {
          ...state.currentFunctionInfo,
          method: payload.method,
          methodDescription: payload.methodDescription
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
          'nvidia.com/gpu': payload
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
    case panelActions.SET_PREVIOUS_PANEL_DATA_ACCESS_KEY:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          access_key: payload
        }
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
    case panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            node_selector: payload
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
    case panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES:
      return {
        ...state,
        previousPanelData: {
          ...state.previousPanelData,
          tableData: {
            ...state.previousPanelData.tableData,
            secretSources: payload
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
            volume_mounts: payload
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
    case panelActions.SET_TABLE_DATA_NODE_SELECTOR:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          node_selector: payload
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
    case panelActions.SET_TABLE_DATA_SECRET_SOURCES:
      return {
        ...state,
        tableData: {
          ...state.tableData,
          secretSources: payload
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
          volume_mounts: payload
        }
      }
    default:
      return state
  }
}

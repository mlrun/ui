import panelData from '../JobsPanel/panelData.json'
import { panelActions } from '../JobsPanel/panelReducer'
import { parametersActions } from './jobsPanelParametersReducer'

export const convertParamValue = (value, type) =>
  ['int', 'float', 'number'].includes(type) && Number.isFinite(Number(value))
    ? Number(value)
    : type === 'bool' && value.toLowerCase() === 'true'
    ? true
    : type === 'bool' && value.toLowerCase() === 'false'
    ? false
    : String(value)

export const editHyperParams = (
  hyperParams,
  selectedParameter,
  newName,
  convertedValue
) => {
  const value =
    typeof convertedValue === 'string'
      ? convertedValue.split(',')
      : [convertedValue]

  if (newName) {
    if (hyperParams[selectedParameter.name]) {
      return {
        ...hyperParams,
        [newName]: value
      }
    } else {
      delete hyperParams[selectedParameter.name]
      hyperParams[newName] = value

      return { ...hyperParams }
    }
  } else if (hyperParams[selectedParameter.name]) {
    hyperParams[selectedParameter.name] = value

    return { ...hyperParams }
  } else {
    return {
      ...hyperParams,
      [selectedParameter.name]: value
    }
  }
}

export const generateTableData = parameters => {
  const content = {
    predefined: [],
    custom: []
  }

  parameters.forEach(parameter => {
    if (parameter.isDefault && !content.predefined.includes(parameter)) {
      content.predefined.push(parameter)
    } else if (!parameter.isDefault && !content.custom.includes(parameter)) {
      content.custom.push(parameter)
    }
  })

  return content
}

export const getParameterTypeOptions = paramFile => {
  return [
    { label: 'Simple', id: 'Simple' },
    { label: 'Hyper', id: 'Hyper', disabled: Boolean(paramFile) }
  ]
}

export const selectOptions = {
  parametersValueType: [
    {
      label: 'str',
      id: 'str'
    },
    {
      label: 'int',
      id: 'int'
    },
    {
      label: 'float',
      id: 'float'
    },
    {
      label: 'bool',
      id: 'bool'
    },
    {
      label: 'list',
      id: 'list'
    },
    {
      label: 'map',
      id: 'map'
    }
  ],
  hyperStrategyType: [
    {
      label: 'List',
      id: 'list'
    },
    {
      label: 'Grid',
      id: 'grid'
    },
    {
      label: 'Random',
      id: 'random'
    }
  ],
  selectorCriteria: [
    {
      label: 'Max',
      id: 'max'
    },
    {
      label: 'Min',
      id: 'min'
    }
  ]
}

export const setHyperParams = (data, hyperparams, setNewJobHyperParameters) => {
  const value = convertParamValue(data.value, data.valueType)

  setNewJobHyperParameters({
    ...hyperparams,
    [data.name]: typeof value === 'string' ? value.split(',') : [value]
  })
}

export const editNewJobParams = (
  selectedParameter,
  newJobTaskSpec,
  convertedValue,
  setNewJobHyperParameters
) => {
  const params = { ...newJobTaskSpec.parameters }

  if (
    selectedParameter.data.parameterType !== panelData.newParameterType[0].id
  ) {
    delete params[selectedParameter.data.name]

    setNewJobHyperParameters(
      editHyperParams(
        { ...newJobTaskSpec.hyperparams },
        selectedParameter.data,
        selectedParameter.newName,
        convertedValue
      )
    )

    return params
  }

  if (selectedParameter.newName) {
    delete params[selectedParameter.data.name]
    params[selectedParameter.newName] = convertedValue
  } else {
    params[selectedParameter.data.name] = convertedValue
  }

  return params
}

export const setTableData = (
  panelState,
  panelDispatch,
  selectedParameter,
  parametersDispatch
) => {
  const newParametersArray = panelState.tableData.parameters.map(param => {
    if (param.data.name === selectedParameter.data.name) {
      if (selectedParameter.newName) {
        param.data.name = selectedParameter.newName
      }

      param.data.value = selectedParameter.data.value
      param.data.valueType = selectedParameter.data.valueType
      param.data.parameterType = selectedParameter.data.parameterType
    }

    return param
  })

  panelDispatch({
    type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
    payload: newParametersArray
  })
  parametersDispatch({
    type: parametersActions.SET_SELECTED_PARAMETER,
    payload: {}
  })
  panelDispatch({
    type: panelActions.SET_TABLE_DATA_PARAMETERS,
    payload: newParametersArray
  })
}

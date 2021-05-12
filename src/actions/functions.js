import functionsApi from '../api/functions-api'
import yaml from 'js-yaml'
import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_FUNCTION_TEMPLATE_BEGIN,
  FETCH_FUNCTION_TEMPLATE_FAILURE,
  FETCH_FUNCTION_TEMPLATE_SUCCESS,
  REMOVE_FUNCTION_TEMPLATE,
  SET_FUNCTIONS_TEMPLATES,
  SET_LOADING,
  SET_NEW_FUNCTION_NAME,
  SET_NEW_FUNCTION_TAG,
  SET_NEW_FUNCTION_TYPE,
  SET_NEW_FUNCTION_DESCRIPTION,
  SET_NEW_FUNCTION_LABELS
} from '../constants'
import { generateCategories } from '../utils/generateTemplatesCategories'

const functionsActions = {
  deleteFunction: (func, project) => dispatch => {
    return functionsApi.deleteSelectedFunction(func, project)
  },
  fetchFunctions: (project, name) => dispatch => {
    dispatch(functionsActions.fetchFunctionsBegin())

    return functionsApi
      .getAll(project, name)
      .then(({ data }) => {
        dispatch(functionsActions.fetchFunctionsSuccess(data.funcs))

        return data.funcs
      })
      .catch(err => dispatch(functionsActions.fetchFunctionsFailure(err)))
  },
  fetchFunctionsBegin: () => ({
    type: FETCH_FUNCTIONS_BEGIN
  }),
  fetchFunctionsSuccess: funcs => ({
    type: FETCH_FUNCTIONS_SUCCESS,
    payload: funcs
  }),
  fetchFunctionsFailure: error => ({
    type: FETCH_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchFunctionsTemplates: () => dispatch => {
    return functionsApi
      .getFunctionTemplatesCatalog()
      .then(({ data: functionTemplates }) => {
        const templates = Object.entries(functionTemplates).map(
          ([key, value]) => ({
            kind: value?.kind,
            metadata: {
              name: key,
              hash: '',
              description: value?.description,
              categories: value?.categories,
              versions: value?.versions,
              tag: ''
            },
            status: {
              state: ''
            }
          })
        )
        const templatesCategories = generateCategories(templates)
        dispatch(functionsActions.setFunctionsTemplates(templatesCategories))

        return { templatesCategories, templates }
      })
      .catch(error => dispatch(functionsActions.fetchJobLogsFailure(error)))
  },
  fetchFunctionTemplate: path => dispatch => {
    dispatch(functionsActions.fetchFunctionTemplateBegin())

    return functionsApi
      .getFunctionTemplate(path)
      .then(response => {
        let parsedData = yaml.safeLoad(response.data)
        const templates = {
          name: parsedData.metadata.name,
          functions: parsedData.spec.entry_point ? [] : [parsedData]
        }

        dispatch(functionsActions.fetchFunctionTemplateSuccess(templates))

        return templates
      })
      .catch(err =>
        dispatch(functionsActions.fetchFunctionTemplateFailure(err))
      )
  },
  fetchFunctionTemplateSuccess: selectFunction => ({
    type: FETCH_FUNCTION_TEMPLATE_SUCCESS,
    payload: selectFunction
  }),
  fetchFunctionTemplateBegin: () => ({
    type: FETCH_FUNCTION_TEMPLATE_BEGIN
  }),
  fetchFunctionTemplateFailure: err => ({
    type: FETCH_FUNCTION_TEMPLATE_FAILURE,
    payload: err
  }),
  removeFunctionTemplate: () => ({
    type: REMOVE_FUNCTION_TEMPLATE
  }),
  setFunctionsTemplates: templates => ({
    type: SET_FUNCTIONS_TEMPLATES,
    payload: templates
  }),
  setLoading: loading => ({
    type: SET_LOADING,
    payload: loading
  }),
  setNewFunctionDescription: description => ({
    type: SET_NEW_FUNCTION_DESCRIPTION,
    payload: description
  }),
  setNewFunctionLabels: labels => ({
    type: SET_NEW_FUNCTION_LABELS,
    payload: labels
  }),
  setNewFunctionName: name => ({
    type: SET_NEW_FUNCTION_NAME,
    payload: name
  }),
  setNewFunctionTag: tag => ({
    type: SET_NEW_FUNCTION_TAG,
    payload: tag
  }),
  setNewFunctionType: type => ({
    type: SET_NEW_FUNCTION_TYPE,
    payload: type
  })
}

export default functionsActions

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
  SET_LOADING
} from '../constants'
import { generateCategories } from '../utils/generateTemplatesCategories'

const functionsActions = {
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
  fetchFunctionsSuccess: jobsList => ({
    type: FETCH_FUNCTIONS_SUCCESS,
    payload: jobsList
  }),
  fetchFunctionsFailure: error => ({
    type: FETCH_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchFunctionsTemplates: () => dispatch => {
    return functionsApi
      .getFunctionTemplatesCatalog()
      .then(result => {
        const templates = Object.keys(result.data).map(func => {
          return {
            metadata: {
              name: func,
              hash: '',
              description: result.data[func].description,
              categories: result.data[func].categories,
              versions: result.data[func].versions,
              tag: ''
            },
            status: {
              status: ''
            }
          }
        })
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

        dispatch(
          functionsActions.fetchFunctionTemplateSuccess({
            name: parsedData.metadata.name,
            functions: parsedData.spec.entry_point ? [] : [parsedData]
          })
        )
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
  })
}

export default functionsActions

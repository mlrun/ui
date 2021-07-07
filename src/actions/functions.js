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
  SET_NEW_FUNCTION_LABELS,
  SET_NEW_FUNCTION_SOURCE_CODE,
  SET_NEW_FUNCTION_HANDLER,
  SET_NEW_FUNCTION_IMAGE,
  SET_NEW_FUNCTION_BASE_IMAGE,
  SET_NEW_FUNCTION_COMMANDS,
  SET_NEW_FUNCTION_VOLUME_MOUNTS,
  SET_NEW_FUNCTION_VOLUMES,
  SET_NEW_FUNCTION_RESOURCES,
  SET_NEW_FUNCTION_ENV,
  REMOVE_NEW_FUNCTION,
  CREATE_NEW_FUNCTION_BEGIN,
  CREATE_NEW_FUNCTION_FAILURE,
  CREATE_NEW_FUNCTION_SUCCESS,
  REMOVE_FUNCTIONS_ERROR,
  DEPLOY_FUNCTION_BEGIN,
  DEPLOY_FUNCTION_FAILURE,
  DEPLOY_FUNCTION_SUCCESS,
  SET_NEW_FUNCTION_SECRETS,
  SET_NEW_FUNCTION_BUILD_IMAGE,
  SET_NEW_FUNCTION_PROJECT,
  RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE,
  FETCH_FUNCTION_LOGS_SUCCESS,
  FETCH_FUNCTION_LOGS_FAILURE,
  FETCH_FUNCTION_LOGS_BEGIN,
  REMOVE_FUNCTION_LOGS
} from '../constants'
import { generateCategories } from '../utils/generateTemplatesCategories'

const functionsActions = {
  createNewFunction: (project, data) => dispatch => {
    dispatch(functionsActions.createNewFunctionBegin())

    return functionsApi
      .createNewFunction(project, data)
      .then(result => {
        dispatch(functionsActions.createNewFunctionSuccess())

        return result
      })
      .catch(error => {
        dispatch(functionsActions.createNewFunctionFailure(error.message))

        throw error
      })
  },
  createNewFunctionBegin: () => ({
    type: CREATE_NEW_FUNCTION_BEGIN
  }),
  createNewFunctionFailure: error => ({
    type: CREATE_NEW_FUNCTION_FAILURE,
    payload: error
  }),
  createNewFunctionSuccess: () => ({
    type: CREATE_NEW_FUNCTION_SUCCESS
  }),
  deleteFunction: (func, project) => () => {
    return functionsApi.deleteSelectedFunction(func, project)
  },
  deployFunction: func => dispatch => {
    dispatch(functionsActions.deployFunctionBegin())

    return functionsApi
      .deployFunction(func)
      .then(result => {
        dispatch(functionsActions.deployFunctionSuccess())

        return result
      })
      .catch(error => {
        dispatch(functionsActions.deployFunctionFailure())

        throw error
      })
  },
  deployFunctionBegin: () => ({
    type: DEPLOY_FUNCTION_BEGIN
  }),
  deployFunctionFailure: () => ({
    type: DEPLOY_FUNCTION_FAILURE
  }),
  deployFunctionSuccess: () => ({
    type: DEPLOY_FUNCTION_SUCCESS
  }),
  fetchFunctionLogs: (project, name, tag, offset) => dispatch => {
    dispatch(functionsActions.fetchFunctionLogsBegin())

    return functionsApi
      .getFunctionLogs(project, name, tag, offset)
      .then(result => {
        dispatch(functionsActions.fetchFunctionLogsSuccess(result.data))

        return result
      })
      .catch(error =>
        dispatch(functionsActions.fetchFunctionLogsFailure(error))
      )
  },
  fetchFunctionLogsBegin: () => ({
    type: FETCH_FUNCTION_LOGS_BEGIN
  }),
  fetchFunctionLogsFailure: error => ({
    type: FETCH_FUNCTION_LOGS_FAILURE,
    payload: error
  }),
  fetchFunctionLogsSuccess: logs => ({
    type: FETCH_FUNCTION_LOGS_SUCCESS,
    payload: logs
  }),
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
  fetchFunctionsFailure: error => ({
    type: FETCH_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchFunctionsSuccess: funcs => ({
    type: FETCH_FUNCTIONS_SUCCESS,
    payload: funcs
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
      .catch(err => {
        dispatch(functionsActions.fetchFunctionTemplateFailure(err))
      })
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
  removeFunctionLogs: () => ({
    type: REMOVE_FUNCTION_LOGS
  }),
  removeFunctionTemplate: () => ({
    type: REMOVE_FUNCTION_TEMPLATE
  }),
  removeFunctionsError: () => ({
    type: REMOVE_FUNCTIONS_ERROR
  }),
  removeNewFunction: () => ({
    type: REMOVE_NEW_FUNCTION
  }),
  resetNewFunctionCodeCustomImage: () => ({
    type: RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE
  }),
  setFunctionsTemplates: templates => ({
    type: SET_FUNCTIONS_TEMPLATES,
    payload: templates
  }),
  setLoading: loading => ({
    type: SET_LOADING,
    payload: loading
  }),
  setNewFunctionBaseImage: base_image => ({
    type: SET_NEW_FUNCTION_BASE_IMAGE,
    payload: base_image
  }),
  setNewFunctionBuildImage: build_image => ({
    type: SET_NEW_FUNCTION_BUILD_IMAGE,
    payload: build_image
  }),
  setNewFunctionCommands: commands => ({
    type: SET_NEW_FUNCTION_COMMANDS,
    payload: commands
  }),
  setNewFunctionDescription: description => ({
    type: SET_NEW_FUNCTION_DESCRIPTION,
    payload: description
  }),
  setNewFunctionEnv: env => ({
    type: SET_NEW_FUNCTION_ENV,
    payload: env
  }),
  setNewFunctionHandler: handler => ({
    type: SET_NEW_FUNCTION_HANDLER,
    payload: handler
  }),
  setNewFunctionImage: image => ({
    type: SET_NEW_FUNCTION_IMAGE,
    payload: image
  }),
  setNewFunctionLabels: labels => ({
    type: SET_NEW_FUNCTION_LABELS,
    payload: labels
  }),
  setNewFunctionName: name => ({
    type: SET_NEW_FUNCTION_NAME,
    payload: name
  }),
  setNewFunctionProject: project => ({
    type: SET_NEW_FUNCTION_PROJECT,
    payload: project
  }),
  setNewFunctionResources: resources => ({
    type: SET_NEW_FUNCTION_RESOURCES,
    payload: resources
  }),
  setNewFunctionSecretSources: secrets => ({
    type: SET_NEW_FUNCTION_SECRETS,
    payload: secrets
  }),
  setNewFunctionSourceCode: code => ({
    type: SET_NEW_FUNCTION_SOURCE_CODE,
    payload: code
  }),
  setNewFunctionTag: tag => ({
    type: SET_NEW_FUNCTION_TAG,
    payload: tag
  }),
  setNewFunctionType: type => ({
    type: SET_NEW_FUNCTION_TYPE,
    payload: type
  }),
  setNewFunctionVolumeMounts: volumeMounts => ({
    type: SET_NEW_FUNCTION_VOLUME_MOUNTS,
    payload: volumeMounts
  }),
  setNewFunctionVolumes: volumes => ({
    type: SET_NEW_FUNCTION_VOLUMES,
    payload: volumes
  })
}

export default functionsActions

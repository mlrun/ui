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
  REMOVE_FUNCTION_LOGS,
  SET_NEW_FUNCTION,
  SET_NEW_FUNCTION_KIND,
  SET_NEW_FUNCTION_GRAPH,
  SET_NEW_FUNCTION_TRACK_MODELS,
  SET_NEW_FUNCTION_PARAMETERS,
  SET_NEW_FUNCTION_ERROR_STREAM,
  SET_NEW_FUNCTION_DEFAULT_CLASS,
  SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT,
  SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY,
  GET_FUNCTION_SUCCESS,
  GET_FUNCTION_FAILURE,
  GET_FUNCTION_BEGIN,
  GET_FUNCTION_WITH_HASH_BEGIN,
  GET_FUNCTION_WITH_HASH_FAILURE,
  GET_FUNCTION_WITH_HASH_SUCCESS,
  REMOVE_FUNCTION,
  SET_NEW_FUNCTION_FORCE_BUILD
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
  deployFunction: data => dispatch => {
    dispatch(functionsActions.deployFunctionBegin())

    return functionsApi
      .deployFunction(data)
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
  getFunction: (project, name) => dispatch => {
    dispatch(functionsActions.getFunctionBegin())

    return functionsApi
      .getFunction(project, name)
      .then(result => {
        dispatch(functionsActions.getFunctionSuccess(result.data.func))

        return result.data.func
      })
      .catch(error => {
        dispatch(functionsActions.getFunctionFailure(error.message))
        throw error
      })
  },
  getFunctionBegin: () => ({
    type: GET_FUNCTION_BEGIN
  }),
  getFunctionFailure: error => ({
    type: GET_FUNCTION_FAILURE,
    payload: error
  }),
  getFunctionSuccess: func => ({
    type: GET_FUNCTION_SUCCESS,
    payload: func
  }),
  getFunctionWithHash: (project, name, hash) => dispatch => {
    dispatch(functionsActions.getFunctionWithHashBegin())

    return functionsApi
      .getFunctionWithHash(project, name, hash)
      .then(result => {
        dispatch(functionsActions.getFunctionWithHashSuccess(result.data.func))

        return result.data.func
      })
      .catch(error => {
        dispatch(functionsActions.getFunctionWithHashFailure(error.message))
        throw error
      })
  },
  getFunctionWithHashBegin: () => ({
    type: GET_FUNCTION_WITH_HASH_BEGIN
  }),
  getFunctionWithHashFailure: error => ({
    type: GET_FUNCTION_WITH_HASH_FAILURE,
    payload: error
  }),
  getFunctionWithHashSuccess: func => ({
    type: GET_FUNCTION_WITH_HASH_SUCCESS,
    payload: func
  }),
  removeFunction: () => ({
    type: REMOVE_FUNCTION
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
  setNewFunction: func => ({
    type: SET_NEW_FUNCTION,
    payload: func
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
  setNewFunctionDefaultClass: default_class => ({
    type: SET_NEW_FUNCTION_DEFAULT_CLASS,
    payload: default_class
  }),
  setNewFunctionDescription: description => ({
    type: SET_NEW_FUNCTION_DESCRIPTION,
    payload: description
  }),
  setNewFunctionDisableAutoMount: value => ({
    type: SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT,
    payload: value
  }),
  setNewFunctionEnv: env => ({
    type: SET_NEW_FUNCTION_ENV,
    payload: env
  }),
  setNewFunctionErrorStream: error_stream => ({
    type: SET_NEW_FUNCTION_ERROR_STREAM,
    payload: error_stream
  }),
  setNewFunctionForceBuild: forceBuild => ({
    type: SET_NEW_FUNCTION_FORCE_BUILD,
    payload: forceBuild
  }),
  setNewFunctionGraph: graph => ({
    type: SET_NEW_FUNCTION_GRAPH,
    payload: graph
  }),
  setNewFunctionHandler: handler => ({
    type: SET_NEW_FUNCTION_HANDLER,
    payload: handler
  }),
  setNewFunctionImage: image => ({
    type: SET_NEW_FUNCTION_IMAGE,
    payload: image
  }),
  setNewFunctionKind: kind => ({
    type: SET_NEW_FUNCTION_KIND,
    payload: kind
  }),
  setNewFunctionLabels: labels => ({
    type: SET_NEW_FUNCTION_LABELS,
    payload: labels
  }),
  setNewFunctionCredentialsAccessKey: accessKey => ({
    type: SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY,
    payload: accessKey
  }),
  setNewFunctionName: name => ({
    type: SET_NEW_FUNCTION_NAME,
    payload: name
  }),
  setNewFunctionParameters: parameters => ({
    type: SET_NEW_FUNCTION_PARAMETERS,
    payload: parameters
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
  setNewFunctionTrackModels: trackModels => ({
    type: SET_NEW_FUNCTION_TRACK_MODELS,
    payload: trackModels
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

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
import yaml from 'js-yaml'
import {
  CREATE_NEW_FUNCTION_BEGIN,
  CREATE_NEW_FUNCTION_FAILURE,
  CREATE_NEW_FUNCTION_SUCCESS,
  DEPLOY_FUNCTION_BEGIN,
  DEPLOY_FUNCTION_FAILURE,
  DEPLOY_FUNCTION_SUCCESS,
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  FETCH_FUNCTIONS_TEMPLATES_FAILURE,
  FETCH_FUNCTION_NUCLIO_LOGS_BEGIN,
  FETCH_FUNCTION_NUCLIO_LOGS_FAILURE,
  FETCH_FUNCTION_NUCLIO_LOGS_SUCCESS,
  FETCH_FUNCTION_LOGS_BEGIN,
  FETCH_FUNCTION_LOGS_FAILURE,
  FETCH_FUNCTION_LOGS_SUCCESS,
  FETCH_FUNCTION_TEMPLATE_BEGIN,
  FETCH_FUNCTION_TEMPLATE_FAILURE,
  FETCH_FUNCTION_TEMPLATE_SUCCESS,
  FETCH_HUB_FUNCTIONS_BEGIN,
  FETCH_HUB_FUNCTIONS_FAILURE,
  FETCH_HUB_FUNCTION_TEMPLATE_BEGIN,
  FETCH_HUB_FUNCTION_TEMPLATE_FAILURE,
  FETCH_HUB_FUNCTION_TEMPLATE_SUCCESS,
  GET_FUNCTION_BEGIN,
  GET_FUNCTION_FAILURE,
  GET_FUNCTION_SUCCESS,
  REMOVE_FUNCTION,
  REMOVE_FUNCTIONS_ERROR,
  REMOVE_FUNCTION_TEMPLATE,
  REMOVE_HUB_FUNCTIONS,
  REMOVE_NEW_FUNCTION,
  RESET_NEW_FUNCTION_CODE_CUSTOM_IMAGE,
  SET_FUNCTIONS_TEMPLATES,
  SET_HUB_FUNCTIONS,
  SET_LOADING,
  SET_NEW_FUNCTION,
  SET_NEW_FUNCTION_BASE_IMAGE,
  SET_NEW_FUNCTION_BUILD_IMAGE,
  SET_NEW_FUNCTION_COMMANDS,
  SET_NEW_FUNCTION_CREDENTIALS_ACCESS_KEY,
  SET_NEW_FUNCTION_DEFAULT_CLASS,
  SET_NEW_FUNCTION_DESCRIPTION,
  SET_NEW_FUNCTION_DISABLE_AUTO_MOUNT,
  SET_NEW_FUNCTION_ENV,
  SET_NEW_FUNCTION_ERROR_STREAM,
  SET_NEW_FUNCTION_FORCE_BUILD,
  SET_NEW_FUNCTION_GRAPH,
  SET_NEW_FUNCTION_HANDLER,
  SET_NEW_FUNCTION_IMAGE,
  SET_NEW_FUNCTION_KIND,
  SET_NEW_FUNCTION_NAME,
  SET_NEW_FUNCTION_PARAMETERS,
  SET_NEW_FUNCTION_PREEMTION_MODE,
  SET_NEW_FUNCTION_PRIORITY_CLASS_NAME,
  SET_NEW_FUNCTION_PROJECT,
  SET_NEW_FUNCTION_REQUIREMENTS,
  SET_NEW_FUNCTION_RESOURCES,
  SET_NEW_FUNCTION_SECRETS,
  SET_NEW_FUNCTION_SOURCE_CODE,
  SET_NEW_FUNCTION_TAG,
  SET_NEW_FUNCTION_TRACK_MODELS,
  SET_NEW_FUNCTION_VOLUMES,
  SET_NEW_FUNCTION_VOLUME_MOUNTS
} from '../constants'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { generateCategories, generateHubCategories } from '../utils/generateTemplatesCategories'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'
import { showErrorNotification } from '../utils/notifications.util'
import functionsApi from '../api/functions-api'
import mlrunNuclioApi from '../api/mlrun-nuclio-api'

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
        const message =
          error.response.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'You are not permitted to create a new function.'
            : error.message

        dispatch(functionsActions.createNewFunctionFailure(message))
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
  deleteFunction: (funcName, project) => () => {
    return functionsApi.deleteSelectedFunction(funcName, project)
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
  fetchFunctionLogs: (project, name, tag) => dispatch => {
    dispatch(functionsActions.fetchFunctionLogsBegin())

    return functionsApi
      .getFunctionLogs(project, name, tag)
      .then(result => {
        dispatch(functionsActions.fetchFunctionLogsSuccess())

        return result
      })
      .catch(error => dispatch(functionsActions.fetchFunctionLogsFailure(error)))
  },
  fetchFunctionLogsBegin: () => ({
    type: FETCH_FUNCTION_LOGS_BEGIN
  }),
  fetchFunctionLogsFailure: error => ({
    type: FETCH_FUNCTION_LOGS_FAILURE,
    payload: error
  }),
  fetchFunctionLogsSuccess: () => ({
    type: FETCH_FUNCTION_LOGS_SUCCESS
  }),
  fetchFunctionNuclioLogs: (project, name, tag) => dispatch => {
    dispatch(functionsActions.fetchFunctionNuclioLogsBegin())

    const config = {
      params: {}
    }

    if (tag) {
      config.params.tag = tag
    }

    return mlrunNuclioApi
      .getDeployLogs(project, name, config)
      .then(result => {
        dispatch(functionsActions.fetchFunctionNuclioLogsSuccess())

        return result
      })
      .catch(error => dispatch(functionsActions.fetchFunctionNuclioLogsFailure(error)))
  },
  fetchFunctionNuclioLogsBegin: () => ({
    type: FETCH_FUNCTION_NUCLIO_LOGS_BEGIN
  }),
  fetchFunctionNuclioLogsFailure: error => ({
    type: FETCH_FUNCTION_NUCLIO_LOGS_FAILURE,
    payload: error
  }),
  fetchFunctionNuclioLogsSuccess: () => ({
    type: FETCH_FUNCTION_NUCLIO_LOGS_SUCCESS
  }),
  fetchFunctionTemplate: path => dispatch => {
    dispatch(functionsActions.fetchFunctionTemplateBegin())

    return functionsApi
      .getFunctionTemplate(path)
      .then(response => {
        let parsedData = yaml.load(response.data)
        const templates = {
          name: parsedData.metadata.name,
          functions: parsedData.spec.entry_point ? [] : [parsedData]
        }

        dispatch(functionsActions.fetchFunctionTemplateSuccess(templates))

        return templates
      })
      .catch(error => {
        dispatch(functionsActions.fetchFunctionTemplateFailure(error))
        showErrorNotification(dispatch, error, "Function's template failed to load")
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
  fetchFunctions: (project, filters, config) => dispatch => {
    dispatch(functionsActions.fetchFunctionsBegin())

    return functionsApi
      .getFunctions(project, filters, config)
      .then(({ data }) => {
        dispatch(functionsActions.fetchFunctionsSuccess(data.funcs))

        return data.funcs
      })
      .catch(error => {
        dispatch(functionsActions.fetchFunctionsFailure(error.message))
        largeResponseCatchHandler(error, 'Failed to fetch functions', dispatch)
      })
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
        const templatesData = generateCategories(functionTemplates)

        dispatch(functionsActions.setFunctionsTemplates(templatesData))

        return templatesData
      })
      .catch(error => {
        dispatch(functionsActions.fetchFunctionsTemplatesFailure(error))
      })
  },
  fetchFunctionsTemplatesFailure: err => ({
    type: FETCH_FUNCTIONS_TEMPLATES_FAILURE,
    payload: err
  }),
  fetchHubFunction: hubFunctionName => dispatch => {
    dispatch(functionsActions.fetchHubFunctionTemplateBegin())

    return functionsApi
      .getHubFunction(hubFunctionName)
      .then(response => {
        dispatch(functionsActions.fetchHubFunctionTemplateSuccess())
        return response.data
      })
      .catch(error => {
        dispatch(functionsActions.fetchHubFunctionTemplateFailure(error))
        showErrorNotification(dispatch, error, 'The function failed to load')
      })
  },
  fetchHubFunctionTemplateSuccess: () => ({
    type: FETCH_HUB_FUNCTION_TEMPLATE_SUCCESS
  }),
  fetchHubFunctionTemplateBegin: () => ({
    type: FETCH_HUB_FUNCTION_TEMPLATE_BEGIN
  }),
  fetchHubFunctionTemplateFailure: err => ({
    type: FETCH_HUB_FUNCTION_TEMPLATE_FAILURE,
    payload: err
  }),
  fetchHubFunctions: allowedHubFunctions => dispatch => {
    dispatch(functionsActions.fetchHubFunctionsBegin())

    return functionsApi
      .getHubFunctions()
      .then(({ data: functionTemplates }) => {
        const templatesData = generateHubCategories(functionTemplates.catalog, allowedHubFunctions)

        dispatch(functionsActions.setHubFunctions(templatesData))

        return templatesData
      })
      .catch(error => {
        showErrorNotification(dispatch, error, 'Functions failed to load')
      })
  },

  fetchHubFunctionsBegin: () => ({
    type: FETCH_HUB_FUNCTIONS_BEGIN
  }),
  fetchHubFunctionsFailure: err => ({
    type: FETCH_HUB_FUNCTIONS_FAILURE,
    payload: err
  }),
  fetchFunction: (project, name, hash, tag) => dispatch => {
    dispatch(functionsActions.getFunctionBegin())

    return functionsApi
      .getFunction(project, name, hash, tag)
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
  removeFunction: () => ({
    type: REMOVE_FUNCTION
  }),
  removeHubFunctions: () => ({
    type: REMOVE_HUB_FUNCTIONS
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
  setFunctionsTemplates: payload => ({
    type: SET_FUNCTIONS_TEMPLATES,
    payload
  }),
  setHubFunctions: payload => ({
    type: SET_HUB_FUNCTIONS,
    payload
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
  setNewFunctionRequirements: requirements => ({
    type: SET_NEW_FUNCTION_REQUIREMENTS,
    payload: requirements
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
  setNewFunctionPriorityClassName: className => ({
    type: SET_NEW_FUNCTION_PRIORITY_CLASS_NAME,
    payload: className
  }),
  setNewFunctionPreemtionMode: mode => ({
    type: SET_NEW_FUNCTION_PREEMTION_MODE,
    payload: mode
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

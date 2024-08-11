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
import React, { useState, useLayoutEffect, useMemo, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { isEmpty } from 'lodash'

import JobsPanelView from './JobsPanelView'

import {
  getMethodOptions,
  getVersionOptions,
  getDefaultMethodAndVersion,
  generateTableData,
  generateRequestData,
  generateTableDataFromDefaultData
} from './jobsPanel.util'
import functionActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import { MONITOR_JOBS_TAB, PANEL_DEFAULT_ACCESS_KEY, SCHEDULE_TAB } from '../../constants'
import { initialState, panelReducer, panelActions } from './panelReducer'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { parseKeyValues } from '../../utils'
import { showErrorNotification } from '../../utils/notifications.util'

import './jobsPanel.scss'

const JobsPanel = ({
  closePanel,
  defaultData = null,
  fetchFunctionTemplate,
  frontendSpec,
  functionsStore,
  groupedFunctions = {},
  jobsStore,
  mode,
  onEditJob = () => {},
  onSuccessRun,
  project,
  redirectToDetailsPane = false,
  removeFunctionTemplate,
  removeFunctionsError,
  removeJobError,
  removeNewJob,
  runNewJob,
  setNewJob,
  setNewJobInputs,
  setNewJobSecretSources,
  withSaveChanges = false
}) => {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialState)
  const [openScheduleJob, setOpenScheduleJob] = useState(false)
  const [defaultDataIsLoaded, setDefaultDataIsLoaded] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState(
    !isEmpty(functionsStore.template) && !defaultData
      ? functionsStore.template.functions
      : groupedFunctions.functions || {}
  )
  const [tableDataIsLoaded, setTableDataIsLoaded] = useState(false)
  const [validation, setValidation] = useState({
    isNameValid: true,
    isArtifactPathValid: true,
    isMemoryRequestValid: true,
    isCpuRequestValid: true,
    isMemoryLimitValid: true,
    isCpuLimitValid: true,
    isGpuLimitValid: true,
    isAccessKeyValid: true,
    isLabelsValid: true
  })
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    if (
      !groupedFunctions.name &&
      !functionsStore.template.name &&
      !defaultData &&
      !functionsStore.error
    ) {
      fetchFunctionTemplate(groupedFunctions.metadata.versions.latest).then(result => {
        if (result) {
          setSelectedFunction(result.functions)
        }
      })
    }

    return () => functionsStore.template.name && removeFunctionTemplate()
  }, [
    defaultData,
    fetchFunctionTemplate,
    functionsStore.error,
    functionsStore.template.name,
    groupedFunctions,
    removeFunctionTemplate,
    setSelectedFunction
  ])

  useEffect(() => {
    if (!functionsStore.template.name && functionsStore.error) {
      showErrorNotification(
        dispatch,
        functionsStore.error,
        '',
        'Function template could not be loaded'
      )
      closePanel()
      removeFunctionsError()
    }
  }, [
    closePanel,
    dispatch,
    functionsStore.error,
    functionsStore.template.name,
    removeFunctionsError
  ])

  useEffect(() => {
    if (panelState.editMode) {
      if (panelState.previousPanelData.titleInfo.method !== panelState.currentFunctionInfo.method) {
        generateTableData(
          panelState.currentFunctionInfo.method,
          selectedFunction,
          panelDispatch,
          setNewJob,
          panelState.limits,
          panelState.requests,
          mode,
          frontendSpec
        )
      } else {
        panelDispatch({
          type: panelActions.SET_TABLE_DATA,
          payload: panelState.previousPanelData.tableData
        })
      }
    }
  }, [
    frontendSpec,
    mode,
    panelState.currentFunctionInfo.method,
    panelState.editMode,
    panelState.limits,
    panelState.previousPanelData.tableData,
    panelState.previousPanelData.titleInfo.method,
    panelState.requests,
    selectedFunction,
    setNewJob
  ])

  useEffect(() => {
    if (
      !panelState.editMode &&
      isEveryObjectValueEmpty(panelState.tableData) &&
      isEveryObjectValueEmpty(panelState.requests) &&
      isEveryObjectValueEmpty(panelState.limits) &&
      (!selectedFunction || !isEveryObjectValueEmpty(selectedFunction)) &&
      !tableDataIsLoaded
    ) {
      generateTableData(
        panelState.currentFunctionInfo.method,
        selectedFunction,
        panelDispatch,
        setNewJob,
        panelState.limits,
        panelState.requests,
        mode,
        frontendSpec
      )
      setTableDataIsLoaded(true)
    } else if (
      !panelState.editMode &&
      isEveryObjectValueEmpty(panelState.tableData) &&
      defaultData &&
      !defaultDataIsLoaded
    ) {
      generateTableDataFromDefaultData(
        defaultData,
        panelDispatch,
        panelState.limits,
        panelState.requests,
        setNewJob,
        setDefaultDataIsLoaded,
        mode,
        frontendSpec?.default_function_pod_resources
      )
    }
  }, [
    defaultData,
    defaultDataIsLoaded,
    frontendSpec,
    mode,
    panelState.currentFunctionInfo,
    panelState.currentFunctionInfo.method,
    panelState.editMode,
    panelState.limits,
    panelState.requests,
    panelState.tableData,
    selectedFunction,
    setNewJob,
    tableDataIsLoaded
  ])

  useEffect(() => {
    if (
      isEveryObjectValueEmpty(panelState.previousPanelData.tableData) &&
      !isEveryObjectValueEmpty(panelState.tableData)
    ) {
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_TABLE_DATA,
        payload: panelState.tableData
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_ACCESS_KEY,
        payload: PANEL_DEFAULT_ACCESS_KEY
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_PREEMPTION_MODE,
        payload: panelState.preemption_mode
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_PRIORITY_CLASS_NAME,
        payload: panelState.priority_class_name
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_LIMITS,
        payload: panelState.limits
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_REQUESTS,
        payload: panelState.requests
      })
    }

    return () => {
      jobsStore.error && removeJobError()
    }
  }, [
    jobsStore.error,
    panelState.previousPanelData.tableData,
    panelState.tableData,
    panelState.preemption_mode,
    panelState.priority_class_name,
    panelState.limits,
    panelState.requests,
    removeJobError
  ])

  const checkValidation = () => {
    return Object.values(validation).every(value => value)
  }

  const functionData = useMemo(() => {
    if (!isEmpty(selectedFunction)) {
      const versionOptions = getVersionOptions(selectedFunction)
      const methodOptions = getMethodOptions(selectedFunction)
      const { defaultMethod, defaultVersion } = getDefaultMethodAndVersion(
        versionOptions,
        selectedFunction
      )

      panelDispatch({
        type: panelActions.SET_CURRENT_FUNCTION_INFO,
        payload: {
          labels: parseKeyValues(selectedFunction[0].metadata.labels || []),
          name: functionsStore.template.name || groupedFunctions.name,
          method: defaultMethod || (methodOptions[0]?.id ?? ''),
          methodDescription: methodOptions[0]?.subLabel ?? '',
          version: groupedFunctions.tag || defaultVersion
        }
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_TITLE_INFO,
        payload: {
          method: defaultMethod || (methodOptions[0]?.id ?? ''),
          version: defaultVersion
        }
      })

      return {
        methodOptions,
        versionOptions
      }
    } else if (defaultData) {
      panelDispatch({
        type: panelActions.SET_CURRENT_FUNCTION_INFO,
        payload: {
          labels: parseKeyValues(defaultData.task.metadata.labels || []),
          name: defaultData.task.metadata.name,
          method: '',
          methodDescription: '',
          version: ''
        }
      })
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_TITLE_INFO,
        payload: {
          method: '',
          version: ''
        }
      })
    }

    return {
      methodOptions: [],
      versionOptions: []
    }
  }, [
    defaultData,
    functionsStore.template.name,
    groupedFunctions.name,
    groupedFunctions.tag,
    selectedFunction
  ])

  const handleRunJob = (event, cronString) => {
    if (
      validation.isAccessKeyValid &&
      jobsStore.newJob.function.metadata.credentials.access_key.length === 0
    ) {
      return setValidation(state => ({
        ...state,
        isAccessKeyValid: false
      }))
    }

    const selectedFunction = functionsStore.template.name
      ? functionsStore.template.functions[0]
      : !isEmpty(groupedFunctions.functions)
        ? groupedFunctions.functions.find(
            func => func.metadata.tag === panelState.currentFunctionInfo.version
          ) ?? groupedFunctions.functions[0]
        : defaultData?.task
    const isFunctionTemplate = !isEmpty(functionsStore.template)
    const labels = {}

    panelState.currentFunctionInfo.labels.forEach(
      label => (labels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    const postData = generateRequestData(
      jobsStore,
      cronString,
      panelState,
      project,
      labels,
      params,
      selectedFunction,
      isFunctionTemplate,
      defaultData?.task.spec.function,
      mode,
      defaultData?.task.spec.handler
    )

    if (jobsStore.error) {
      removeJobError()
    }

    runNewJob(postData)
      .then(result => {
        removeNewJob()

        if (redirectToDetailsPane) {
          return navigate(
            `/projects/${project}/jobs/${cronString ? SCHEDULE_TAB : MONITOR_JOBS_TAB}/${
              result.data.data.metadata.name
            }/${result.data.data.metadata.uid}/overview`
          )
        }

        return navigate(`/projects/${project}/jobs/${cronString ? SCHEDULE_TAB : MONITOR_JOBS_TAB}`)
      })
      .then(() => {
        onSuccessRun && onSuccessRun(cronString ? SCHEDULE_TAB : MONITOR_JOBS_TAB)
      })
  }

  const handleEditJob = (event, cronString) => {
    if (
      validation.isAccessKeyValid &&
      jobsStore.newJob.function.metadata.credentials.access_key.length === 0
    ) {
      return setValidation(state => ({
        ...state,
        isAccessKeyValid: false
      }))
    }

    const postData = generateRequestData(
      jobsStore,
      cronString,
      panelState,
      project,
      defaultData.task.metadata.labels,
      params,
      selectedFunction,
      false,
      defaultData.task.spec.function
    )

    if (jobsStore.error) {
      removeJobError()
    }

    onEditJob(event, postData)
  }

  return createPortal(
    <JobsPanelView
      checkValidation={checkValidation()}
      closePanel={closePanel}
      defaultData={defaultData}
      functionData={functionData}
      handleEditJob={handleEditJob}
      handleRunJob={handleRunJob}
      jobsStore={jobsStore}
      loading={jobsStore.loading || functionsStore.loading || functionsStore.funcLoading}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      panelState={panelState}
      removeJobError={removeJobError}
      setNewJobInputs={setNewJobInputs}
      setNewJobSecretSources={setNewJobSecretSources}
      setOpenScheduleJob={setOpenScheduleJob}
      setValidation={setValidation}
      validation={validation}
      withSaveChanges={withSaveChanges}
    />,
    document.getElementById('overlay_container')
  )
}

JobsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  groupedFunctions: PropTypes.shape({}),
  mode: PropTypes.string.isRequired,
  onEditJob: PropTypes.func,
  project: PropTypes.string.isRequired,
  redirectToDetailsPane: PropTypes.bool,
  runNewJob: PropTypes.func.isRequired,
  withSaveChanges: PropTypes.bool
}

export default connect(
  ({ jobsStore, functionsStore, appStore }) => ({
    jobsStore,
    functionsStore,
    frontendSpec: appStore.frontendSpec
  }),
  { ...jobsActions, ...functionActions }
)(JobsPanel)

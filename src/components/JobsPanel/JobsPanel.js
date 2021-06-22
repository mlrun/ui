import React, {
  useState,
  useLayoutEffect,
  useMemo,
  useReducer,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isEmpty } from 'lodash'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'
import functionActions from '../../actions/functions'
import {
  getMethodOptions,
  getVersionOptions,
  getDefaultMethodAndVersion,
  generateTableData,
  generateRequestData,
  generateTableDataFromDefaultData
} from './jobsPanel.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { initialState, panelReducer, panelActions } from './panelReducer'
import { parseKeyValues } from '../../utils'
import notificationActions from '../../actions/notification'

import './jobsPanel.scss'

const JobsPanel = ({
  closePanel,
  defaultData,
  fetchFunctionTemplate,
  functionsStore,
  groupedFunctions,
  jobsStore,
  match,
  onEditJob,
  onSuccessRun,
  project,
  redirectToDetailsPane,
  removeFunctionTemplate,
  removeFunctionsError,
  removeJobError,
  removeNewJob,
  runNewJob,
  setNewJob,
  setNewJobEnvironmentVariables,
  setNewJobInputs,
  setNewJobSecretSources,
  setNotification,
  withSaveChanges
}) => {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialState)
  const [openScheduleJob, setOpenScheduleJob] = useState(false)
  const [defaultDataIsLoaded, setDefaultDataIsLoaded] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState(
    !isEmpty(functionsStore.template) && !defaultData
      ? functionsStore.template.functions
      : groupedFunctions.functions || {}
  )
  const history = useHistory()

  useLayoutEffect(() => {
    if (
      !groupedFunctions.name &&
      !functionsStore.template.name &&
      !defaultData &&
      !functionsStore.error
    ) {
      fetchFunctionTemplate(groupedFunctions.metadata.versions.latest).then(
        result => {
          if (result) {
            setSelectedFunction(result.functions)
          }
        }
      )
    }

    return () => functionsStore.template.name && removeFunctionTemplate()
  }, [
    defaultData,
    fetchFunctionTemplate,
    functionsStore.error,
    functionsStore.template.name,
    groupedFunctions,
    removeFunctionTemplate
  ])

  useEffect(() => {
    if (!functionsStore.template.name && functionsStore.error) {
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Function template could not be loaded'
      })
      closePanel()
      removeFunctionsError()
    }
  }, [
    closePanel,
    functionsStore.error,
    functionsStore.template.name,
    removeFunctionsError,
    setNotification
  ])

  useEffect(() => {
    if (panelState.editMode) {
      if (
        panelState.previousPanelData.titleInfo.method !==
        panelState.currentFunctionInfo.method
      ) {
        generateTableData(
          panelState.currentFunctionInfo.method,
          selectedFunction,
          panelDispatch,
          setNewJob
        )
      } else {
        panelDispatch({
          type: panelActions.SET_TABLE_DATA,
          payload: panelState.previousPanelData.tableData
        })
      }
    }
  }, [
    panelState.currentFunctionInfo.method,
    panelState.editMode,
    panelState.previousPanelData.tableData,
    panelState.previousPanelData.titleInfo.method,
    selectedFunction,
    setNewJob
  ])

  useEffect(() => {
    if (
      !panelState.editMode &&
      isEveryObjectValueEmpty(panelState.tableData) &&
      !isEveryObjectValueEmpty(selectedFunction)
    ) {
      generateTableData(
        panelState.currentFunctionInfo.method,
        selectedFunction,
        panelDispatch,
        setNewJob,
        panelState.limits,
        panelState.requests
      )
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
        setDefaultDataIsLoaded
      )
    }
  }, [
    defaultData,
    defaultDataIsLoaded,
    panelState.currentFunctionInfo,
    panelState.currentFunctionInfo.method,
    panelState.editMode,
    panelState.limits,
    panelState.requests,
    panelState.tableData,
    selectedFunction,
    setNewJob
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
    }

    return () => {
      jobsStore.error && removeJobError()
    }
  }, [
    jobsStore.error,
    panelState.previousPanelData.tableData,
    panelState.tableData,
    removeJobError
  ])

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
    const selectedFunction = functionsStore.template.name
      ? functionsStore.template.functions[0]
      : groupedFunctions.functions
      ? groupedFunctions.functions.find(
          func => func.metadata.tag === panelState.currentFunctionInfo.version
        )
      : defaultData
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
      match,
      selectedFunction,
      isFunctionTemplate,
      defaultData?.task.spec.function
    )

    if (jobsStore.error) {
      removeJobError()
    }

    runNewJob(postData)
      .then(result => {
        removeNewJob()

        if (redirectToDetailsPane) {
          return history.push(
            `/projects/${project}/jobs/${cronString ? 'schedule' : 'monitor'}/${
              result.data.data.metadata.uid
            }/overview`
          )
        }

        return history.push(
          `/projects/${project}/jobs/${cronString ? 'schedule' : 'monitor'}`
        )
      })
      .then(() => {
        onSuccessRun && onSuccessRun(cronString ? 'schedule' : 'monitor')
      })
  }

  const handleEditJob = (event, cronString) => {
    const postData = generateRequestData(
      jobsStore,
      cronString,
      panelState,
      project,
      defaultData.task.metadata.labels,
      match,
      selectedFunction,
      false,
      defaultData.task.spec.function
    )

    if (jobsStore.error) {
      removeJobError()
    }

    onEditJob(event, postData)
  }

  const isTitleValid = () => {
    return (
      panelState.currentFunctionInfo.name.trim() !== '' &&
      /^(?=[\S\s]{1,63}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/.test(
        panelState.currentFunctionInfo.name
      )
    )
  }

  return (
    <JobsPanelView
      closePanel={closePanel}
      defaultData={defaultData}
      functionData={functionData}
      handleEditJob={handleEditJob}
      handleRunJob={handleRunJob}
      isTitleValid={isTitleValid}
      jobsStore={jobsStore}
      loading={jobsStore.loading || functionsStore.loading}
      match={match}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      panelState={panelState}
      removeJobError={removeJobError}
      setNewJobEnvironmentVariables={setNewJobEnvironmentVariables}
      setNewJobInputs={setNewJobInputs}
      setNewJobSecretSources={setNewJobSecretSources}
      setOpenScheduleJob={setOpenScheduleJob}
      withSaveChanges={withSaveChanges}
    />
  )
}

JobsPanel.defaultProps = {
  defaultData: null,
  groupedFunctions: {},
  onEditJob: () => {},
  redirectToDetailsPane: false,
  withSaveChanges: false
}

JobsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  groupedFunctions: PropTypes.shape({}),
  match: PropTypes.shape({}).isRequired,
  onEditJob: PropTypes.func,
  project: PropTypes.string.isRequired,
  redirectToDetailsPane: PropTypes.bool,
  runNewJob: PropTypes.func.isRequired,
  withSaveChanges: PropTypes.bool
}

export default connect(
  ({ jobsStore, functionsStore }) => ({
    jobsStore,
    functionsStore
  }),
  { ...jobsActions, ...functionActions, ...notificationActions }
)(JobsPanel)

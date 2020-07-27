import React, {
  useState,
  useLayoutEffect,
  useMemo,
  useReducer,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { connect, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { isEmpty } from 'lodash'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'
import functionActions from '../../actions/functions'
import {
  getMethodOptions,
  getVersionOptions,
  getDefaultMethodAndVersion,
  generateTableData
} from './jobsPanel.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { initialState, panelReducer, panelActions } from './panelReducer'
import { parseKeyValues } from '../../utils'

import './jobsPanel.scss'

const JobsPanel = ({
  closePanel,
  fetchFunctionTemplate,
  functionsStore,
  groupedFunctions,
  jobsStore,
  match,
  removeFunctionTemplate,
  removeJobError,
  removeNewJob,
  runNewJob,
  runNewJobFailure,
  setNewJob,
  setNewJobEnvironmentVariables,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobSecretSources,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setTuningStrategy,
  setUrl
}) => {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialState)
  const [openScheduleJob, setOpenScheduleJob] = useState(false)
  const [selectedFunction] = useState(
    !isEmpty(functionsStore.template)
      ? functionsStore.template.functions
      : groupedFunctions.functions
  )
  const history = useHistory()
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    if (!groupedFunctions.name && !functionsStore.template.name) {
      fetchFunctionTemplate(groupedFunctions.metadata.versions.latest)
    }
    return () => functionsStore.template.name && removeFunctionTemplate()
  }, [
    fetchFunctionTemplate,
    functionsStore.template,
    groupedFunctions,
    removeFunctionTemplate
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
    if (!panelState.editMode && isEveryObjectValueEmpty(panelState.tableData)) {
      generateTableData(
        panelState.currentFunctionInfo.method,
        selectedFunction,
        panelDispatch,
        setNewJob
      )
    }
  }, [
    panelState.currentFunctionInfo.method,
    panelState.editMode,
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
          version: defaultVersion
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
    }

    return {
      methodOptions: [],
      versionOptions: []
    }
  }, [functionsStore.template.name, groupedFunctions.name, selectedFunction])

  const handleRunJob = (event, cronString) => {
    const selectedFunction = functionsStore.template.name
      ? functionsStore.template.functions[0]
      : groupedFunctions.functions.find(
          func => func.metadata.tag === panelState.currentFunctionInfo.version
        )

    const labels = {}

    panelState.currentFunctionInfo.labels.forEach(
      label => (labels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    const postData = {
      ...jobsStore.newJob,
      schedule: cronString || jobsStore.newJob.schedule,
      function: {
        ...jobsStore.newJob.function,
        spec: {
          ...jobsStore.newJob.function.spec,
          resources: {
            limits: panelState.limits,
            requests: panelState.requests
          }
        }
      },
      task: {
        ...jobsStore.newJob.task,
        metadata: {
          name: panelState.currentFunctionInfo.name,
          labels
        },
        spec: {
          ...jobsStore.newJob.task.spec,
          output_path: panelState.outputPath,
          input_path: panelState.inputPath,
          function: `${match.params.projectName}/${selectedFunction.metadata.name}@${selectedFunction.metadata.hash}`,
          handler: panelState.currentFunctionInfo.method
        }
      }
    }

    if (jobsStore.error) {
      removeJobError()
    }

    runNewJob(postData)
      .then(() => {
        removeNewJob()

        history.push(`/projects/${match.params.projectName}/jobs`)
      })
      .catch(error => {
        dispatch(runNewJobFailure(error.message))
      })
  }

  return (
    <JobsPanelView
      closePanel={closePanel}
      functionData={functionData}
      handleRunJob={handleRunJob}
      jobsStore={jobsStore}
      match={match}
      openScheduleJob={openScheduleJob}
      panelDispatch={panelDispatch}
      panelState={panelState}
      removeJobError={removeJobError}
      setNewJobEnvironmentVariables={setNewJobEnvironmentVariables}
      setNewJobHyperParameters={setNewJobHyperParameters}
      setNewJobInputs={setNewJobInputs}
      setNewJobParameters={setNewJobParameters}
      setNewJobSecretSources={setNewJobSecretSources}
      setNewJobVolumeMounts={setNewJobVolumeMounts}
      setNewJobVolumes={setNewJobVolumes}
      setOpenScheduleJob={setOpenScheduleJob}
      setTuningStrategy={setTuningStrategy}
      setUrl={setUrl}
    />
  )
}

JobsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  groupedFunctions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  runNewJob: PropTypes.func.isRequired
}

export default connect(
  ({ jobsStore, functionsStore }) => ({ jobsStore, functionsStore }),
  { ...jobsActions, ...functionActions }
)(JobsPanel)

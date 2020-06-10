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

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'
import functionActions from '../../actions/functions'
import {
  // getDefaultData,
  getMethodOptions,
  // getParameters,
  getVersionOptions,
  getDefaultMethodAndVersion,
  // getVolumeMounts,
  // getVolume
  generateTableData
} from './jobsPanel.util'
import { initialState, panelReducer, panelActions } from './panelReducer'

import { isEmpty } from 'lodash'

import './jobsPanel.scss'

const JobsPanel = ({
  closePanel,
  fetchFunctionTemplate,
  functionsStore,
  groupedFunctions,
  jobsStore,
  match,
  removeFunctionTemplate,
  runNewJob,
  removeNewJob,
  setNewJob,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setDefaultData
}) => {
  const [panelState, panelDispatch] = useReducer(panelReducer, initialState)
  const [openScheduleJob, setOpenScheduleJob] = useState(false)
  const [selectedFunction] = useState(
    !isEmpty(functionsStore.template)
      ? functionsStore.template.functions
      : groupedFunctions.functions
  )
  const history = useHistory()

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
    //   const functionParameters = getParameters(
    //     selectedFunction,
    //     panelState.currentFunctionInfo.method
    //   )
    //
    //   if (!isEmpty(functionParameters)) {
    //     const { parameters, dataInputs } = getDefaultData(functionParameters)
    //     const volumeMounts = getVolumeMounts(selectedFunction)
    //     const volumes = getVolume(selectedFunction)
    //
    //     panelDispatch({
    //       type: panelActions.SET_TABLE_DATA,
    //       payload: {
    //         dataInputs,
    //         parameters,
    //         volumeMounts,
    //         volumes
    //       }
    //     })
    //     setNewJob({
    //       dataInputs,
    //       parameters,
    //       volumeMounts,
    //       volumes
    //     })
    //   }
    // }, [
    //   panelState.currentFunctionInfo.method,
    //   selectedFunction,
    //   setDefaultData,
    //   setNewJob
    // ])
    const emptyDefaultData = Object.values(panelState.tableData).filter(
      value => !isEmpty(value)
    )
    if (!panelState.editMode && !emptyDefaultData.length) {
      console.log('when not edit mode and empty table data')
      generateTableData(
        panelState.currentFunctionInfo.method,
        selectedFunction,
        panelDispatch,
        setNewJob
      )
    } else if (panelState.editMode) {
      if (
        panelState.previousPanelData.titleInfo.method !==
        panelState.currentFunctionInfo.method
      ) {
        console.log('when edit mode and method not equal')
        generateTableData(
          panelState.currentFunctionInfo.method,
          selectedFunction,
          panelDispatch,
          setNewJob
        )
      } else {
        console.log('when edit mode and method are equal')
        panelDispatch({
          type: panelActions.SET_TABLE_DATA,
          payload: {
            ...panelState.previousPanelData.tableData
          }
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
    const emptyTableData = Object.values(
      panelState.previousPanelData.tableData
    ).filter(value => !isEmpty(value))
    const emptyDefaultData = Object.values(panelState.tableData).filter(
      value => !isEmpty(value)
    )

    if (!emptyTableData.length && emptyDefaultData.length) {
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_TABLE_DATA,
        payload: {
          inputs: panelState.tableData.dataInputs,
          parameters: panelState.tableData.parameters,
          volumes: panelState.tableData.volumes,
          volumeMounts: panelState.tableData.volumeMounts || []
        }
      })
    }
  }, [panelState.previousPanelData.tableData, panelState.tableData])

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
          name: functionsStore.template.name || groupedFunctions.name,
          version: defaultVersion,
          method: defaultMethod || (methodOptions[0]?.id ?? '')
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

  const handleRunJob = () => {
    const selectedFunction = functionsStore.template.name
      ? functionsStore.template.functions[0]
      : groupedFunctions.functions.find(
          func => func.metadata.tag === panelState.currentFunctionInfo.version
        )

    const postData = {
      schedule: jobsStore.newJob.schedule,
      ...jobsStore.newJob,
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
        spec: {
          ...jobsStore.newJob.task.spec,
          output_path: panelState.outputPath,
          input_path: panelState.inputPath,
          function: `${match.params.projectName}/${selectedFunction.metadata.name}:${selectedFunction.metadata.hash}`
        }
      }
    }

    runNewJob(postData).then(() => {
      removeNewJob()

      history.push(`/projects/${match.params.projectName}/jobs`)
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
      panelState={panelState}
      panelDispatch={panelDispatch}
      setNewJobHyperParameters={setNewJobHyperParameters}
      setNewJobInputs={setNewJobInputs}
      setNewJobParameters={setNewJobParameters}
      setNewJobVolumeMounts={setNewJobVolumeMounts}
      setNewJobVolumes={setNewJobVolumes}
      setOpenScheduleJob={setOpenScheduleJob}
      tableData={panelState.tableData}
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

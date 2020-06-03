import React, { useState, useLayoutEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'
import functionActions from '../../actions/functions'
import { parseDefaultContent } from '../../utils/parseDefaultContent'
import {
  getDefaultData,
  getMethodOptions,
  getParameters,
  getVersionOptions,
  getDefaultMethodAndVersion,
  getVolumeMounts,
  getVolume
} from './jobsPanel.util'

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
  setNewJob,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobVolumeMounts,
  setNewJobVolumes,
  setDefaultData
}) => {
  const [openScheduleJob, setOpenScheduleJob] = useState(false)
  const [inputPath, setInputPath] = useState('')
  const [outputPath, setOutputPath] = useState('')
  const [requests, setRequests] = useState({
    cpu: '',
    memory: ''
  })
  const [memoryUnit, setMemoryUnit] = useState('')

  const [limits, setLimits] = useState({
    cpu: '',
    memory: '',
    nvidia_gpu: ''
  })
  const [cpuUnit, setCpuUnit] = useState('')
  const [currentFunctionInfo, setCurrentFunctionInfo] = useState({
    name: '',
    version: '',
    method: ''
  })
  const history = useHistory()

  useLayoutEffect(() => {
    if (!groupedFunctions.name && !functionsStore.template.name) {
      fetchFunctionTemplate(groupedFunctions.metadata.versions.latest)
    }
    return () => functionsStore.template.name && removeFunctionTemplate()
  }, [
    fetchFunctionTemplate,
    functionsStore,
    groupedFunctions,
    removeFunctionTemplate
  ])

  const functionsData = useMemo(() => {
    const selectedFunction = !isEmpty(functionsStore.template)
      ? functionsStore.template.functions
      : groupedFunctions.functions

    if (!isEmpty(selectedFunction)) {
      let versionOptions = getVersionOptions(selectedFunction)
      let methodOptions = getMethodOptions(selectedFunction)
      let { defaultMethod, defaultVersion } = getDefaultMethodAndVersion(
        versionOptions,
        selectedFunction
      )

      setCurrentFunctionInfo({
        name: functionsStore.template.name
          ? functionsStore.template.name
          : groupedFunctions.name,
        version: defaultVersion,
        method: defaultMethod || (methodOptions[0]?.id ?? '')
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
  }, [functionsStore, groupedFunctions])

  const functionDefaultValues = useMemo(() => {
    const selectedFunction = !isEmpty(functionsStore.template)
      ? functionsStore.template.functions
      : groupedFunctions.functions

    const functionParameters = getParameters(
      selectedFunction,
      currentFunctionInfo.method
    )

    if (!isEmpty(functionParameters)) {
      const { parameters, dataInputs } = getDefaultData(functionParameters)
      const volumeMounts = getVolumeMounts(selectedFunction)
      const volumes = getVolume(selectedFunction)

      setDefaultData({
        parameters: parseDefaultContent(parameters),
        inputs: parseDefaultContent(dataInputs),
        volumes,
        volumeMounts: volumeMounts.length
          ? volumeMounts.map(volumeMounts => volumeMounts.data)
          : []
      })

      return {
        parameters,
        dataInputs,
        volumeMounts,
        volumes
      }
    }

    return {
      parameters: [],
      dataInputs: [],
      volumeMounts: [],
      volumes: []
    }
  }, [currentFunctionInfo, functionsStore, groupedFunctions, setDefaultData])

  const handleRunJob = () => {
    const selectedFunction = functionsStore.template.name
      ? functionsStore.template.functions[0]
      : groupedFunctions.functions.find(
          func => func.metadata.tag === currentFunctionInfo.version
        )

    const postData = {
      schedule: jobsStore.newJob.schedule,
      ...jobsStore.newJob,
      function: {
        ...jobsStore.newJob.function,
        spec: {
          ...jobsStore.newJob.function.spec,
          resources: {
            limits: limits,
            requests: requests
          }
        }
      },
      task: {
        ...jobsStore.newJob.task,
        spec: {
          ...jobsStore.newJob.task.spec,
          output_path: outputPath,
          input_path: inputPath,
          function: `${match.params.projectName}/${selectedFunction.metadata.name}:${selectedFunction.metadata.hash}`
        }
      }
    }

    runNewJob(postData).then(() => {
      setNewJob({
        task: {
          spec: {
            parameters: {},
            inputs: {},
            hyperparams: {}
          }
        },
        function: {
          spec: {
            volumes: [],
            volumeMounts: []
          }
        }
      })

      history.push(`/projects/${match.params.projectName}/jobs`)
    })
  }

  return (
    <JobsPanelView
      closePanel={closePanel}
      cpuUnit={cpuUnit}
      currentFunctionInfo={currentFunctionInfo}
      functionDefaultValues={functionDefaultValues}
      functionsData={functionsData}
      handleRunJob={handleRunJob}
      jobsStore={jobsStore}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      openScheduleJob={openScheduleJob}
      requests={requests}
      setCpuUnit={setCpuUnit}
      setCurrentFunctionInfo={setCurrentFunctionInfo}
      setInputPath={setInputPath}
      setLimits={setLimits}
      setMemoryUnit={setMemoryUnit}
      setNewJobHyperParameters={setNewJobHyperParameters}
      setNewJobInputs={setNewJobInputs}
      setNewJobParameters={setNewJobParameters}
      setNewJobVolumeMounts={setNewJobVolumeMounts}
      setNewJobVolumes={setNewJobVolumes}
      setOpenScheduleJob={setOpenScheduleJob}
      setOutputPath={setOutputPath}
      setRequests={setRequests}
    />
  )
}

JobsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  groupedFunctions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  runNewJob: PropTypes.func.isRequired,
  setNewJob: PropTypes.func.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired
}

export default connect(
  ({ jobsStore, functionsStore }) => ({ jobsStore, functionsStore }),
  { ...jobsActions, ...functionActions }
)(JobsPanel)

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'

import './jobsPanel.scss'

const JobsPanel = ({
  close,
  func,
  jobsStore,
  match,
  setNewJob,
  setNewJobInputs,
  setNewJobHyperParameters,
  setNewJobInputPath,
  setNewJobOutputPath,
  setNewJobParameters,
  setNewJobResourcesLimits,
  setNewJobResourcesRequests,
  setNewJobVolumes,
  setNewJobVolumeMounts
}) => {
  const [edit, setEdit] = useState(false)

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

  const handlerEdit = () => {
    setEdit(!edit)
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
  }

  const handleRunJob = () => {
    setNewJobInputPath(inputPath)
    setNewJobOutputPath(outputPath)
    setNewJobResourcesRequests(requests)
    setNewJobResourcesLimits(limits)
  }

  return (
    <JobsPanelView
      close={close}
      cpuUnit={cpuUnit}
      edit={edit}
      func={func}
      handlerEdit={handlerEdit}
      handleRunJob={handleRunJob}
      jobsStore={jobsStore}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      requests={requests}
      setCpuUnit={setCpuUnit}
      setInputPath={setInputPath}
      setLimits={setLimits}
      setMemoryUnit={setMemoryUnit}
      setNewJobHyperParameters={setNewJobHyperParameters}
      setNewJobInputs={setNewJobInputs}
      setNewJobParameters={setNewJobParameters}
      setNewJobVolumes={setNewJobVolumes}
      setNewJobVolumeMounts={setNewJobVolumeMounts}
      setOutputPath={setOutputPath}
      setRequests={setRequests}
    />
  )
}

JobsPanel.propTypes = {
  close: PropTypes.func.isRequired,
  func: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(JobsPanel)

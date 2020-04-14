import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import jobsActions from '../../actions/jobs'

import './jobsPanel.scss'
import JobsPanelView from './JobsPanelView'

const JobsPanel = ({
  close,
  func,
  jobsStore,
  match,
  setNewJob,
  setNewJobHyperParameters,
  setNewJobInputPath,
  setNewJobInputs,
  setNewJobOutputPath,
  setNewJobParameters,
  setNewJobResourcesLimits,
  setNewJobResourcesRequests,
  setNewJobVolumeMounts,
  setNewJobVolumes
}) => {
  const [edit, setEdit] = useState(false)
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
      handleRunJob={handleRunJob}
      handlerEdit={handlerEdit}
      jobsStore={jobsStore}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      openScheduleJob={openScheduleJob}
      requests={requests}
      setCpuUnit={setCpuUnit}
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
  close: PropTypes.func.isRequired,
  func: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(JobsPanel)

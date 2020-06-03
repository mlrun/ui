import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  functionsData,
  closePanel,
  match,
  openScheduleJob,
  setCurrentFunctionInfo,
  currentFunctionInfo,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [currentFunction, setCurrentFunction] = useState(currentFunctionInfo)

  const handleEditJobTitle = () => {
    setCurrentFunctionInfo({
      name: currentFunction.name,
      version: currentFunction.version,
      method: currentFunction.method
    })
    setIsEdit(false)
  }

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunction={currentFunction}
      handleEditJobTitle={handleEditJobTitle}
      isEdit={isEdit}
      match={match}
      methodOptions={functionsData.methodOptions}
      openScheduleJob={openScheduleJob}
      setCurrentFunction={setCurrentFunction}
      setIsEdit={setIsEdit}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={functionsData.versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  functionsData: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle

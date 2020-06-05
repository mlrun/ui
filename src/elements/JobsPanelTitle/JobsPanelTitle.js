import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  functionData,
  closePanel,
  match,
  openScheduleJob,
  setCurrentFunctionInfo,
  currentFunctionInfo,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  // const [currentFunction, setCurrentFunction] = useState(currentFunctionInfo)

  // const handleEditJobTitle = () => {
  //   setCurrentFunctionInfo({
  //     name: currentFunction.name,
  //     version: currentFunction.version,
  //     method: currentFunction.method
  //   })
  //   setIsEdit(false)
  // }

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunctionInfo={currentFunctionInfo}
      // currentFunction={currentFunction}
      isEdit={isEdit}
      match={match}
      methodOptions={functionData.methodOptions}
      openScheduleJob={openScheduleJob}
      setCurrentFunctionInfo={setCurrentFunctionInfo}
      setIsEdit={setIsEdit}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={functionData.versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  functionData: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle

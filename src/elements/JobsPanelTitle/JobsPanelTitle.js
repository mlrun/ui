import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import _, { isEmpty } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  groupedFunctions,
  match,
  openScheduleJob,
  setCurrentFunctionInfo,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [currentFunction, setCurrentFunction] = useState({
    method: '',
    name: groupedFunctions.name || groupedFunctions.metadata.name,
    version: 'latest'
  })

  const handleEditJobTitle = () => {
    setCurrentFunctionInfo({
      method: currentFunction.method,
      name: currentFunction.name,
      version: currentFunction.version
    })
    setIsEdit(false)
  }

  const { methodOptions, versionOptions } = useMemo(() => {
    if (isEmpty(groupedFunctions.functions)) {
      return {
        versionOptions: [],
        methodOptions: []
      }
    }

    let versionOptions = groupedFunctions.functions
      .map(func => {
        return {
          label:
            (func.metadata.tag === 'latest' ? '$' : '') + func.metadata.tag,
          id: func.metadata.tag
        }
      })
      .filter(item => item.label !== '')

    versionOptions =
      versionOptions.length === 0
        ? [{ label: '$latest', id: 'latest' }]
        : versionOptions

    let methodOptions = _.chain(groupedFunctions.functions)
      .map(func => Object.values(func.spec.entry_points))
      .flatten()
      .map(entry_point => ({
        label: entry_point.name,
        id: entry_point.name,
        subLabel: entry_point.doc
      }))
      .uniqBy('label')
      .value()

    if (methodOptions.length === 1) {
      setCurrentFunction(prevState => ({
        ...prevState,
        method: methodOptions[0].id
      }))
    } else {
      const defaultMethod = groupedFunctions.functions.find(
        item => item.metadata.tag === 'latest'
      )?.spec.default_handler

      defaultMethod &&
        setCurrentFunction(prevState => ({
          ...prevState,
          method: defaultMethod
        }))
    }

    return {
      methodOptions,
      versionOptions
    }
  }, [groupedFunctions.functions])

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunction={currentFunction}
      groupedFunctions={groupedFunctions}
      handleEditJobTitle={handleEditJobTitle}
      isEdit={isEdit}
      match={match}
      methodOptions={methodOptions}
      openScheduleJob={openScheduleJob}
      setCurrentFunction={setCurrentFunction}
      setIsEdit={setIsEdit}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  groupedFunctions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle

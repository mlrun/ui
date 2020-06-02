import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import _, { isEmpty } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  functionsData,
  match,
  openScheduleJob,
  setCurrentFunctionInfo,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [currentFunction, setCurrentFunction] = useState({
    method: '',
    name: functionsData.name || functionsData.metadata.name,
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
    if (isEmpty(functionsData.functions)) {
      return {
        versionOptions: [],
        methodOptions: []
      }
    }

    let versionOptions = functionsData.functions
      .map(func => {
        return {
          label:
            (func.metadata.tag === 'latest' ? '$' : '') +
            (func.metadata.tag || '$latest'),
          id: func.metadata.tag || 'latest'
        }
      })
      .filter((version, _, array) => {
        return array.indexOf(version.label) !== -1
      })

    versionOptions =
      versionOptions.length === 0
        ? [{ label: '$latest', id: 'latest' }]
        : versionOptions

    let methodOptions = _.chain(functionsData.functions)
      .map(func =>
        func.spec.entry_points ? Object.values(func.spec.entry_points) : []
      )
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
      const defaultMethod = functionsData.functions.find(
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
  }, [functionsData.functions])

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunction={currentFunction}
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
  functionsData: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle

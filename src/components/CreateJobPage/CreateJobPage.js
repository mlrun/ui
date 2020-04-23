import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CreateJobPageView from './CreateJobPageView'
import Loader from '../../common/Loader/Loader'
import JobsPanel from '../JobsPanel/JobsPanel'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'

const CreateJobPage = ({
  fetchFunctions,
  functionsStore,
  match,
  setNewJob
}) => {
  const [expandList, setExpandList] = useState(true)
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setFunction] = useState({})

  useEffect(() => {
    fetchFunctions(match.params.projectName).then(functions => {
      return setFunctions(functions)
    })
  }, [fetchFunctions, match.params.projectName])

  const handleSelectFunction = item => {
    setFunction(item)
    if (!item) {
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
  }

  return functionsStore.loading ? (
    <Loader />
  ) : (
    <>
      <CreateJobPageView
        match={match}
        expandList={expandList}
        setExpandList={setExpandList}
        functions={functions}
        handleSelectFunction={handleSelectFunction}
      />
      {Object.values(selectedFunction)?.length !== 0 && (
        <JobsPanel
          func={selectedFunction}
          close={handleSelectFunction}
          match={match}
        />
      )}
    </>
  )
}

CreateJobPage.propTypes = {
  fetchFunctions: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(functionsStore => functionsStore, {
  ...functionsActions,
  ...jobsActions
})(CreateJobPage)

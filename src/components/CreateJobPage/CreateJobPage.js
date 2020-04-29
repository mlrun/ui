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
  fetchFunctionsTemplates,
  functionsStore,
  match,
  setNewJob
}) => {
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setFunction] = useState({})
  const [templatesArray, setTemplatesArray] = useState([])

  useEffect(() => {
    fetchFunctions(match.params.projectName).then(functions => {
      return setFunctions(functions)
    })

    fetchFunctionsTemplates().then(data => setTemplatesArray(data))
  }, [fetchFunctions, fetchFunctionsTemplates, match.params.projectName])

  const handleSelectFunction = item => {
    setFunction(item)

    if (Object.keys(item).length === 0) {
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
        functions={functions}
        handleSelectFunction={handleSelectFunction}
        match={match}
        templates={templatesArray}
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
  match: PropTypes.shape({}).isRequired
}

export default connect(functionsStore => functionsStore, {
  ...functionsActions,
  ...jobsActions
})(CreateJobPage)

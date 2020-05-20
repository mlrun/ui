import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { includes } from 'lodash'

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
  const [selectedGroupFunctions, setSelectedGroupFunctions] = useState({})
  const [templatesArray, setTemplatesArray] = useState(functionsStore.templates)

  useEffect(() => {
    fetchFunctions(match.params.projectName).then(functions => {
      const filteredFunctions = functions.filter(
        func => !includes(['', 'handler', 'local'], func.kind)
      )

      const groupedFunctions = Object.values(
        filteredFunctions.reduce((prev, curr) => {
          if (!prev[curr.metadata.name]) {
            prev[curr.metadata.name] = {
              name: curr.metadata.name,
              functions: []
            }
          }

          prev[curr.metadata.name].functions.push(curr)

          return prev
        }, {})
      )

      return setFunctions(groupedFunctions)
    })

    if (functionsStore.templates.length === 0) {
      fetchFunctionsTemplates().then(setTemplatesArray)
    }
  }, [
    fetchFunctions,
    fetchFunctionsTemplates,
    functionsStore.templates.length,
    match.params.projectName
  ])

  const handleSelectGroupFunctions = item => {
    setSelectedGroupFunctions(item)

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
        handleSelectGroupFunctions={handleSelectGroupFunctions}
        match={match}
        templates={templatesArray}
      />
      {Object.values(selectedGroupFunctions).length !== 0 && (
        <JobsPanel
          groupedFunctions={selectedGroupFunctions}
          closePanel={handleSelectGroupFunctions}
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

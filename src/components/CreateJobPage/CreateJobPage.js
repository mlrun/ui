import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CreateJobPageView from './CreateJobPageView'
import Loader from '../../common/Loader/Loader'

import functionsActions from '../../actions/functions'

const CreateJobPage = ({ functionsStore, fetchFunctions, match }) => {
  const [expandList, setExpandList] = useState(true)
  const [functions, setFunctions] = useState([])

  useEffect(() => {
    fetchFunctions(match.params.projectName).then(functions => {
      // const newFunctions = functions.map(func => ({
      //   name: func.metadata.name,
      //   type: func.kind,
      //   hash: func.metadata.hash,
      //   updated: new Date(func.metadata.updated),
      //   command: func.spec.command,
      //   image: func.spec.image,
      //   description: func.spec.description,
      //   state: func.status ? func.status.state : '',
      //   functionSourceCode: func.spec.functionSourceCode
      // }))
      return setFunctions(functions)
    })
  }, [fetchFunctions, match.params.projectName])

  console.log(functions)

  return functionsStore.loading ? (
    <Loader />
  ) : (
    <CreateJobPageView
      match={match}
      expandList={expandList}
      setExpandList={setExpandList}
      functions={functions}
    />
  )
}

CreateJobPage.propTypes = {
  fetchFunctions: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  functionsStore => functionsStore,
  functionsActions
)(CreateJobPage)

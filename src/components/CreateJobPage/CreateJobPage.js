import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'

import CreateJobPageView from './CreateJobPageView'
import Loader from '../../common/Loader/Loader'
import JobsPanel from '../JobsPanel/JobsPanel'

import functionsActions from '../../actions/functions'

const CreateJobPage = ({
  functionsStore,
  fetchFunctions,
  selectedFunction,
  match
}) => {
  const [expandList, setExpandList] = useState(true)
  const [functions, setFunctions] = useState([])

  const func = useSelector(state => state.functionsStore.function)

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

  const selectedFunc = item => {
    selectedFunction(item)
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
        selectedFunc={selectedFunc}
      />
      {Object.values(func)?.length !== 0 && <JobsPanel func={func} />}
    </>
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

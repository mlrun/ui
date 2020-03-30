import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

import functionsData from './functionsData'
import functionsActions from '../../actions/functions'

const Functions = ({ fetchFunctions, functionsStore, match, history }) => {
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setSelectedFunction] = useState({})

  const refreshFunctions = useCallback(() => {
    fetchFunctions(match.params.projectName).then(functions => {
      const newFunctions = functions.map(func => ({
        name: func.metadata.name,
        type: func.kind,
        hash: func.metadata.hash,
        updated: new Date(func.metadata.updated),
        command: func.spec.command,
        image: func.spec.image,
        description: func.spec.description,
        state: func.status ? func.status.state : '',
        functionSourceCode: func.spec.build.functionSourceCode
      }))
      return setFunctions(newFunctions)
    })
  }, [fetchFunctions, match.params.projectName])

  useEffect(() => {
    refreshFunctions()

    return () => {
      setSelectedFunction({})
      setFunctions([])
    }
  }, [history, match.params.projectName, refreshFunctions])

  useEffect(() => {
    if (match.params.hash) {
      let item = functions.find(item => item.hash === match.params.hash)

      setSelectedFunction(item)
    } else {
      setSelectedFunction({})
    }
  }, [functions, match.params.hash, setSelectedFunction])

  const handleSelectFunction = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedFunction(item)
  }

  const handleCancel = () => {
    setSelectedFunction({})
  }

  return (
    <>
      {functionsStore.loading && <Loader />}
      <Content
        content={functions}
        detailsMenu={functionsData.detailsMenu}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        loading={functionsStore.loading}
        match={match}
        page={functionsData.page}
        refresh={refreshFunctions}
        selectedItem={selectedFunction}
        tableHeaders={functionsData.tableHeaders}
        yamlContent={functionsStore.functions}
      />
    </>
  )
}

Functions.propTypes = {
  fetchFunctions: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  functionsStore => functionsStore,
  functionsActions
)(React.memo(Functions))

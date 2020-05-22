import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

import functionsData from './functionsData'
import functionsActions from '../../actions/functions'

const Functions = ({
  fetchFunctions,
  functionsStore,
  history,
  match,
  setLoading
}) => {
  const [functions, setFunctions] = useState([])
  const [groupFilter, setGroupFilter] = useState(
    functionsData.initialGroupFilter
  )
  const [selectedFunction, setSelectedFunction] = useState({})
  const [showUntagged, setShowUntagged] = useState('')
  const [taggedFunctions, setTaggedFunctions] = useState([])
  const pageData = {
    detailsMenu: functionsData.detailsMenu,
    filters: functionsData.filters,
    page: functionsData.page,
    tableHeaders: functionsData.tableHeaders
  }

  const refreshFunctions = useCallback(() => {
    fetchFunctions(match.params.projectName).then(functions => {
      const newFunctions = functions.map(func => ({
        name: func.metadata.name,
        type: func.kind,
        tag: func.metadata.tag,
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
    setTaggedFunctions(
      !showUntagged ? functions.filter(func => func.tag.length) : functions
    )
  }, [showUntagged, functions])

  useEffect(() => {
    let item = {}

    if (match.params.hash && functions.length > 0) {
      if (selectedFunction.updated) {
        item = functions.find(
          func =>
            isEqual(func.updated, selectedFunction.updated) &&
            isEqual(func.hash, selectedFunction.hash)
        )
      } else {
        item = functions.find(func => isEqual(func.hash, match.params.hash))
      }

      if (Object.keys(item).length === 0) {
        return history.push(`/projects/${match.params.projectName}/functions`)
      }
    }

    setSelectedFunction(item)
  }, [
    functions,
    match.params.hash,
    setSelectedFunction,
    history,
    match.params.projectName,
    selectedFunction.updated,
    selectedFunction.hash
  ])

  const handleSelectFunction = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedFunction(item)
  }

  const handleCancel = () => {
    setSelectedFunction({})
  }

  const toggleShowUntagged = showUntagged => {
    const pathLangsOnFuncScreen = 4
    if (history.location.pathname.split('/').length > pathLangsOnFuncScreen) {
      history.push(`/projects/${match.params.projectName}/functions`)
    }

    setShowUntagged(showUntagged)
  }

  return (
    <>
      {functionsStore.loading && <Loader />}
      <Content
        content={taggedFunctions}
        groupFilter={groupFilter}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        loading={functionsStore.loading}
        match={match}
        pageData={pageData}
        refresh={refreshFunctions}
        selectedItem={selectedFunction}
        setGroupFilter={setGroupFilter}
        setLoading={setLoading}
        showUntagged={showUntagged}
        toggleShowUntagged={toggleShowUntagged}
        yamlContent={functionsStore.functions}
      />
    </>
  )
}

Functions.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  functionsStore => functionsStore,
  functionsActions
)(React.memo(Functions))

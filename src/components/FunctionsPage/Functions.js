import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual, isEmpty } from 'lodash'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

import {
  detailsMenu,
  filters,
  infoHeaders,
  initialGroupFilter,
  page,
  tableHeaders
} from './functions.util'
import functionsActions from '../../actions/functions'
import notificationActions from '../../actions/notificationDownload'

import { ReactComponent as Delete } from '../../images/delete.svg'

const Functions = ({
  deleteFunction,
  fetchFunctions,
  functionsStore,
  history,
  match,
  setLoading,
  setNotification
}) => {
  const [functions, setFunctions] = useState([])
  const [selectedFunction, setSelectedFunction] = useState({})
  const [showUntagged, setShowUntagged] = useState('')
  const [taggedFunctions, setTaggedFunctions] = useState([])
  const pageData = {
    actionsMenu: [
      {
        label: 'Delete',
        icon: <Delete />,
        onClick: func => removeFunction(func)
      }
    ],
    detailsMenu,
    filters,
    page,
    tableHeaders,
    infoHeaders
  }

  const refreshFunctions = useCallback(
    items => {
      fetchFunctions(match.params.projectName, items?.name).then(functions => {
        const newFunctions = functions.map(func => ({
          name: func.metadata.name,
          type: func.kind,
          tag: func.metadata.tag,
          hash: func.metadata.hash,
          codeOrigin: func.spec?.build?.code_origin ?? '',
          updated: new Date(func.metadata.updated),
          command: func.spec.command,
          image: func.spec.image,
          description: func.spec.description,
          state: func.status?.state ?? '',
          functionSourceCode: func.spec?.build?.functionSourceCode ?? ''
        }))

        return setFunctions(newFunctions)
      })
    },
    [fetchFunctions, match.params.projectName]
  )

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
      const funcTagIndex = match.params.hash.indexOf(':')

      if (selectedFunction.updated) {
        item = functions.find(func => {
          if (funcTagIndex > 0) {
            return (
              isEqual(func.updated, selectedFunction.updated) &&
              isEqual(func.tag, selectedFunction.tag)
            )
          } else {
            return (
              isEqual(func.updated, selectedFunction.updated) &&
              isEqual(func.hash, selectedFunction.hash)
            )
          }
        })
      } else {
        item = functions.find(func => {
          if (funcTagIndex > 0) {
            return isEqual(func.tag, match.params.hash.slice(funcTagIndex + 1))
          } else {
            return isEqual(
              func.hash,
              match.params.hash.slice(match.params.hash.indexOf('@') + 1)
            )
          }
        })
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
    selectedFunction.hash,
    selectedFunction.tag
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

  const removeFunction = func => {
    deleteFunction(func.name, match.params.projectName)
      .then(() => {
        if (!isEmpty(selectedFunction)) {
          setSelectedFunction({})
          history.push(`/projects/${match.params.projectName}/functions`)
        }

        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function deleted successfully'
        })
        refreshFunctions()
      })
      .catch(() => {
        setNotification({
          status: 400,
          id: Math.random(),
          retry: () => removeFunction(func),
          message: 'Function failed to delete'
        })
      })
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
        groupFilter={initialGroupFilter}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectFunction}
        loading={functionsStore.loading}
        match={match}
        pageData={pageData}
        refresh={refreshFunctions}
        selectedItem={selectedFunction}
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

export default connect(functionsStore => functionsStore, {
  ...functionsActions,
  ...notificationActions
})(React.memo(Functions))

import React, { useEffect, useMemo, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import artifactActions from '../../actions/artifacts'
import {
  ARTIFACTS_PAGE,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODELS_PAGE,
  MODELS_TAB
} from '../../constants'
import {
  generateArtifactsContent,
  generateFunctionsContent,
  generateJobsContent,
  renderContent
} from './details.util'
import detailsActions from '../../actions/details'

import DetailsView from './DetailsView'

import './details.scss'

const Details = ({
  actionsMenu,
  applyDetailsChanges,
  cancelRequest,
  detailsMenu,
  detailsStore,
  filtersStore,
  handleCancel,
  match,
  pageData,
  removeInfoContent,
  removeModelFeatureVector,
  resetChanges,
  retryRequest,
  selectedItem,
  setChanges,
  setChangesCounter,
  setChangesData,
  setInfoContent,
  setIteration,
  setIterationOption,
  setRefreshWasHandled,
  showWarning
}) => {
  const history = useHistory()
  const dispatch = useDispatch()
  let unblockRootChange = useRef()
  let pathname = useRef()
  const detailsRef = useRef()

  const handlePreview = useCallback(() => {
    dispatch(
      artifactActions.showArtifactsPreview({
        isPreview: true,
        selectedItem
      })
    )
    handleCancel()
  }, [dispatch, handleCancel, selectedItem])

  const handleEditInput = useCallback(
    (value, field) => {
      setChangesData({
        ...detailsStore.changes.data,
        [field]: value
      })
    },
    [detailsStore.changes.data, setChangesData]
  )

  const handleEditChips = useCallback(
    (chips, field) => {
      setChangesData({
        ...detailsStore.changes.data,
        [field]: chips
      })
    },
    [detailsStore.changes.data, setChangesData]
  )

  const handleAddChip = useCallback(
    (chip, chips, field) => {
      setChangesData({
        ...detailsStore.changes.data,
        [field]: [...chips, ...chip]
      })
    },
    [detailsStore.changes.data, setChangesData]
  )

  const handleDeleteChip = useCallback(
    (chips, field) => {
      setChangesData({
        ...detailsStore.changes.data,
        [field]: chips
      })
    },
    [detailsStore.changes.data, setChangesData]
  )

  useEffect(() => {
    if (pageData.page === JOBS_PAGE) {
      setIteration('0')
    }

    return () => {
      resetChanges()
    }
  }, [pageData.page, resetChanges, selectedItem.uid, setIteration])

  useEffect(() => {
    if (pageData.page === JOBS_PAGE) {
      setInfoContent(generateJobsContent(selectedItem))
    } else if (
      pageData.page === ARTIFACTS_PAGE ||
      pageData.page === FILES_PAGE ||
      pageData.page === MODELS_PAGE ||
      pageData.page === FEATURE_STORE_PAGE
    ) {
      setInfoContent(
        generateArtifactsContent(
          handleEditInput,
          pageData.page,
          match.params.pageTab,
          selectedItem,
          handleEditChips,
          handleAddChip,
          handleDeleteChip
        )
      )
    } else if (pageData.page === FUNCTIONS_PAGE) {
      setInfoContent(generateFunctionsContent(selectedItem))
    }

    return () => {
      if (match.params.pageTab === MODELS_TAB) {
        removeModelFeatureVector()
      }

      removeInfoContent()
    }
  }, [
    detailsStore.changes.counter,
    handleAddChip,
    handleDeleteChip,
    handleEditChips,
    handleEditInput,
    match.params.pageTab,
    pageData.page,
    removeInfoContent,
    removeModelFeatureVector,
    selectedItem,
    setInfoContent
  ])

  const handleShowWarning = useCallback(
    show => {
      showWarning(show)
    },
    [showWarning]
  )

  const handleRefreshClick = useCallback(
    event => {
      if (
        detailsStore.changes.counter > 0 &&
        document.getElementById('refresh')?.contains(event.target)
      ) {
        cancelRequest('cancel')
        handleShowWarning(true)
        setRefreshWasHandled(true)
      }
    },
    [
      cancelRequest,
      detailsStore.changes.counter,
      handleShowWarning,
      setRefreshWasHandled
    ]
  )

  useEffect(() => {
    window.addEventListener('click', handleRefreshClick)

    return () => {
      window.removeEventListener('click', handleRefreshClick)
    }
  }, [handleRefreshClick])

  const blockRootChange = useCallback(() => {
    if (!unblockRootChange.current) {
      unblockRootChange.current = history.block(tx => {
        handleShowWarning(true)
        pathname.current = tx.pathname

        return false
      })
    }
  }, [handleShowWarning, history])

  useEffect(() => {
    if (detailsStore.changes.counter > 0 && !unblockRootChange.current) {
      blockRootChange()
    } else if (
      detailsStore.changes.counter === 0 &&
      unblockRootChange.current
    ) {
      unblockRootChange.current()
    }
  })

  const detailsMenuClick = () => {
    if (unblockRootChange.current) {
      unblockRootChange.current()
      unblockRootChange.current = null
    }
  }

  const applyChanges = () => {
    applyDetailsChanges(detailsStore.changes).then(() => {
      resetChanges()
      unblockRootChange.current()
      unblockRootChange.current = null
    })
  }

  const cancelChanges = () => {
    if (detailsStore.changes.counter > 0) {
      resetChanges()
      unblockRootChange.current()
      unblockRootChange.current = null
    }
  }

  const leavePage = () => {
    cancelChanges()
    handleShowWarning(false)

    if (unblockRootChange.current) {
      unblockRootChange.current()

      unblockRootChange.current = null
    }

    history.push(pathname.current)

    if (detailsStore.refreshWasHandled) {
      retryRequest(filtersStore)
      setRefreshWasHandled(false)
    }
  }

  const tabsContent = useMemo(() => {
    return renderContent(
      match,
      detailsStore,
      selectedItem,
      pageData,
      handlePreview,
      detailsStore,
      handleEditInput,
      setChanges,
      setChangesData,
      setChangesCounter,
      setIterationOption
    )
  }, [
    detailsStore,
    handleEditInput,
    handlePreview,
    match,
    pageData,
    selectedItem,
    setChanges,
    setChangesCounter,
    setChangesData,
    setIterationOption
  ])

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      applyChanges={applyChanges}
      cancelChanges={cancelChanges}
      detailsMenu={detailsMenu}
      detailsMenuClick={detailsMenuClick}
      detailsStore={detailsStore}
      handleCancel={handleCancel}
      handleShowWarning={handleShowWarning}
      leavePage={leavePage}
      match={match}
      pageData={pageData}
      ref={detailsRef}
      selectedItem={selectedItem}
      setIteration={setIteration}
      setRefreshWasHandled={setRefreshWasHandled}
      tabsContent={tabsContent}
    />
  )
}

Details.defaultProps = {
  applyDetailsChanges: () => {},
  cancelRequest: () => {},
  item: {},
  retryRequest: () => {},
  removeModelFeatureVector: () => {}
}

Details.propTypes = {
  actionsMenu: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func
  ]).isRequired,
  applyDetailsChanges: PropTypes.func,
  cancelRequest: PropTypes.func,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  removeModelFeatureVector: PropTypes.func,
  retryRequest: PropTypes.func,
  selectedItem: PropTypes.shape({}).isRequired
}

export default connect(
  ({ detailsStore, filtersStore }) => ({
    detailsStore,
    filtersStore
  }),
  { ...detailsActions }
)(Details)

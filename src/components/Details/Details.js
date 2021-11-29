import React, { useEffect, useMemo, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import DetailsView from './DetailsView'

import artifactActions from '../../actions/artifacts'
import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FILES_PAGE,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../../constants'
import {
  generateArtifactsContent,
  generateFeatureStoreContent,
  generateFunctionsContent,
  generateJobsContent,
  renderContent
} from './details.util'
import detailsActions from '../../actions/details'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import './details.scss'

const Details = ({
  actionsMenu,
  applyDetailsChanges,
  cancelRequest,
  detailsMenu,
  detailsStore,
  filtersStore,
  getCloseDetailsLink,
  handleCancel,
  handleRefresh,
  isDetailsScreen,
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
  const applyChangesRef = useRef()
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
  }, [dispatch, selectedItem])

  const setNewChangesData = useCallback(
    (value, field) => {
      setChangesData({
        ...detailsStore.changes.data,
        [field]: {
          ...detailsStore.changes.data[field],
          currentFieldValue: value
        }
      })
    },
    [detailsStore.changes.data, setChangesData]
  )

  const handleEditInput = useCallback(
    (value, field) => {
      setNewChangesData(value, field)
    },
    [setNewChangesData]
  )

  const handleEditChips = useCallback(
    (chips, field) => {
      setNewChangesData(chips, field)
    },
    [setNewChangesData]
  )

  const handleAddChip = useCallback(
    (chip, chips, field) => {
      setNewChangesData([...chips, ...chip], field)
    },
    [setNewChangesData]
  )

  const handleDeleteChip = useCallback(
    (chips, field) => {
      setNewChangesData(chips, field)
    },
    [setNewChangesData]
  )

  useEffect(() => {
    return () => {
      if (pageData.details.type === JOBS_PAGE) {
        setIteration('0')
      }

      resetChanges()
    }
  }, [pageData.details.type, resetChanges, setIteration])

  useEffect(() => {
    if (
      !isEveryObjectValueEmpty(selectedItem) &&
      isEveryObjectValueEmpty(detailsStore.infoContent)
    ) {
      if (pageData.details.type === JOBS_PAGE) {
        setInfoContent(generateJobsContent(selectedItem))
      } else if (
        pageData.details.type === ARTIFACTS_PAGE ||
        pageData.details.type === FILES_PAGE ||
        pageData.details.type === MODELS_TAB ||
        pageData.details.type === MODEL_ENDPOINTS_TAB ||
        pageData.details.type === DATASETS_TAB
      ) {
        setInfoContent(
          generateArtifactsContent(pageData.details.type, selectedItem)
        )
      } else if (pageData.details.type === FUNCTIONS_PAGE) {
        setInfoContent(generateFunctionsContent(selectedItem))
      } else {
        setInfoContent(
          generateFeatureStoreContent(
            handleAddChip,
            handleDeleteChip,
            handleEditChips,
            handleEditInput,
            pageData.details.type,
            selectedItem
          )
        )
      }
    }
  }, [
    detailsStore.infoContent,
    handleAddChip,
    handleDeleteChip,
    handleEditChips,
    handleEditInput,
    pageData.details.type,
    selectedItem,
    setInfoContent
  ])

  useEffect(() => {
    return () => {
      if (pageData.details.type === MODELS_TAB) {
        removeModelFeatureVector()
      }

      removeInfoContent()
      setChangesData({})
    }
  }, [
    pageData.details.type,
    removeInfoContent,
    removeModelFeatureVector,
    selectedItem,
    setChangesData
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
    let changesData = {}

    Object.keys(detailsStore.changes.data).forEach(key => {
      changesData[key] = {
        initialFieldValue: detailsStore.changes.data[key].initialFieldValue,
        previousFieldValue: detailsStore.changes.data[key].previousFieldValue,
        currentFieldValue: detailsStore.changes.data[key].previousFieldValue
      }
    })

    setChangesData({ ...changesData })

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
      applyChangesRef,
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
      applyChangesRef={applyChangesRef}
      cancelChanges={cancelChanges}
      detailsMenu={detailsMenu}
      detailsMenuClick={detailsMenuClick}
      detailsStore={detailsStore}
      getCloseDetailsLink={getCloseDetailsLink}
      handleCancel={handleCancel}
      handleRefresh={handleRefresh}
      handleShowWarning={handleShowWarning}
      isDetailsScreen={isDetailsScreen}
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
  getCloseDetailsLink: null,
  handleRefresh: () => {},
  isDetailsScreen: false,
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
  detailsMenu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      hidden: PropTypes.bool
    })
  ).isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  isDetailsScreen: PropTypes.bool,
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

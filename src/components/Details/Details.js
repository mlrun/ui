import React, {
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  useRef
} from 'react'
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
  MODELS_PAGE
} from '../../constants'
import {
  detailsActions,
  detailsReducer,
  initialState
} from '../DetailsInfo/detailsReducer'
import {
  generateArtifactsContent,
  generateFunctionsContent,
  generateJobsContent,
  renderContent
} from './details.util'

import DetailsView from './DetailsView'

import './details.scss'

const Details = ({
  actionsMenu,
  applyDetailsChanges,
  cancelRequest,
  detailsMenu,
  detailsStore,
  handleCancel,
  match,
  pageData,
  retryRequest,
  selectedItem
}) => {
  const [detailsState, detailsDispatch] = useReducer(
    detailsReducer,
    initialState
  )
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
      detailsDispatch({
        type: detailsActions.SET_CHANGES_DATA,
        payload: {
          ...detailsState.changes.data,
          [field]: value
        }
      })
    },
    [detailsState.changes.data]
  )

  const handleEditChips = useCallback(
    (chips, field) => {
      detailsDispatch({
        type: detailsActions.SET_CHANGES_DATA,
        payload: {
          ...detailsState.changes.data,
          [field]: chips
        }
      })
    },
    [detailsState.changes.data]
  )

  const handleAddChip = useCallback(
    (chip, chips, field) => {
      detailsDispatch({
        type: detailsActions.SET_CHANGES_DATA,
        payload: {
          ...detailsState.changes.data,
          [field]: [...chips, ...chip]
        }
      })
    },
    [detailsState.changes.data]
  )

  const handleDeleteChip = useCallback(
    (chips, field) => {
      detailsDispatch({
        type: detailsActions.SET_CHANGES_DATA,
        payload: {
          ...detailsState.changes.data,
          [field]: chips
        }
      })
    },
    [detailsState.changes.data]
  )

  useEffect(() => {
    if (pageData.page === JOBS_PAGE) {
      detailsDispatch({
        type: detailsActions.SET_ITERATION,
        payload: '0'
      })
    }
  }, [pageData.page, selectedItem.uid])

  useEffect(() => {
    if (pageData.page === JOBS_PAGE) {
      detailsDispatch({
        type: detailsActions.SET_INFO_CONTENT,
        payload: generateJobsContent(selectedItem)
      })
    } else if (
      pageData.page === ARTIFACTS_PAGE ||
      pageData.page === FILES_PAGE ||
      pageData.page === MODELS_PAGE ||
      pageData.page === FEATURE_STORE_PAGE
    ) {
      detailsDispatch({
        type: detailsActions.SET_INFO_CONTENT,
        payload: generateArtifactsContent(
          handleEditInput,
          pageData.page,
          match.params.pageTab,
          selectedItem,
          handleEditChips,
          handleAddChip,
          handleDeleteChip
        )
      })
    } else if (pageData.page === FUNCTIONS_PAGE) {
      detailsDispatch({
        type: detailsActions.SET_INFO_CONTENT,
        payload: generateFunctionsContent(selectedItem)
      })
    }

    return () => {
      detailsDispatch({
        type: detailsActions.REMOVE_INFO_CONTENT
      })
    }
  }, [
    detailsState.changes.counter,
    handleAddChip,
    handleDeleteChip,
    handleEditChips,
    handleEditInput,
    match.params.pageTab,
    pageData.page,
    selectedItem
  ])

  useEffect(() => {
    window.addEventListener('click', event => {
      if (
        detailsState.changes.counter > 0 &&
        document.getElementById('refresh')?.contains(event.target)
      ) {
        cancelRequest('cancel')
        handleShowWarning(true)
        detailsDispatch({
          type: detailsActions.SET_REFRESH_WAS_HANDLED,
          payload: true
        })
      }
    })
  }, [cancelRequest, detailsState.changes.counter])

  const blockRootChange = useCallback(() => {
    if (!unblockRootChange.current) {
      unblockRootChange.current = history.block(tx => {
        handleShowWarning(true)
        pathname.current = tx.pathname

        return false
      })
    }
  }, [history])

  useEffect(() => {
    if (detailsState.changes.counter > 0 && !unblockRootChange.current) {
      blockRootChange()
    } else if (
      detailsState.changes.counter === 0 &&
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
    applyDetailsChanges(detailsState.changes).then(() => {
      detailsDispatch({
        type: detailsActions.RESET_CHANGES
      })
      unblockRootChange.current()
      unblockRootChange.current = null
    })
  }

  const cancelChanges = () => {
    if (detailsState.changes.counter > 0) {
      detailsDispatch({
        type: detailsActions.RESET_CHANGES
      })
      unblockRootChange.current()
      unblockRootChange.current = null
    }
  }

  const handleShowWarning = show => {
    detailsDispatch({
      type: detailsActions.SHOW_WARNING,
      payload: show
    })
  }

  const leavePage = () => {
    cancelChanges()
    handleShowWarning(false)

    if (unblockRootChange.current) {
      unblockRootChange.current()

      unblockRootChange.current = null
    }

    history.push(pathname.current)

    if (detailsState.refreshWasHandled) {
      retryRequest({ project: match.params.projectName })
      detailsDispatch({
        type: detailsActions.SET_REFRESH_WAS_HANDLED,
        payload: false
      })
    }
  }

  const tabsContent = useMemo(() => {
    return renderContent(
      match,
      detailsState,
      detailsDispatch,
      selectedItem,
      pageData,
      handlePreview,
      detailsStore
    )
  }, [detailsState, detailsStore, handlePreview, match, pageData, selectedItem])

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      applyChanges={applyChanges}
      cancelChanges={cancelChanges}
      detailsDispatch={detailsDispatch}
      detailsMenu={detailsMenu}
      detailsMenuClick={detailsMenuClick}
      detailsState={detailsState}
      detailsStore={detailsStore}
      handleCancel={handleCancel}
      handleShowWarning={handleShowWarning}
      leavePage={leavePage}
      match={match}
      pageData={pageData}
      ref={detailsRef}
      selectedItem={selectedItem}
      tabsContent={tabsContent}
    />
  )
}

Details.defaultProps = {
  applyDetailsChanges: () => {},
  cancelRequest: () => {},
  item: {},
  retryRequest: () => {}
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
  retryRequest: PropTypes.func,
  selectedItem: PropTypes.shape({}).isRequired
}

export default connect(({ detailsStore }) => ({
  detailsStore
}))(Details)

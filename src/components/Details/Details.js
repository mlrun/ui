import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

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
  detailsMenu,
  handleCancel,
  match,
  pageData,
  selectedItem
}) => {
  const [detailsState, detailsDispatch] = useReducer(
    detailsReducer,
    initialState
  )
  const [iterationOptions, setIterationOptions] = useState([
    { label: 'Main', id: '0' }
  ])
  const history = useHistory()
  const dispatch = useDispatch()
  let unblockRootChange = useRef()
  let pathname = useRef()

  const handlePreview = () => {
    history.push(`/projects/${match.params.projectName}/artifacts`)
    dispatch(
      artifactActions.showArtifactsPreview({
        isPreview: true,
        selectedItem
      })
    )
    handleCancel()
  }

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
          handleEditChips
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
    handleEditChips,
    handleEditInput,
    match.params.pageTab,
    pageData.page,
    selectedItem
  ])

  const blockRootChange = useCallback(() => {
    unblockRootChange.current = history.block(tx => {
      handleShowWarning(true)

      pathname.current = tx.pathname

      return false
    })
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
  }, [blockRootChange, detailsState.changes.counter, history])

  const applyChanges = () => {}

  const cancelChanges = () => {
    if (detailsState.changes.counter > 0) {
      detailsDispatch({
        type: detailsActions.RESET_CHANGES
      })
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
    unblockRootChange.current()
    history.push(pathname.current)
  }

  const tabsContent = useCallback(
    renderContent(
      match,
      detailsState,
      detailsDispatch,
      selectedItem,
      pageData,
      handlePreview,
      setIterationOptions
    ),
    [detailsState, handlePreview, match, pageData, selectedItem]
  )

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      applyChanges={applyChanges}
      cancelChanges={cancelChanges}
      detailsDispatch={detailsDispatch}
      detailsMenu={detailsMenu}
      detailsState={detailsState}
      handleCancel={handleCancel}
      handleShowWarning={handleShowWarning}
      iterationOptions={iterationOptions}
      leavePage={leavePage}
      match={match}
      pageData={pageData}
      selectedItem={selectedItem}
      tabsContent={tabsContent}
    />
  )
}

Details.defaultProps = {
  item: {}
}

Details.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default Details

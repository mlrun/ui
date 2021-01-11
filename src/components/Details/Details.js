import React, { useState, useEffect, useReducer } from 'react'
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

import DetailsView from './DetailsView'

import './details.scss'
import {
  generateArtifactsContent,
  generateFunctionsContent,
  generateJobsContent
} from '../DetailsInfo/detailsInfo.util'

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

  const handleEditDescription = (value) => {
    detailsDispatch()
  }

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
          () => {},
          pageData.page,
          match.params.pageTab,
          selectedItem
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
  }, [match.params.pageTab, pageData.page, selectedItem])

  return (
    <DetailsView
      infoContent={detailsState.infoContent}
      actionsMenu={actionsMenu}
      detailsMenu={detailsMenu}
      handleCancel={handleCancel}
      handlePreview={handlePreview}
      iteration={detailsState.iteration}
      iterationOptions={iterationOptions}
      match={match}
      pageData={pageData}
      selectedItem={selectedItem}
      setIteration={option =>
        detailsDispatch({
          type: detailsActions.SET_ITERATION,
          payload: option
        })
      }
      setIterationOptions={setIterationOptions}
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

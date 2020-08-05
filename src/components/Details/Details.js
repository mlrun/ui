import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import artifactActions from '../../actions/artifacts'
import { JOBS_PAGE } from '../../constants'

import DetailsView from './DetailsView'

import './details.scss'

const Details = ({
  actionsMenu,
  detailsMenu,
  handleCancel,
  match,
  page,
  selectedItem
}) => {
  const [iteration, setIteration] = useState('0')
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

  useEffect(() => {
    if (page === JOBS_PAGE) {
      setIteration('0')
    }
  }, [page, selectedItem.uid])

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      detailsMenu={detailsMenu}
      handleCancel={handleCancel}
      handlePreview={handlePreview}
      iteration={iteration}
      iterationOptions={iterationOptions}
      match={match}
      page={page}
      selectedItem={selectedItem}
      setIteration={setIteration}
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
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default Details

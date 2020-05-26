import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import artifactActions from '../../actions/artifacts'

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

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      detailsMenu={detailsMenu}
      handleCancel={handleCancel}
      handlePreview={handlePreview}
      selectedItem={selectedItem}
      match={match}
      page={page}
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

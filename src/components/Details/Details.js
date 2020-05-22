import React, { useEffect } from 'react'
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
  item,
  match,
  page
}) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handlePreview = () => {
    history.push(`/projects/${match.params.projectName}/artifacts`)
    dispatch(
      artifactActions.showArtifactsPreview({
        isPreview: true,
        item
      })
    )
    handleCancel()
  }

  useEffect(() => {
    if (match.params.tab === 'metadata' && !item.schema) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    } else {
      let newDetailsMenu = item.schema
        ? [...detailsMenu, 'metadata']
        : detailsMenu
      if (!newDetailsMenu.includes(match.params.tab)) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
        handleCancel()
      }
    }
  }, [match.params, history, page, detailsMenu, item.schema, handleCancel])

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      detailsMenu={detailsMenu}
      handleCancel={handleCancel}
      handlePreview={handlePreview}
      item={item}
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
  item: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default Details

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import artifactActions from '../../actions/artifacts'

import DetailsView from './DetailsView'

import './details.scss'
const Details = ({
  detailsMenu,
  handleCancel,
  item,
  match,
  page,
  toggleConvertToYaml
}) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handlePreview = () => {
    history.push(`/projects/${match.params.projectName}/artifacts`)
    dispatch(
      artifactActions.artifactPreview({
        isPreview: true,
        item
      })
    )
    handleCancel()
  }

  useEffect(() => {
    if (match.params.tab === 'metadata' && item.schema === undefined) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    }
  }, [
    history,
    item.schema,
    match.params.name,
    match.params.projectName,
    match.params.tab
  ])

  return (
    <DetailsView
      handlePreview={handlePreview}
      detailsMenu={detailsMenu}
      handleCancel={handleCancel}
      page={page}
      item={item}
      match={match}
      toggleConvertToYaml={toggleConvertToYaml}
    />
  )
}

Details.defaultProps = {
  item: {}
}

Details.propTypes = {
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  item: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default Details

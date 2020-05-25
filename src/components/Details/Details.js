import React, { useEffect, useState } from 'react'
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
  const [generatedDetailsMenu, setGeneratedDetailsMenu] = useState(detailsMenu)
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
    if (match.params.tab === 'metadata' && !selectedItem.schema) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )

      setGeneratedDetailsMenu(detailsMenu)
    } else if (selectedItem.schema) {
      let newDetailsMenu = selectedItem.schema
        ? [...detailsMenu, 'metadata']
        : detailsMenu

      setGeneratedDetailsMenu(newDetailsMenu)
    } else if (!selectedItem.schema) {
      setGeneratedDetailsMenu(detailsMenu)
    }
  }, [
    match.params.tab,
    match.params.projectName,
    detailsMenu,
    selectedItem.schema,
    match.params.name,
    history
  ])

  return (
    <DetailsView
      actionsMenu={actionsMenu}
      detailsMenu={generatedDetailsMenu}
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

export default React.memo(Details, (prev, next) => prev.match === next.match)

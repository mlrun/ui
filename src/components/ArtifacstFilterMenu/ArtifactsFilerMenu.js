import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../common/Select/Select'
import './artifactsfiltermenu.scss'

const ArtifactsFilerMenu = ({ filters }) => {
  return (
    <div className="content__action_bar__filters">
      {filters.map(filter => (
        <Select filter={filter} />
      ))}
    </div>
  )
}

ArtifactsFilerMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default ArtifactsFilerMenu

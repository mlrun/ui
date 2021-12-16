import React from 'react'
import PropTypes from 'prop-types'

import Tip from '../../../common/Tip/Tip'

import './ProjectActions.scss'

const ProjectActions = ({ actions, handleLinks, showActions }) => {
  return (
    <ul className="project-overview-actions" aria-expanded={showActions}>
      {actions.map(({ externalLink, icon, id, label, path, tooltip }) => {
        return (
          <li
            key={id}
            className="project-overview-actions__item"
            onClick={() => handleLinks(path, externalLink)}
          >
            <div className="project-overview-actions__item-wrapper">
              <i className="project-overview-actions__item-icon">{icon}</i>
              <span className="link">{label}</span>
              {tooltip && <Tip text={tooltip} />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

ProjectActions.defaultProps = {
  actions: [],
  handleLinks: () => {},
  showActions: false
}

ProjectActions.propTypes = {
  actions: PropTypes.array.isRequired,
  handleLinks: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired
}

export default ProjectActions

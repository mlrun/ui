import React from 'react'
import PropTypes from 'prop-types'

import Tip from '../../../common/Tip/Tip'

import './ProjectAction.scss'

const ProjectAction = ({ actions, onClick, showActions }) => {
  return (
    <ul className="project-overview-actions" aria-expanded={showActions}>
      {actions.map(({ icon, id, label, path, tooltip }) => {
        return (
          <li
            key={id}
            className="project-overview-actions__item"
            title={label}
            alt={label}
          >
            <button
              className="project-overview-actions__item-wrapper"
              onClick={() => onClick(path)}
            >
              <i className="project-overview-actions__item-icon">{icon}</i>
              <span className="link">{label}</span>
              {tooltip && <Tip text={tooltip} />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

ProjectAction.defaultProps = {
  actions: [],
  onClick: () => {},
  showActions: true
}

ProjectAction.propTypes = {
  actions: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  showActions: PropTypes.bool
}

export default ProjectAction

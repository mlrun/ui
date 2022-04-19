import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tip from '../../../common/Tip/Tip'

import './ProjectAction.scss'

const ProjectAction = ({ actions, onClick, showActions }) => {
  const projectActionsClassNames = classnames(
    'project-overview-actions',
    !showActions && 'project-overview-actions_hidden'
  )

  return (
    <ul className={projectActionsClassNames}>
      {actions.map(({ icon, id, label, path, tooltip }) => {
        return (
          <li key={id} className="project-overview-actions__item" title={label}>
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

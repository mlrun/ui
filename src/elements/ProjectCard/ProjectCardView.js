import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'

import './projectCard.scss'

const ProjectCardView = React.forwardRef(
  (
    { actionsMenu, project, setShowActionsList, showActionsList, statistics },
    ref
  ) => {
    const history = useHistory()
    const menuItemClasses = classnames(
      'project-card__actions-menu-item',
      actionsMenu[project.metadata.name].some(
        action => !action.hidden && action.icon
      ) && 'with-icon'
    )

    return (
      <div
        className="project-card"
        onClick={event => {
          if (
            event.target.tagName !== 'A' &&
            !ref.current.contains(event.target)
          ) {
            history.push(`/projects/${project.metadata.name}`)
          }
        }}
      >
        <div className="project-card__general-info">
          <div className="project-card__header">
            <Tooltip
              template={<TextTooltipTemplate text={project.metadata.name} />}
            >
              {project.metadata.name}
            </Tooltip>
          </div>
          {project?.spec.description && (
            <Tooltip
              className="project-card_description"
              template={<TextTooltipTemplate text={project.spec.description} />}
            >
              {project.spec.description}
            </Tooltip>
          )}
        </div>
        <div className="project-card__statistic">
          <ProjectStatistics statistics={statistics} />
        </div>
        <div className="project-card__actions-menu" ref={ref}>
          <button onClick={() => setShowActionsList(state => !state)}>
            <ActionMenu />
          </button>
          {showActionsList && (
            <div className="project-card__actions-menu-body">
              {actionsMenu[project.metadata.name]
                .filter(menuItem => !menuItem.hidden)
                .map(menuItem => (
                  <div
                    className={menuItemClasses}
                    onClick={() => {
                      setShowActionsList(false)
                      menuItem.onClick(project)
                    }}
                    key={menuItem.label}
                  >
                    <span className="project-card__actions-menu-item-icon">
                      {menuItem.icon}
                    </span>
                    {menuItem.label}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)

ProjectCardView.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  setShowActionsList: PropTypes.func.isRequired,
  showActionsList: PropTypes.bool.isRequired,
  statistics: PropTypes.shape({}).isRequired
}

export default ProjectCardView

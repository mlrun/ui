import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'

const ProjectCardView = React.forwardRef(
  (
    { actionsMenu, project, setShowActionsList, showActionsList, statistics },
    ref
  ) => {
    const history = useHistory()

    return (
      <div
        className="project-card"
        onClick={event => {
          if (
            event.target.tagName !== 'A' &&
            !ref.current.contains(event.target)
          ) {
            history.push(`/projects/${project.name}`)
          }
        }}
      >
        <div className="project-card__general-info">
          <div className="project-card__header">{project.name}</div>
          {project?.description && (
            <Tooltip
              className="project-card_description"
              template={<TextTooltipTemplate text={project.description} />}
            >
              {project.description}
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
              {actionsMenu.map(menuItem => (
                <div
                  className="project-card__actions-menu-item"
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
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  project: PropTypes.shape({}).isRequired,
  setShowActionsList: PropTypes.func.isRequired,
  showActionsList: PropTypes.bool.isRequired,
  statistics: PropTypes.shape({}).isRequired
}

export default ProjectCardView

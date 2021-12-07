import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'

import { ACTIONS_MENU } from '../../types'

import './projectCard.scss'

const ProjectCardView = React.forwardRef(
  ({ actionsMenu, project, statistics }, ref) => {
    const history = useHistory()

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
          <ActionsMenu
            dataItem={project}
            menu={actionsMenu[project.metadata.name]}
          />
        </div>
      </div>
    )
  }
)

ProjectCardView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  project: PropTypes.shape({}).isRequired,
  statistics: PropTypes.shape({}).isRequired
}

export default ProjectCardView

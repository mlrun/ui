import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import ProjectLabels from '../../components/Project/ProjectLabels/ProjectLabels'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { getTimeElapsedByDate } from '../../utils'

import { ReactComponent as ClockIcon } from '../../images/clock.svg'

import './projectCard.scss'

const ProjectCardView = React.forwardRef(({ actionsMenu, project, statistics }, ref) => {
  const cardRef = useRef()
  const chipRef = useRef()
  const navigate = useNavigate()

  return (
    <div
      className="project-card"
      onClick={event => {
        if (
          event.target.tagName !== 'A' &&
          !ref.current.contains(event.target) &&
          !chipRef.current?.contains(event.target)
        ) {
          navigate(`/projects/${project.metadata.name}`)
        }
      }}
      ref={cardRef}
    >
      <div className="project-card__general-info">
        <div className="project-card__header">
          <div className="project-card__header-title">
            <Tooltip
              className="project-card__title"
              template={<TextTooltipTemplate text={project.metadata.name} />}
            >
              {project.metadata.name}
            </Tooltip>

            <div className="project-card__info">
              <ClockIcon className="project-card__info-icon" />
              <span>{getTimeElapsedByDate(project.metadata.created)}</span>
            </div>
          </div>

          <div
            className={`project-card__header-sub-title project-card__info ${
              !project.spec.owner ? 'visibility-hidden' : ''
            } `}
          >
            <span>Owner:</span>
            <span>{project.spec.owner}</span>
          </div>
        </div>

        <div className="project-card__content">
          <div className="project-card__description">
            {project?.spec.description && (
              <Tooltip template={<TextTooltipTemplate text={project.spec.description} />}>
                {project.spec.description}
              </Tooltip>
            )}
          </div>

          <div className="project-card__statistic">
            <ProjectStatistics statistics={statistics} />
          </div>
        </div>

        {project.metadata.labels && (
          <div className="project-card__info project-card__labels" ref={chipRef}>
            <span>Labels:</span>
            <ProjectLabels labels={project.metadata.labels} shortChips visibleChipsMaxLength="1" />
          </div>
        )}
      </div>

      <div className="project-card__actions-menu" ref={ref}>
        <ActionsMenu dataItem={project} menu={actionsMenu[project.metadata.name]} />
      </div>
    </div>
  )
})

ProjectCardView.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  statistics: PropTypes.shape({}).isRequired
}

export default ProjectCardView

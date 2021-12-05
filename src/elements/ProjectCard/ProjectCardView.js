import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import ChipCell from '../../common/ChipCell/ChipCell'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { getTimeElapsedByDate, parseKeyValues } from '../../utils'
import { getChipOptions } from '../../utils/getChipOptions'

import { ReactComponent as ClockIcon } from '../../images/clock.svg'

import './projectCard.scss'

const ProjectCardView = React.forwardRef(
  ({ actionsMenu, project, statistics }, ref) => {
    const cardRef = useRef()
    const chipRef = useRef()
    const history = useHistory()

    const cardsClasses = classNames(
      'project-card',
      project.spec.description && 'with-description'
    )
    return (
      <div
        className={cardsClasses}
        onClick={event => {
          if (
            event.target.tagName !== 'A' &&
            !ref.current.contains(event.target) &&
            !chipRef.current.contains(event.target)
          ) {
            history.push(`/projects/${project.metadata.name}`)
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
              className={`project-card__header-sub-title project-card__info f-12 ${
                !project.spec.owner ? 'visiblity-hidden' : ''
              } `}
            >
              <span>Owner:</span>
              <span>{project.spec.owner}</span>
            </div>
          </div>

          <div className="project-card__content">
            {project?.spec.description && (
              <Tooltip
                className="project-card_description"
                template={
                  <TextTooltipTemplate text={project.spec.description} />
                }
              >
                {project.spec.description}
              </Tooltip>
            )}
            <div className="project-card__statistic">
              <ProjectStatistics statistics={statistics} />
            </div>
          </div>

          <div className="project-card__info f-12" ref={chipRef}>
            {project.metadata.labels && (
              <>
                <span>Labels:</span>
                <div>
                  <ChipCell
                    chipOptions={getChipOptions('labels')}
                    elements={parseKeyValues(project.metadata.labels || {})}
                    // isEditMode={true}
                    shortChips
                    tooltip
                    visibleChipsMaxLength="0"
                  />
                </div>
              </>
            )}
          </div>
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
  actionsMenu: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  statistics: PropTypes.shape({}).isRequired
}

export default ProjectCardView

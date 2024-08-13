/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import ProjectLabels from '../../components/Project/ProjectLabels/ProjectLabels'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getTimeElapsedByDate } from '../../utils'

import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

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
          !chipRef.current?.contains(event.target) &&
          !event.target.closest('#overlay_container')
        ) {
          navigate(`/projects/${project.metadata.name}/monitor`)
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

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { CSSTransition } from 'react-transition-group'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import PopUpDialog from '../../../common/PopUpDialog/PopUpDialog'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'

import projectsAction from '../../../actions/projects'

import { calcIsDemoPrefix } from '../../../utils/helper'
import { getInitialCards } from './ProjectOverview.util'
import { handleFetchProjectError } from '../project.utils'
import { getDateAndTimeByFormat } from '../../../utils/'

import { useDemoMode } from '../../../hooks/demoMode.hook'

import { ReactComponent as ArrowIcon } from '../../../images/arrow.svg'

import './ProjectOverview.scss'

const ProjectOverview = ({ fetchProject, history, match, projectStore }) => {
  const [clicked, setClicked] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const [popupDialog, setPopupDialog] = useState({})

  const isDemoMode = useDemoMode()

  const project = projectStore.project
  const { projectName } = match.params

  const cards = useMemo(() => {
    return projectName ? getInitialCards(projectName) : {}
  }, [projectName])

  const handlePopupDialogOpen = popupName => {
    return setPopupDialog(prev => {
      return { ...prev, [popupName]: true }
    })
  }

  const handlePopupDialogClose = useCallback(actionKey => {
    return setPopupDialog(prev => {
      return { ...prev, [actionKey]: false }
    })
  }, [])

  const handlePathLink = useCallback(
    (path, externalLink) => {
      return path.indexOf('/') < 0
        ? handlePopupDialogOpen(path)
        : externalLink
        ? (window.top.location.href = path)
        : history.push(`${path}${calcIsDemoPrefix(path, isDemoMode)}`)
    },
    [history, isDemoMode]
  )

  const handleToggle = index => {
    if (clicked === index) {
      return setClicked(null)
    }
    setClicked(index)
  }

  const fetchProjectData = useCallback(async () => {
    try {
      await fetchProject(match.params.projectName)
    } catch (error) {
      handleFetchProjectError(error, history, setConfirmData)
    }
  }, [fetchProject, history, match.params.projectName])

  useEffect(() => {
    fetchProjectData()
  }, [fetchProjectData])

  if (project.loading) {
    return <Loader />
  }

  if (project.error) {
    return (
      <div className="project__error-container">
        {confirmData ? (
          <ConfirmDialog
            closePopUp={confirmData.confirmHandler}
            confirmButton={{
              handler: confirmData.confirmHandler,
              label: confirmData.btnConfirmLabel,
              variant: confirmData.btnConfirmType
            }}
            message={confirmData.message}
            messageOnly={confirmData.messageOnly}
          />
        ) : (
          <h1>{project.error.message}</h1>
        )}
      </div>
    )
  }

  if (isEmpty(project.data)) {
    return <NoData />
  }

  return (
    <div className="project-overview">
      {/* popupDialogs to be implemnted later */}
      <CSSTransition
        in={popupDialog.uploaddata}
        timeout={300}
        classNames="project-overview-transition"
        unmountOnExit
      >
        <PopUpDialog closePopUp={() => handlePopupDialogClose('uploaddata')}>
          uploaddata
        </PopUpDialog>
      </CSSTransition>
      <>
        <div className="project-overview__header">
          <div className="project-overview__header-title">
            {project.data.metadata.name}
            <Tooltip
              template={
                <TextTooltipTemplate text={project.data.status.state} />
              }
            >
              <i
                className={`state-${project.data.status.state}-job status-icon`}
              />
            </Tooltip>
            <div className="project-overview__header-created">
              <span>Created: </span>
              {getDateAndTimeByFormat(
                project.data.metadata.created,
                'YYYY-MM-DD HH:mmA'
              )}
            </div>
          </div>
          <p className="project-overview__header-subtitle">
            {project.data.spec.description ?? ''}
          </p>
        </div>
        <div className="project-overview__content">
          {/* move to card */}
          {Object.keys(cards).map((card, index) => {
            const { additionalLinks, actions, subTitle, title } = cards[card]
            return (
              <div className="project-overview-card" key={card}>
                <div className="project-overview-card__top">
                  <div className="project-overview-card__header">
                    <h3 className="project-overview-card__header-title">
                      {title}
                    </h3>
                    <p className="project-overview-card__header-subtitle">
                      {subTitle ?? ''}
                    </p>
                  </div>
                  <div className="project-overview-card__actions">
                    <ProjectAction
                      actions={actions.slice(0, 3)}
                      handleLinks={handlePathLink}
                      showActions={true}
                    />
                    <ProjectAction
                      actions={actions.slice(3, actions.length)}
                      handleLinks={handlePathLink}
                      showActions={clicked === index}
                    />
                    {actions.length > 3 && (
                      <p
                        className="project-overview-card__actions-toogler"
                        aria-expanded={clicked === index}
                        onClick={() => handleToggle(index)}
                      >
                        <ArrowIcon />
                        <span>Additional Actions</span>
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="project-overview-card__center"
                  aria-expanded={clicked !== index}
                >
                  <ProjectOverviewTableRow />
                </div>
                <div className="project-overview-card__bottom">
                  <div className="additional-links">
                    {additionalLinks &&
                      additionalLinks.map(
                        ({ externalLink, id, label, path }) => (
                          <span
                            key={id}
                            className="link"
                            onClick={() => handlePathLink(path, externalLink)}
                          >
                            {label}
                          </span>
                        )
                      )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </>
    </div>
  )
}

ProjectOverview.defaultProps = {
  isDemoMode: false
}

ProjectOverview.propTypes = {
  isDemoMode: PropTypes.bool
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  {
    ...projectsAction
  }
)(ProjectOverview)

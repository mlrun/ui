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

const ProjectOverview = ({ fetchProject, history, match, project }) => {
  const [selectedActionsID, setSelectedActionsID] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const [popupDialog, setPopupDialog] = useState({})

  const isDemoMode = useDemoMode()
  const { projectName } = match.params

  const cards = useMemo(() => {
    return projectName ? getInitialCards(projectName) : {}
  }, [projectName])

  const handlePopupDialogToogle = popupName => {
    return setPopupDialog(prev => {
      return { ...prev, [popupName]: !prev[popupName] ? true : false }
    })
  }

  const handlePathLink = useCallback(
    (path, externalLink) => {
      return path.indexOf('/') < 0
        ? handlePopupDialogToogle(path)
        : externalLink
        ? (window.top.location.href = path)
        : history.push(`${path}${calcIsDemoPrefix(path, isDemoMode)}`)
    },
    [history, isDemoMode]
  )

  const handleActionsViewToggle = index => {
    if (selectedActionsID === index) {
      return setSelectedActionsID(null)
    }
    setSelectedActionsID(index)
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
        <PopUpDialog closePopUp={() => handlePopupDialogToogle('uploaddata')}>
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
                      showActions={selectedActionsID === index}
                    />
                    {actions.length > 3 && (
                      <p
                        className="project-overview-card__actions-toogler"
                        aria-expanded={selectedActionsID === index}
                        onClick={() => handleActionsViewToggle(index)}
                      >
                        <ArrowIcon />
                        <span>Additional Actions</span>
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="project-overview-card__center"
                  aria-expanded={selectedActionsID === index}
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

ProjectOverview.propTypes = {
  match: PropTypes.shape({}).isRequired
}

const mapDispatchToProps = dispatch => ({
  fetchProject: projectName =>
    dispatch(projectsAction.fetchProject(projectName))
})

export default connect(
  ({ projectStore }) => ({
    project: projectStore.project
  }),
  mapDispatchToProps
)(ProjectOverview)

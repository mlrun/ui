import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { isEmpty } from 'lodash'
import { CSSTransition } from 'react-transition-group'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import PopUpDialog from '../../../common/PopUpDialog/PopUpDialog'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'

import { calcIsDemoPrefix } from '../../../utils/helper'
import { getInitialCards } from './ProjectOverview.util'

import { ReactComponent as ArrowIcon } from '../../../images/arrow.svg'

import './ProjectOverview.scss'

const ProjectOverview = ({ confirmData, isDemoMode }) => {
  const project = useSelector(store => store.projectStore.project)

  const [popupDialog, setPopupDialog] = useState({})
  const [clicked, setClicked] = useState(null)

  const history = useHistory()
  const { projectName } = useParams()

  const cards = useMemo(() => {
    return projectName ? getInitialCards(projectName) : {}
  }, [projectName])

  const handlePopupDialogOpen = popupName => {
    return setPopupDialog(prev => {
      return { ...prev, [popupName]: true }
    })
  }

  const handlePopupDialogClose = actionKey => {
    return setPopupDialog(prev => {
      return { ...prev, [actionKey]: false }
    })
  }

  const handlePathLink = (path, externalLink) => {
    return path.indexOf('/') < 0
      ? handlePopupDialogOpen(path)
      : externalLink
      ? (window.top.location.href = path)
      : history.push(`${path}${calcIsDemoPrefix(path, isDemoMode)}`)
  }

  const handleToggle = index => {
    if (clicked === index) {
      return setClicked(null)
    }
    setClicked(index)
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

      {project.loading ? (
        <Loader />
      ) : project.error ? (
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
      ) : isEmpty(project.data) ? (
        <NoData />
      ) : (
        <>
          <div className="project-overview__header">
            <div className="project-overview__header-cell">
              <h1 className="project-overview__header-title">
                {project.data.metadata.name}
              </h1>
              <p className="project-overview__header-subtitle">
                {project.data.spec.description ?? ''}
              </p>
            </div>
            <div className="project-overview__header-cell">2</div>
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
                    </div>
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
      )}
    </div>
  )
}

ProjectOverview.defaultProps = {
  confirmData: null
}

ProjectOverview.propTypes = {
  confirmData: PropTypes.object,
  isDemoMode: PropTypes.bool
}

export default React.memo(ProjectOverview)

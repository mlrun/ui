import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import PopUpDialog from '../../../common/PopUpDialog/PopUpDialog'

import { getInitialCards } from './ProjectOverview.util'
import { useDemoMode } from '../../../hooks/demoMode.hook'

import './ProjectOverview.scss'

const ProjectOverview = ({ confirmData }) => {
  const project = useSelector(store => store.projectStore.project)
  const [popupDialog, setPopupDialog] = useState({})

  const history = useHistory()
  const { projectName } = useParams()
  const isDemoMode = useDemoMode()

  const cards = useMemo(() => {
    return projectName ? getInitialCards(projectName) : {}
  }, [projectName])

  const handlePopupDialogOpen = actionKey => {
    return setPopupDialog(prev => {
      return { ...prev, [actionKey]: true }
    })
  }

  const calcIsDemoPrefix = path => {
    let prefix = path.includes('?') ? '&' : '?'
    return isDemoMode ? prefix.concat('demo=true') : ''
  }

  const handleActionClick = (path, externalLink) => {
    return path.indexOf('/') < 0
      ? handlePopupDialogOpen(path)
      : externalLink
      ? (window.top.location.href = path)
      : history.push(`${path}${calcIsDemoPrefix(path)}`)
  }

  const handlePopupDialogClose = actionKey => {
    return setPopupDialog(prev => {
      return { ...prev, [actionKey]: false }
    })
  }

  return (
    <div className="project-overview">
      {/* popupDialogs to be implemnted later */}
      {popupDialog.uploaddata && (
        <PopUpDialog closePopUp={() => handlePopupDialogClose('uploaddata')}>
          uploaddata
        </PopUpDialog>
      )}

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
            <div className="project-overview__content-cards">
              {/* move to card */}
              {Object.keys(cards).map(card => {
                const { actions, additionalLinks, subTitle, title } = cards[
                  card
                ]
                return (
                  <div className="project-overview-card" key={card}>
                    <div className="project-overview-card_top">
                      <div className="project-overview-card__header">
                        <h3 className="project-overview-card__header-title">
                          {title}
                        </h3>
                        <p className="project-overview-card__header-subtitle">
                          {subTitle ?? ''}
                        </p>
                      </div>
                      {/* move to additional links */}
                      <div className="project-overview-card__actions">
                        <ul className="actions__list">
                          {actions.map(
                            ({ externalLink, handler, icon, label }) => {
                              return (
                                <li
                                  key={label}
                                  className="actions-item"
                                  onClick={() =>
                                    handleActionClick(handler, externalLink)
                                  }
                                >
                                  <i className="actions-icon">{icon}</i>
                                  <span className="link">{label}</span>
                                </li>
                              )
                            }
                          )}
                        </ul>
                        {actions.length > 3 && <p>additional-links</p>}
                      </div>
                    </div>
                    <div className="project-overview-card_bottom">
                      {additionalLinks &&
                        additionalLinks.map(link => (
                          <Link to={link.path} key={link.id} className="link">
                            {link.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default React.memo(ProjectOverview)

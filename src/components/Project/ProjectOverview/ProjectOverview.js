import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { isEmpty } from 'lodash'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import PopUpDialog from '../../../common/PopUpDialog/PopUpDialog'

import { InitialCards } from './ProjectOverview.util'

import './ProjectOverview.scss'

const ProjectOverview = ({ confirmData }) => {
  const project = useSelector(store => store.projectStore.project)
  const [popupDialog, setPopupDialog] = useState({})

  const history = useHistory()

  const setNewState = actionKey => {
    return setPopupDialog(prev => {
      return { ...prev, [actionKey]: true }
    })
  }

  const handleActionClick = handler => {
    return handler.indexOf('/') > -1
      ? history.push(`${history.location.pathname}${handler}`)
      : setNewState(handler)
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
              {Object.keys(InitialCards).map(card => {
                const { actions, subTitle, title } = InitialCards[card]
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
                          {actions.map(({ handler, icon, label }) => {
                            return (
                              <li
                                key={label}
                                className="actions-item"
                                onClick={() => handleActionClick(handler)}
                              >
                                <i className="actions-icon">{icon}</i>
                                <span className="link">{label}</span>
                              </li>
                            )
                          })}
                        </ul>
                        <p>additional-links</p>
                      </div>
                    </div>
                    <div className="project-overview-card_bottom">
                      bottom stats
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

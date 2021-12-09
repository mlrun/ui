import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'

import { InitialCards } from './ProjectOverview.util'

import './ProjectOverview.scss'

const ProjectOverview = ({ confirmData }) => {
  const project = useSelector(store => store.projectStore.project)

  return (
    <div className="project-overview">
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
                const cardData = InitialCards[card]
                return (
                  <div className="project-overview-card" key={card}>
                    <div className="project-overview-card_top">
                      <div className="project-overview-card__header">
                        <h3 className="project-overview-card__header-title">
                          {cardData.title}
                        </h3>
                        <p className="project-overview-card__header-subtitle">
                          {cardData.subTitle ?? ''}
                        </p>
                      </div>
                      {/* move to additional links */}
                      <div className="project-overview-card__actions">
                        <ul className="actions__list">
                          {cardData.actions.map(action => {
                            return (
                              <li
                                key={action.label}
                                className="actions__list-item"
                              >
                                <i className="actions__list-icon">
                                  {action.icon}
                                </i>
                                <label>{action.label}</label>
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

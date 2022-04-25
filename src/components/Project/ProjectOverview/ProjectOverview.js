import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import UploadData from '../../UploadDataPopup/UploadDataPopup'

import projectsAction from '../../../actions/projects'

import { handlePath, getInitialCards } from './ProjectOverview.util'
import { handleFetchProjectError } from '../project.utils'
import { getDateAndTimeByFormat } from '../../../utils/'

import { ReactComponent as ArrowIcon } from '../../../images/arrow.svg'

import './ProjectOverview.scss'

const ProjectOverview = ({ fetchProject, project }) => {
  const [selectedActionsIndex, setSelectedActionsIndex] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const [modals, setModals] = useState({ uploaddata: { isOpen: false, label: '' } })
  const params = useParams()
  const navigate = useNavigate()

  const cards = useMemo(() => {
    return params.projectName ? getInitialCards(params.projectName) : {}
  }, [params])

  const handleModalOpen = ({ label, path }) => {
    return setModals(prev => ({
      ...prev,
      [path.target]: {
        id: path.target,
        isOpen: !prev[path.target].isOpen,
        label
      }
    }))
  }

  const handleModalClose = modalName => {
    setModals(oldModals => ({
      ...oldModals,
      [modalName]: {
        ...oldModals[modalName],
        isOpen: false
      }
    }))
  }

  const handlePathExecution = handlePath(navigate, handleModalOpen)

  const handleActionsViewToggle = index => {
    if (selectedActionsIndex === index) {
      return setSelectedActionsIndex(null)
    }
    setSelectedActionsIndex(index)
  }

  useEffect(() => {
    fetchProject(params.projectName).catch(error =>
      handleFetchProjectError(error, navigate, setConfirmData)
    )
  }, [fetchProject, navigate, params.projectName])

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
      <UploadData
        onClose={() => handleModalClose(modals.uploaddata?.id)}
        show={modals.uploaddata?.isOpen}
        title={modals.uploaddata?.label}
      />
      <div className="project-overview__header">
        <div className="project-overview__header-title">
          {project.data.metadata.name}
          <Tooltip template={<TextTooltipTemplate text={project.data.status.state} />}>
            <i className={`state-${project.data.status.state}-job status-icon`} />
          </Tooltip>
        </div>
        <div className="project-overview__header-subtitle">
          <div>
            <span className="project-overview__header-subtitle-name">Created:</span>
            <span>
              {getDateAndTimeByFormat(project.data.metadata.created, 'YYYY-MM-DD, HH:mm:ss A')}
            </span>
          </div>
          <div>
            <span className="project-overview__header-subtitle-name">Owner:</span>
            <span>{project.data.spec.owner}</span>
          </div>
        </div>
        <p className="project-overview__header-description">
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
                  <h3 className="project-overview-card__header-title">{title}</h3>
                  <p className="project-overview-card__header-subtitle">{subTitle ?? ''}</p>
                </div>
                <div className="project-overview-card__actions">
                  <ProjectAction
                    actions={actions.slice(0, 3)}
                    onClick={handlePathExecution}
                    showActions={true}
                  />
                  <ProjectAction
                    actions={actions.slice(3, actions.length)}
                    onClick={handlePathExecution}
                    showActions={selectedActionsIndex === index}
                  />
                  {actions.length > 3 && (
                    <p
                      className="project-overview-card__actions-toogler"
                      aria-expanded={selectedActionsIndex === index}
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
                aria-expanded={selectedActionsIndex === index}
              >
                <ProjectOverviewTableRow />
              </div>
              <div className="project-overview-card__bottom">
                <div className="additional-links">
                  {additionalLinks &&
                    additionalLinks.map(({ id, label, path }) => (
                      <span key={id} className="link" onClick={() => handlePathExecution({ path })}>
                        {label}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const actionCreators = {
  fetchProject: projectsAction.fetchProject
}

export default connect(
  ({ projectStore }) => ({
    project: projectStore.project
  }),
  { ...actionCreators }
)(ProjectOverview)

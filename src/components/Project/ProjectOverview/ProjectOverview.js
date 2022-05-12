import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'
import { Tooltip, TextTooltipTemplate, Wizard } from 'igz-controls/components'

import RegisterArtifactPopup from '../../RegisterArtifactPopup/RegisterArtifactPopup'

import projectsAction from '../../../actions/projects'

import { handlePath, getInitialCards } from './ProjectOverview.util'
import { handleFetchProjectError } from '../project.utils'
import { getDateAndTimeByFormat } from '../../../utils/'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/arrow.svg'
import { openPopUp } from 'igz-controls/utils/common.util'

import './ProjectOverview.scss'

const ProjectOverview = ({ fetchProject, project }) => {
  const [selectedActionsIndex, setSelectedActionsIndex] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const [modal, setModal] = useState({ isOpen: false, name: '' })
  const params = useParams()
  const navigate = useNavigate()

  const cards = useMemo(() => {
    return params.projectName ? getInitialCards(params.projectName) : {}
  }, [params])

  const renderPopupContent = () => {
    switch (modal.name) {
      case 'registerdataset':
        return (
          <RegisterArtifactPopup
            artifactKind="dataset"
            refresh={() => {}}
            setIsPopupOpen={handleModalToggle}
            title="Register dataset"
          />
        )
      case 'registerfile':
        return (
          <RegisterArtifactPopup
            artifactKind="artifact"
            refresh={() => {}}
            setIsPopupOpen={handleModalToggle}
            title="Register artifact"
          />
        )
      default:
        return ''
    }
  }

  const handleModalToggle = popupName => {
    return setModal(prev => {
      return {
        ...prev,
        isOpen: !prev.isOpen,
        name: !prev.isOpen ? popupName : ''
      }
    })
  }

  const handlePathExecution = handlePath(navigate, handleModalToggle)

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

  const stepsConfig = [
    {
      actions: () => [],
      id: 'step1',
      label: 'Step 1'
    },
    {
      actions: actions => [
        {
          icon: null,
          label: 'Custom',
          onClick: actions.previousStep
        },
        {
          label: 'Next',
          onClick: actions.handleSubmit,
          variant: 'secondary'
        }
      ],
      id: 'step2',
      label: 'Step 2'
    },
    {
      actions: actions => [
        {
          label: 'Cancel',
          onClick: actions.handleOnReject,
          variant: 'danger'
        },
        {
          label: 'Submit form',
          onClick: actions.handleSubmit,
          variant: 'secondary'
        }
      ],
      id: 'step3',
      label: 'Final Step'
    }
  ]

  const submitForm = val => console.log('submit', val)

  const Test = modalProps => (
    <Wizard
      id="deployModal"
      initialValues={{}}
      onSubmit={submitForm}
      stepsConfig={stepsConfig}
      {...modalProps}
    >
      <Wizard.Step>Step1</Wizard.Step>
      <Wizard.Step>Step2</Wizard.Step>
      <Wizard.Step>Step3</Wizard.Step>
    </Wizard>
  )

  const openModal = () =>
    openPopUp(Test)
      .then(() => {})
      .catch(() => {})

  return (
    <div className="project-overview">
      <button onClick={openModal}>Open me</button>
      {modal.isOpen && renderPopupContent()}
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
                      <span key={id} className="link" onClick={() => handlePathExecution(path)}>
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

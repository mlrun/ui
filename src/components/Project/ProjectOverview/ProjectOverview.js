import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import ConfirmDialog from '../../../common/ConfirmDialog/ConfirmDialog'
import CreateFeatureVectorPopUp from '../../../elements/CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import FeatureSetsPanel from '../../FeatureSetsPanel/FeatureSetsPanel'
import Loader from '../../../common/Loader/Loader'
import NoData from '../../../common/NoData/NoData'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'
import RegisterArtifactPopup from '../../RegisterArtifactPopup/RegisterArtifactPopup'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'

import featureStoreActions from '../../../actions/featureStore'
import projectsAction from '../../../actions/projects'
import tableActions from '../../../actions/table'

import { handlePath, getInitialCards } from './ProjectOverview.util'
import { handleFetchProjectError } from '../project.utils'
import { getDateAndTimeByFormat } from '../../../utils/'

import { useDemoMode } from '../../../hooks/demoMode.hook'

import { ReactComponent as ArrowIcon } from '../../../images/arrow.svg'

import './ProjectOverview.scss'

const ProjectOverview = ({
  createFeatureVector,
  fetchProject,
  featureStore,
  history,
  match,
  project,
  removeFeatureStoreError,
  removeNewFeatureSet
}) => {
  const [selectedActionsIndex, setSelectedActionsIndex] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const [modal, setModal] = useState({ isOpen: false, label: '', name: '' })

  const isDemoMode = useDemoMode()

  const { projectName } = match.params

  const cards = useMemo(() => {
    return projectName ? getInitialCards(projectName) : {}
  }, [projectName])

  const handleCreateFeatureVector = featureVectorData => {
    createFeatureVector({
      currentProject: projectName,
      featureVector: {
        kind: 'FeatureVector',
        metadata: {
          name: featureVectorData.name,
          project: projectName,
          tag: featureVectorData.tag,
          labels: featureVectorData.labels
        },
        spec: {
          description: featureVectorData.description,
          features: [],
          label_feature: ''
        },
        status: {}
      },
      groupedFeatures: {
        [projectName]: []
      },
      isNewFeatureVector: true
    })
    handleModalClose()
  }

  const closeFeatureSetPanel = () => {
    handleModalClose()
    removeNewFeatureSet()

    if (featureStore.error) {
      removeFeatureStoreError()
    }
  }

  const getPopUpTemplate = () => {
    switch (modal.name) {
      case 'artifact':
      case 'dataset':
      case 'model':
        return (
          <RegisterArtifactPopup
            artifactKind={modal.name}
            match={match}
            refresh={() => {}}
            setIsPopupOpen={handleModalClose}
            show={modal.isOpen}
            title={modal.label}
          />
        )
      case 'featureSet':
        return (
          <FeatureSetsPanel
            closePanel={closeFeatureSetPanel}
            createFeatureSetSuccess={closeFeatureSetPanel}
            project={projectName}
            show={modal.isOpen}
          />
        )
      case 'featureVector':
        return (
          <CreateFeatureVectorPopUp
            closePopUp={handleModalClose}
            createFeatureVector={handleCreateFeatureVector} // TODO
            show={modal.isOpen}
          />
        )
      default:
        return ''
    }
  }

  const handleModalOpen = ({ label, path }) => {
    return setModal(prev => {
      return {
        ...prev,
        isOpen: true,
        label,
        name: !prev.isOpen ? path.target : ''
      }
    })
  }

  const handleModalClose = () => {
    setModal(prevModal => ({ ...prevModal, label: '', isOpen: false }))
  }

  const handlePathExecution = handlePath(handleModalOpen, history, isDemoMode)

  const handleActionsViewToggle = index => {
    if (selectedActionsIndex === index) {
      return setSelectedActionsIndex(null)
    }
    setSelectedActionsIndex(index)
  }

  useEffect(() => {
    fetchProject(match.params.projectName).catch(error =>
      handleFetchProjectError(error, history, setConfirmData)
    )
  }, [fetchProject, history, match.params.projectName])

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
      {getPopUpTemplate()}
      <div className="project-overview__header">
        <div className="project-overview__header-title">
          {project.data.metadata.name}
          <Tooltip
            template={<TextTooltipTemplate text={project.data.status.state} />}
          >
            <i
              className={`state-${project.data.status.state}-job status-icon`}
            />
          </Tooltip>
        </div>
        <div className="project-overview__header-subtitle">
          <div>
            <span className="project-overview__header-subtitle-name">
              Created:
            </span>
            <span>
              {getDateAndTimeByFormat(
                project.data.metadata.created,
                'YYYY-MM-DD, HH:mm:ss A'
              )}
            </span>
          </div>
          <div>
            <span className="project-overview__header-subtitle-name">
              Owner:
            </span>
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
                    onClick={handlePathExecution}
                    showActions={true}
                  />
                  <ProjectAction
                    actions={actions.slice(3, actions.length)}
                    onClick={handlePathExecution}
                    showActions={selectedActionsIndex === index}
                  />
                </div>
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
                      <span
                        key={id}
                        className="link"
                        onClick={() => handlePathExecution({ id, label, path })}
                      >
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

ProjectOverview.propTypes = {
  match: PropTypes.shape({}).isRequired
}

const actionCreators = {
  createFeatureVector: tableActions.setFeaturesPanelData,
  fetchProject: projectsAction.fetchProject,
  removeNewFeatureSet: featureStoreActions.removeNewFeatureSet,
  removeFeatureStoreError: featureStoreActions.removeFeatureStoreError
}

export default connect(
  ({ featureStore, projectStore }) => ({
    project: projectStore.project,
    featureStore
  }),
  { ...actionCreators }
)(ProjectOverview)

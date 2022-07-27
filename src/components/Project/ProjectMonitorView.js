import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectFunctions from '../../elements/ProjectFunctions/ProjectFunctions'
import ProjectJobs from '../../elements/ProjectJobs/ProjectJobs'
import ProjectSummaryCard from '../../elements/ProjectSummaryCard/ProjectSummaryCard'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import Select from '../../common/Select/Select'
import { ConfirmDialog, RoundedIcon } from 'igz-controls/components'

import { PANEL_CREATE_MODE } from '../../constants'
import { launchIDEOptions } from './project.utils'
import { formatDatetime } from '../../utils'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

import './project.scss'

const ProjectMonitorView = ({
  closeFeatureSetPanel,
  closeFunctionsPanel,
  confirmData,
  createFeatureSetPanelIsOpen,
  createFeatureSetSuccess,
  createFunctionSuccess,
  createNewOptions,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  handleLaunchIDE,
  isNuclioModeDisabled,
  isPopupDialogOpen,
  navigate,
  nuclioStreamsAreEnabled,
  params,
  project,
  projectSummary,
  refresh,
  registerArtifactLink,
  setIsPopupDialogOpen,
  showFunctionsPanel,
  v3ioStreams
}) => {
  return (
    <div className="project-wrapper">
      <div className="project__header">
        <Breadcrumbs />
      </div>
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
              isOpen={confirmData}
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
        <div className="project__content">
          <div className="main-info">
            <div className="main-info__toolbar">
              <div>
                {project.data.status.state && (
                  <div className="general-info__row status-row">
                    <div className="row-value">
                      <span className="row-label">Status:</span>
                      <span className="row-name">{project.data.status.state}</span>
                    </div>
                  </div>
                )}
                <div className="general-info__row created-at-row">
                  <div className="row-value">
                    <span className="row-label">Created at:</span>
                    <span className="row-name">
                      {formatDatetime(new Date(project.data.metadata.created), '-')}
                    </span>
                  </div>
                </div>
              </div>
              <RoundedIcon onClick={refresh} id="refresh" tooltipText="Refresh" className="refresh">
                <RefreshIcon />
              </RoundedIcon>
              <Select
                className="main-info__toolbar-menu launch-menu"
                density="dense"
                hideSelectedOption
                label="Launch IDE"
                onClick={handleLaunchIDE}
                options={launchIDEOptions}
              />
              <Select
                className="main-info__toolbar-menu create-new-menu"
                density="dense"
                hideSelectedOption
                label="Create new"
                options={createNewOptions}
              />
            </div>
            <div className="main-info__statistics-section">
              <ProjectSummaryCard
                counterValue={projectSummary.data.models_count ?? 0}
                link={`/projects/${params.projectName}/models`}
                projectSummary={projectSummary}
                title="Models"
              />
              <ProjectSummaryCard
                counterValue={projectSummary.data.feature_sets_count ?? 0}
                link={`/projects/${params.projectName}/feature-store`}
                projectSummary={projectSummary}
                title="Feature sets"
              />
              <ProjectSummaryCard
                counterValue={projectSummary.data.files_count ?? 0}
                link={`/projects/${params.projectName}/files`}
                projectSummary={projectSummary}
                title="Artifacts"
              />
              {nuclioStreamsAreEnabled && (
                <ProjectSummaryCard
                  counterValue={
                    isNuclioModeDisabled ? 'N/A' : Object.keys(v3ioStreams.data).length ?? 0
                  }
                  link={`/projects/${params.projectName}/monitor${
                    !isNuclioModeDisabled ? '/consumer-groups' : ''
                  }`}
                  projectSummary={v3ioStreams}
                  title="Consumer groups"
                  tooltipText={
                    isNuclioModeDisabled
                      ? 'Consumer group feature works when Nuclio is deployed'
                      : ''
                  }
                />
              )}
            </div>
            <div className="main-info__statistics-section">
              <ProjectJobs />
              <ProjectFunctions />
            </div>
          </div>
        </div>
      )}
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactKind={'model'}
          refresh={() => {
            navigate(registerArtifactLink('model'))
          }}
          setIsPopupOpen={setIsPopupDialogOpen}
          title="Register model"
        />
      )}
      {createFeatureSetPanelIsOpen && (
        <FeatureSetsPanel
          closePanel={closeFeatureSetPanel}
          createFeatureSetSuccess={createFeatureSetSuccess}
          project={params.projectName}
        />
      )}
      {showFunctionsPanel && (
        <FunctionsPanel
          closePanel={closeFunctionsPanel}
          createFunctionSuccess={createFunctionSuccess}
          handleDeployFunctionFailure={handleDeployFunctionFailure}
          handleDeployFunctionSuccess={handleDeployFunctionSuccess}
          mode={PANEL_CREATE_MODE}
          project={params.projectName}
        />
      )}
    </div>
  )
}

ProjectMonitorView.defaultProps = {
  confirmData: null
}

ProjectMonitorView.propTypes = {
  closeFeatureSetPanel: PropTypes.func.isRequired,
  closeFunctionsPanel: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  createFeatureSetPanelIsOpen: PropTypes.bool.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  createNewOptions: PropTypes.array.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  isNuclioModeDisabled: PropTypes.bool.isRequired,
  isPopupDialogOpen: PropTypes.bool.isRequired,
  params: PropTypes.shape({}).isRequired,
  project: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  nuclioStreamsAreEnabled: PropTypes.bool.isRequired,
  projectSummary: PropTypes.object.isRequired,
  setIsPopupDialogOpen: PropTypes.func.isRequired,
  setShowFunctionsPanel: PropTypes.func.isRequired,
  showFunctionsPanel: PropTypes.bool.isRequired,
  v3ioStreams: PropTypes.shape({}).isRequired
}

export default ProjectMonitorView

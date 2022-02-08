import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectFunctions from '../../elements/ProjectFunctions/ProjectFunctions'
import ProjectJobs from '../../elements/ProjectJobs/ProjectJobs'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'
import Select from '../../common/Select/Select'
import ProjectArtifacts from '../../elements/ProjectArtifacts/ProjectArtifacts'
import ProjectLabels from './ProjectLabels/ProjectLabels'
import MembersPopUp from '../../elements/MembersPopUp/MembersPopUp'
import ChangeOwnerPopUp from '../../elements/ChangeOwnerPopUp/ChangeOwnerPopUp'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'

import { DATASETS_TAB, PANEL_CREATE_MODE } from '../../constants'
import { launchIDEOptions } from './project.utils'
import { formatDatetime } from '../../utils'

import { ReactComponent as RefreshIcon } from '../../images/refresh.svg'

import './project.scss'

const ProjectMonitorView = React.forwardRef(
  (
    {
      artifactKind,
      changeMembersCallback,
      changeOwnerCallback,
      closeFeatureSetPanel,
      closeFunctionsPanel,
      confirmData,
      createFeatureSetPanelIsOpen,
      createFeatureSetSuccess,
      createFunctionSuccess,
      createNewOptions,
      handleAddProjectLabel,
      handleDeployFunctionFailure,
      handleDeployFunctionSuccess,
      handleLaunchIDE,
      handleOnKeyDown,
      handleUpdateProjectLabels,
      isDemoMode,
      isNewFunctionPopUpOpen,
      isPopupDialogOpen,
      match,
      membersDispatch,
      membersState,
      projectMembersIsShown,
      projectMembershipIsEnabled,
      projectOwnerIsShown,
      projectSummary,
      refresh,
      setIsNewFunctionPopUpOpen,
      setIsPopupDialogOpen,
      setShowChangeOwner,
      setShowFunctionsPanel,
      setShowManageMembers,
      showChangeOwner,
      showFunctionsPanel,
      showManageMembers,
      visibleChipsMaxLength
    },
    ref
  ) => {
    const project = useSelector(store => store.projectStore.project)
    const history = useHistory()
    const registerArtifactLink = `/projects/${match.params.projectName}/${
      artifactKind === 'model'
        ? 'models'
        : artifactKind === 'dataset'
        ? `feature-store/${DATASETS_TAB}`
        : artifactKind === 'file'
        ? 'files'
        : 'artifacts'
    }`

    return (
      <div className="project-wrapper">
        <div className="project__header">
          <Breadcrumbs match={match} />
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
            <div className="general-info">
              <div className="general-info__main-data"></div>
              <div className="general-info__divider" />
              {project.data.status.state && (
                <div className="general-info__row status-row">
                  <div className="row-value">
                    <span className="row-label">Status:</span>
                    <span className="row-name">
                      {project.data.status.state}
                    </span>
                  </div>
                </div>
              )}
              <div className="general-info__row created-at-row">
                <div className="row-value">
                  <span className="row-label">Created at:</span>
                  <span className="row-name">
                    {formatDatetime(
                      new Date(project.data.metadata.created),
                      '-'
                    )}
                  </span>
                </div>
              </div>
              {projectMembershipIsEnabled && (
                <>
                  {projectMembersIsShown && (
                    <div className="general-info__row owner-row">
                      <div className="row-value">
                        <span className="row-label">Owner:</span>
                        <span className="row-name">
                          {membersState.projectInfo?.owner?.username}
                        </span>
                      </div>
                      <span
                        className="row-action link"
                        onClick={() => setShowChangeOwner(true)}
                      >
                        Change
                      </span>
                    </div>
                  )}
                  {projectOwnerIsShown && (
                    <div className="general-info__row members-row">
                      <div className="row-value">
                        <span className="row-label">Members:</span>
                        <span className="row-name">
                          {membersState.users.length +
                            membersState.userGroups.length}
                        </span>
                      </div>
                      <span
                        className="row-action link"
                        onClick={() => setShowManageMembers(true)}
                      >
                        Manage
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="general-info__divider" />
              <div className="general-info__labels">
                <div className="general-info__labels-text">Labels</div>
                <div className="general-info__labels-wrapper">
                  <ProjectLabels
                    addProjectLabel={handleAddProjectLabel}
                    isEditMode
                    labels={project.data.metadata.labels}
                    updateProjectLabel={handleUpdateProjectLabels}
                    visibleChipsMaxLength={visibleChipsMaxLength}
                  />
                </div>
              </div>
            </div>
            <div className="main-info">
              <div className="main-info__toolbar">
                <RoundedIcon
                  onClick={refresh}
                  id="refresh"
                  tooltipText="Refresh"
                  className="refresh"
                >
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
                <ProjectArtifacts
                  counterValue={projectSummary.data.models_count ?? 0}
                  link={`/projects/${match.params.projectName}/models`}
                  projectSummary={projectSummary}
                  title="Models"
                />
                <ProjectArtifacts
                  counterValue={projectSummary.data.feature_sets_count ?? 0}
                  link={`/projects/${match.params.projectName}/feature-store`}
                  projectSummary={projectSummary}
                  title="Feature sets"
                />
                <ProjectArtifacts
                  counterValue={projectSummary.data.files_count ?? 0}
                  link={`/projects/${match.params.projectName}/files`}
                  projectSummary={projectSummary}
                  title="Artifacts"
                />
              </div>
              <div className="main-info__statistics-section">
                <ProjectJobs match={match} />
                <ProjectFunctions match={match} />
              </div>
            </div>
          </div>
        )}
        {isPopupDialogOpen && (
          <RegisterArtifactPopup
            artifactKind={artifactKind}
            match={match}
            refresh={() => {
              history.push(registerArtifactLink)
            }}
            setIsPopupOpen={setIsPopupDialogOpen}
            title={`Register ${artifactKind}`}
          />
        )}
        {showManageMembers && (
          <MembersPopUp
            changeMembersCallback={changeMembersCallback}
            closePopUp={() => setShowManageMembers(false)}
            membersState={membersState}
            membersDispatch={membersDispatch}
          />
        )}
        {showChangeOwner && (
          <ChangeOwnerPopUp
            changeOwnerCallback={changeOwnerCallback}
            closePopUp={() => setShowChangeOwner(false)}
            projectId={membersState.projectInfo.id}
          />
        )}
        {createFeatureSetPanelIsOpen && (
          <FeatureSetsPanel
            closePanel={closeFeatureSetPanel}
            createFeatureSetSuccess={createFeatureSetSuccess}
            project={match.params.projectName}
          />
        )}
        {isNewFunctionPopUpOpen && (
          <NewFunctionPopUp
            closePopUp={() => setIsNewFunctionPopUpOpen(false)}
            currentProject={match.params.projectName}
            isOpened={isNewFunctionPopUpOpen}
            setFunctionsPanelIsOpen={setShowFunctionsPanel}
          />
        )}
        {showFunctionsPanel && (
          <FunctionsPanel
            closePanel={closeFunctionsPanel}
            createFunctionSuccess={createFunctionSuccess}
            handleDeployFunctionFailure={handleDeployFunctionFailure}
            handleDeployFunctionSuccess={handleDeployFunctionSuccess}
            match={match}
            mode={PANEL_CREATE_MODE}
            project={match.params.projectName}
          />
        )}
      </div>
    )
  }
)

ProjectMonitorView.defaultProps = {
  confirmData: null,
  visibleChipsMaxLength: null
}

ProjectMonitorView.propTypes = {
  artifactKind: PropTypes.string.isRequired,
  changeMembersCallback: PropTypes.func.isRequired,
  changeOwnerCallback: PropTypes.func.isRequired,
  closeFeatureSetPanel: PropTypes.func.isRequired,
  closeFunctionsPanel: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  createFeatureSetPanelIsOpen: PropTypes.bool.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  createNewOptions: PropTypes.array.isRequired,
  handleAddProjectLabel: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleUpdateProjectLabels: PropTypes.func.isRequired,
  isDemoMode: PropTypes.bool.isRequired,
  isNewFunctionPopUpOpen: PropTypes.bool.isRequired,
  isPopupDialogOpen: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  projectMembersIsShown: PropTypes.bool.isRequired,
  projectMembershipIsEnabled: PropTypes.bool.isRequired,
  projectOwnerIsShown: PropTypes.bool.isRequired,
  projectSummary: PropTypes.object.isRequired,
  setIsNewFunctionPopUpOpen: PropTypes.func.isRequired,
  setIsPopupDialogOpen: PropTypes.func.isRequired,
  setShowChangeOwner: PropTypes.func.isRequired,
  setShowFunctionsPanel: PropTypes.func.isRequired,
  setShowManageMembers: PropTypes.func.isRequired,
  showChangeOwner: PropTypes.bool,
  showFunctionsPanel: PropTypes.bool.isRequired,
  showManageMembers: PropTypes.bool,
  visibleChipsMaxLength: PropTypes.number
}

export default ProjectMonitorView

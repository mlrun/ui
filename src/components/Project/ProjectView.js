import React from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FeatureSetsPanel from '../FeatureSetsPanel/FeatureSetsPanel'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import ProjectFunctions from '../../elements/ProjectFunctions/ProjectFunctions'
import ProjectJobs from '../../elements/ProjectJobs/ProjectJobs'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import Select from '../../common/Select/Select'
import ProjectArtifacts from '../../elements/ProjectArtifacts/ProjectArtifacts'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import ChipCell from '../../common/ChipCell/ChipCell'
import ProjectName from './ProjectName/ProjectName'
import ProjectDescription from './ProjectDescription/ProjectDescription'
import ProjectGoals from './ProjectGoals/ProjectGoals'
import ProjectLinks from './ProjectLinks/ProjectLinks'
import MembersPopUp from '../../elements/MembersPopUp/MembersPopUp'
import ChangeOwnerPopUp from '../../elements/ChangeOwnerPopUp/ChangeOwnerPopUp'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import NewFunctionPopUp from '../../elements/NewFunctionPopUp/NewFunctionPopUp'

import { DATASETS_TAB, PANEL_CREATE_MODE } from '../../constants'
import { launchIDEOptions } from './project.utils'
import { formatDatetime } from '../../utils'

import { ReactComponent as Settings } from '../../images/settings.svg'
import { ReactComponent as Refresh } from '../../images/refresh.svg'

import './project.scss'

const ProjectView = React.forwardRef(
  (
    {
      artifactKind,
      changeMembersCallback,
      changeOwnerCallback,
      closeFeatureSetPanel,
      closeFunctionsPanel,
      createFeatureSetPanelIsOpen,
      createFeatureSetSuccess,
      createFunctionSuccess,
      createNewOptions,
      editProject,
      handleAddProjectLabel,
      handleDeployFunctionFailure,
      handleDeployFunctionSuccess,
      handleEditProject,
      handleLaunchIDE,
      handleOnChangeProject,
      handleOnKeyDown,
      handleUpdateProjectLabels,
      isNewFunctionPopUpOpen,
      isPopupDialogOpen,
      links,
      match,
      membersDispatch,
      membersState,
      projectCounters,
      projectLabels,
      projectMembersIsShown,
      projectMembershipIsEnabled,
      projectOwnerIsShown,
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
          <div className=" project__error-container">
            <h1>{project.error}</h1>
          </div>
        ) : isEmpty(project.data) ? (
          <NoData />
        ) : (
          <div className="project__content">
            <div className="general-info">
              <div className="general-info__main-data">
                <div className="general-info__main-data-wrapper">
                  <ProjectName
                    editNameData={editProject.name}
                    handleOnChangeProject={handleOnChangeProject}
                    handleOnKeyDown={handleOnKeyDown}
                    projectName={project.data.metadata.name}
                    ref={ref}
                  />
                  <Link
                    className="general-info__settings"
                    to={`/projects/${match.params.projectName}/settings`}
                  >
                    <Tooltip template={<TextTooltipTemplate text="Settings" />}>
                      <Settings />
                    </Tooltip>
                  </Link>
                </div>
                <ProjectDescription
                  editDescriptionData={editProject.description}
                  handleEditProject={handleEditProject}
                  handleOnChangeProject={handleOnChangeProject}
                  handleOnKeyDown={handleOnKeyDown}
                  projectDescription={project.data.spec.description ?? ''}
                  ref={ref}
                />
                <ProjectGoals
                  editGoalsData={editProject.goals}
                  handleEditProject={handleEditProject}
                  handleOnChangeProject={handleOnChangeProject}
                  handleOnKeyDown={handleOnKeyDown}
                  projectGoals={project.data.spec.goals ?? ''}
                  ref={ref}
                />
              </div>
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
                  <ChipCell
                    addChip={handleAddProjectLabel}
                    editChip={handleUpdateProjectLabels}
                    elements={projectLabels}
                    isEditMode={true}
                    removeChip={handleUpdateProjectLabels}
                    visibleChipsMaxLength={visibleChipsMaxLength}
                  />
                </div>
              </div>
              <div className="general-info__divider" />
              <ProjectLinks links={links} />
            </div>
            <div className="main-info">
              <div className="main-info__toolbar">
                <Tooltip
                  className="refresh"
                  template={<TextTooltipTemplate text="Refresh" />}
                >
                  <button onClick={refresh} id="refresh">
                    <Refresh />
                  </button>
                </Tooltip>
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
                  counterValue={projectCounters.data.models_count ?? 0}
                  link={`/projects/${match.params.projectName}/models`}
                  projectCounters={projectCounters}
                  title="Models"
                />
                <ProjectArtifacts
                  counterValue={projectCounters.data.feature_sets_count ?? 0}
                  link={`/projects/${match.params.projectName}/feature-store`}
                  projectCounters={projectCounters}
                  title="Feature sets"
                />
                <ProjectArtifacts
                  counterValue={projectCounters.data.files_count ?? 0}
                  link={`/projects/${match.params.projectName}/files`}
                  projectCounters={projectCounters}
                  title="Files"
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

ProjectView.defaultProps = {
  visibleChipsMaxLength: null
}

ProjectView.propTypes = {
  artifactKind: PropTypes.string.isRequired,
  changeMembersCallback: PropTypes.func.isRequired,
  changeOwnerCallback: PropTypes.func.isRequired,
  closeFeatureSetPanel: PropTypes.func.isRequired,
  closeFunctionsPanel: PropTypes.func.isRequired,
  createFeatureSetPanelIsOpen: PropTypes.bool.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  createNewOptions: PropTypes.array.isRequired,
  editProject: PropTypes.shape({}).isRequired,
  handleAddProjectLabel: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleUpdateProjectLabels: PropTypes.func.isRequired,
  isNewFunctionPopUpOpen: PropTypes.bool.isRequired,
  isPopupDialogOpen: PropTypes.bool.isRequired,
  links: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  projectCounters: PropTypes.object.isRequired,
  projectLabels: PropTypes.array.isRequired,
  projectMembersIsShown: PropTypes.bool.isRequired,
  projectMembershipIsEnabled: PropTypes.bool.isRequired,
  projectOwnerIsShown: PropTypes.bool.isRequired,
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

export default ProjectView

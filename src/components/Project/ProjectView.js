import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'

import { DATASETS_TAB } from '../../constants'
import { launchIDEOptions } from './project.utils'
import { groupByUniqName } from '../../utils/groupByUniqName'
import { formatDatetime } from '../../utils'

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
import ProjectSource from './ProjectSource/ProjectSource'
import ProjectLinks from './ProjectLinks/ProjectLinks'
import MembersPopUp from '../../elements/MembersPopUp/MembersPopUp'
import ChangeOwnerPopUp from '../../elements/ChangeOwnerPopUp/ChangeOwnerPopUp'

import { ReactComponent as Settings } from '../../images/settings.svg'
import { ReactComponent as Refresh } from '../../images/refresh.svg'

const ProjectView = React.forwardRef(
  (
    {
      artifactKind,
      changeMembersCallback,
      changeOwnerCallback,
      closeFeatureSetPanel,
      createFeatureSetPanelIsOpen,
      createFeatureSetSuccess,
      createNewOptions,
      editProject,
      fetchProjectFeatureSets,
      fetchProjectFiles,
      fetchProjectModels,
      frontendSpec,
      handleAddProjectLabel,
      handleEditProject,
      handleLaunchIDE,
      handleOnChangeProject,
      handleOnKeyDown,
      handleUpdateProjectLabels,
      isPopupDialogOpen,
      links,
      match,
      membersDispatch,
      membersState,
      projectLabels,
      refresh,
      setIsPopupDialogOpen,
      setShowChangeOwner,
      setShowManageMembers,
      showChangeOwner,
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
      <>
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
                  <Settings className="general-info__settings" />
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
              {frontendSpec?.feature_flags?.project_membership ===
                'enabled' && (
                <>
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
                </>
              )}
              <div className="general-info__divider" />
              <ProjectSource
                editSourceData={editProject.source}
                handleEditProject={handleEditProject}
                handleOnChangeProject={handleOnChangeProject}
                handleOnKeyDown={handleOnKeyDown}
                projectSource={project.data.spec.source ?? ''}
                ref={ref}
              />
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
                  artifacts={groupByUniqName(project.models, 'db_key')}
                  fetchArtifacts={fetchProjectModels}
                  link={`/projects/${match.params.projectName}/models`}
                  match={match}
                  title="Models"
                />
                <ProjectArtifacts
                  artifacts={groupByUniqName(
                    project.featureSets,
                    'metadata.name'
                  )}
                  fetchArtifacts={fetchProjectFeatureSets}
                  link={`/projects/${match.params.projectName}/feature-store`}
                  match={match}
                  title="Feature sets"
                />
                <ProjectArtifacts
                  artifacts={groupByUniqName(project.files, 'db_key')}
                  fetchArtifacts={fetchProjectFiles}
                  link={`/projects/${match.params.projectName}/files`}
                  match={match}
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
      </>
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
  createFeatureSetPanelIsOpen: PropTypes.bool.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  createNewOptions: PropTypes.array.isRequired,
  editProject: PropTypes.shape({}).isRequired,
  fetchProjectFeatureSets: PropTypes.func.isRequired,
  fetchProjectFiles: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  handleAddProjectLabel: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  handleUpdateProjectLabels: PropTypes.func.isRequired,
  isPopupDialogOpen: PropTypes.bool.isRequired,
  links: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  projectLabels: PropTypes.array.isRequired,
  setIsPopupDialogOpen: PropTypes.func.isRequired,
  setShowChangeOwner: PropTypes.func.isRequired,
  setShowManageMembers: PropTypes.func.isRequired,
  showChangeOwner: PropTypes.bool,
  showManageMembers: PropTypes.bool,
  visibleChipsMaxLength: PropTypes.number
}

export default ProjectView

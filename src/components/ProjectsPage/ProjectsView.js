import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import NoData from '../../common/NoData/NoData'
import YamlModal from '../../common/YamlModal/YamlModal'
import Notification from '../../common/Notification/Notification'

import { pageData } from './projectsData'

import './projects.scss'

const ProjectsView = ({
  actionsMenu,
  archiveProject,
  closeNewProjectPopUp,
  closeArchiveProjectPopUp,
  closeDeleteNonEmtpyProjectPopUp,
  convertedYaml,
  convertToYaml,
  createProject,
  deleteNonEmptyProject,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchProjectFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  filteredProjects,
  handleArchiveProject,
  handleCreateProject,
  handleDeleteNonEmptyProject,
  isEmptyValue,
  match,
  nuclioStore,
  projectStore,
  projectsStates,
  removeNewProjectError,
  selectedProjectsState,
  setCreateProject,
  setNewProjectDescription,
  setNewProjectName,
  setSelectedProjectsState
}) => {
  const projectsClassNames = classnames(
    'projects',
    (createProject || convertedYaml.length > 0) && 'projects-modal_opened'
  )

  return (
    <div className={projectsClassNames}>
      {projectStore.loading && <Loader />}
      {createProject && (
        <PopUpDialog
          headerText="Create new project"
          closePopUp={closeNewProjectPopUp}
        >
          <div className="pop-up-dialog__form">
            <Input
              className="pop-up-dialog__form-input"
              floatingLabel
              label="Name"
              onChange={name => setNewProjectName(name)}
              required={
                isEmptyValue && projectStore.newProject.name.length === 0
              }
              requiredText="Name is required"
              type="text"
              value={projectStore.newProject.name}
            />
            <Input
              className="pop-up-dialog__form-input"
              floatingLabel
              label="Description"
              onChange={description => setNewProjectDescription(description)}
              type="text"
              value={projectStore.newProject.description}
            />
          </div>
          <div className="pop-up-dialog__footer-container">
            {projectStore.newProject.error && (
              <ErrorMessage
                closeError={() => {
                  if (projectStore.newProject.error) {
                    removeNewProjectError()
                  }
                }}
                message={projectStore.newProject.error}
              />
            )}
            <button
              className="btn_default pop-up-dialog__btn_cancel"
              onClick={closeNewProjectPopUp}
            >
              Cancel
            </button>
            <button className="btn_primary" onClick={handleCreateProject}>
              Create
            </button>
          </div>
        </PopUpDialog>
      )}
      {archiveProject && (
        <PopUpDialog
          headerText="Archive project"
          closePopUp={closeArchiveProjectPopUp}
        >
          <div>
            Note that moving a project to archive doesn't stop it from consuming
            resources. We recommend that before setting the project as archive
            you'll remove scheduled jobs and suspend Nuclio functions.
          </div>
          <div className="pop-up-dialog__footer-container">
            <button
              className="btn_default pop-up-dialog__btn_cancel"
              onClick={closeArchiveProjectPopUp}
            >
              Cancel
            </button>
            <button className="btn_primary" onClick={handleArchiveProject}>
              Archive
            </button>
          </div>
        </PopUpDialog>
      )}
      {deleteNonEmptyProject && (
        <PopUpDialog
          headerText={`Delete project "${deleteNonEmptyProject?.metadata?.name}"?`}
          closePopUp={closeDeleteNonEmtpyProjectPopUp}
        >
          <div>
            The project is not empty. Deleting it will also delete all of its
            resources, such as jobs, artifacts, and features.
          </div>
          <div className="pop-up-dialog__footer-container">
            <button
              className="btn_default pop-up-dialog__btn_cancel"
              onClick={closeDeleteNonEmtpyProjectPopUp}
            >
              Cancel
            </button>
            <button
              className="btn_primary"
              onClick={handleDeleteNonEmptyProject}
            >
              Delete
            </button>
          </div>
        </PopUpDialog>
      )}
      <div className="projects__header">
        <Breadcrumbs match={match} />
        <PageActionsMenu
          match={match}
          onClick={() => setCreateProject(true)}
          pageData={pageData}
        />
      </div>
      <div className="projects__wrapper">
        {projectStore.projects.length > 0 && !projectStore.error ? (
          <>
            <div className="projects-content-header">
              <Select
                onClick={setSelectedProjectsState}
                options={projectsStates}
                selectedId={selectedProjectsState}
                className="project-types-select"
                withoutBorder
              />
            </div>
            <div className="projects-content">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => {
                  return (
                    <ProjectCard
                      actionsMenu={actionsMenu}
                      fetchProjectDataSets={fetchProjectDataSets}
                      fetchProjectFailedJobs={fetchProjectFailedJobs}
                      fetchProjectFunctions={fetchProjectFunctions}
                      fetchProjectModels={fetchProjectModels}
                      fetchProjectRunningJobs={fetchProjectRunningJobs}
                      key={project.id || project.metadata.name}
                      nuclioStore={nuclioStore}
                      project={project}
                      projectStore={projectStore}
                    />
                  )
                })
              ) : selectedProjectsState === 'archived' ? (
                <div className="no-filtered-data">No archived projects.</div>
              ) : null}
            </div>
          </>
        ) : projectStore.loading ? null : (
          <NoData />
        )}
      </div>
      <YamlModal
        convertedYaml={convertedYaml}
        toggleConvertToYaml={convertToYaml}
      />
      <Notification />
    </div>
  )
}

ProjectsView.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
  archiveProject: PropTypes.oneOfType([
    PropTypes.shape({}, PropTypes.instanceOf(null))
  ]),
  closeArchiveProjectPopUp: PropTypes.func.isRequired,
  closeDeleteNonEmtpyProjectPopUp: PropTypes.func.isRequired,
  closeNewProjectPopUp: PropTypes.func.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  convertToYaml: PropTypes.func.isRequired,
  createProject: PropTypes.bool.isRequired,
  deleteNonEmptyProject: PropTypes.oneOfType([
    PropTypes.shape({}, PropTypes.instanceOf(null))
  ]),
  fetchProjectDataSets: PropTypes.func.isRequired,
  fetchProjectFailedJobs: PropTypes.func.isRequired,
  fetchProjectFunctions: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  fetchProjectRunningJobs: PropTypes.func.isRequired,
  filteredProjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleArchiveProject: PropTypes.func.isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  handleDeleteNonEmptyProject: PropTypes.func.isRequired,
  isEmptyValue: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  nuclioStore: PropTypes.shape({}).isRequired,
  projectStore: PropTypes.shape({}).isRequired,
  projectsStates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  selectedProjectsState: PropTypes.string.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setNewProjectDescription: PropTypes.func.isRequired,
  setNewProjectName: PropTypes.func.isRequired,
  setSelectedProjectsState: PropTypes.func.isRequired
}

export default ProjectsView

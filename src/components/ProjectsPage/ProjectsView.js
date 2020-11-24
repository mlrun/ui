import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Input from '../../common/Input/Input'
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
  closePopUp,
  convertedYaml,
  convertToYaml,
  createProject,
  fetchNuclioFunctions,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchProjectFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  handleCreateProject,
  isEmptyValue,
  match,
  projectStore,
  removeNewProjectError,
  setCreateProject,
  setNewProjectDescription,
  setNewProjectName
}) => {
  const projectsClassNames = classnames(
    'projects',
    (createProject || convertedYaml.length > 0) && 'projects-modal_opened'
  )

  return (
    <div className={projectsClassNames}>
      {projectStore.loading && <Loader />}
      {createProject && (
        <PopUpDialog headerText="Create new project" closePopUp={closePopUp}>
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
              onClick={closePopUp}
            >
              Cancel
            </button>
            <button
              className="btn_primary btn_success"
              onClick={handleCreateProject}
            >
              Create
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
        {projectStore.projects.length !== 0 || !projectStore.error ? (
          projectStore.projects.map(project => {
            return (
              <ProjectCard
                actionsMenu={actionsMenu}
                fetchNuclioFunctions={fetchNuclioFunctions}
                fetchProjectDataSets={fetchProjectDataSets}
                fetchProjectFailedJobs={fetchProjectFailedJobs}
                fetchProjectFunctions={fetchProjectFunctions}
                fetchProjectModels={fetchProjectModels}
                fetchProjectRunningJobs={fetchProjectRunningJobs}
                key={project.id || project.name}
                project={project}
              />
            )
          })
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
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  closePopUp: PropTypes.func.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  convertToYaml: PropTypes.func.isRequired,
  createProject: PropTypes.bool.isRequired,
  fetchNuclioFunctions: PropTypes.func.isRequired,
  fetchProjectDataSets: PropTypes.func.isRequired,
  fetchProjectFailedJobs: PropTypes.func.isRequired,
  fetchProjectFunctions: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  fetchProjectRunningJobs: PropTypes.func.isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  isEmptyValue: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  projectStore: PropTypes.shape({}).isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setNewProjectDescription: PropTypes.func.isRequired,
  setNewProjectName: PropTypes.func.isRequired
}

export default ProjectsView

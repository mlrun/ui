import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import projectsAction from '../../actions/projects'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Input from '../../common/Input/Input'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import pageData from './projectsData'

import './projects.scss'

const Projects = ({
  createNewProject,
  projectStore,
  fetchProjects,
  match,
  removeNewProject,
  removeProjectError,
  setNewProjectDescription,
  setNewProjectName
}) => {
  const [createProject, setCreateProject] = useState(false)
  const [isEmptyValue, setIsEmptyValue] = useState(false)
  const projectsClassNames = classnames(
    'projects',
    createProject && 'projects-modal_opened'
  )

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateProject = () => {
    if (projectStore.newProject.name.length === 0) {
      return setIsEmptyValue(true)
    } else if (isEmptyValue) {
      setIsEmptyValue(false)
    }

    createNewProject({
      name: projectStore.newProject.name,
      description: projectStore.newProject.description
    }).then(result => {
      if (result) {
        setCreateProject(false)
        removeNewProject()
        fetchProjects()
      }
    })
  }

  const closePopUp = useCallback(() => {
    if (projectStore.error) {
      removeProjectError()
    }

    removeNewProject()
    setIsEmptyValue(false)
    setCreateProject(false)
  }, [projectStore.error, removeNewProject, removeProjectError])

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
            {projectStore.error && (
              <ErrorMessage
                closeError={() => {
                  if (projectStore.error) {
                    removeProjectError()
                  }
                }}
                message={projectStore.error}
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
          page={pageData.page}
        />
      </div>
      <div className="projects__wrapper">
        {projectStore.projects.length !== 0 || !projectStore.error ? (
          projectStore.projects.map(project => {
            return (
              <ProjectCard key={project.id || project.name} project={project} />
            )
          })
        ) : projectStore.loading ? null : (
          <NoData />
        )}
      </div>
    </div>
  )
}

Projects.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(projectStore => projectStore, projectsAction)(Projects)

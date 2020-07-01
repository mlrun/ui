import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import projectsAction from '../../actions/projects'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import NoData from '../../common/NoData/NoData'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Input from '../../common/Input/Input'

import pageData from './projectsData'

import './projects.scss'

const Projects = ({
  createNewProject,
  projectStore,
  fetchProjects,
  match,
  removeNewProject,
  setNewProjectDescription,
  setNewProjectName
}) => {
  const [createProject, setCreateProject] = useState(false)
  const [isEmptyValue, setIsEmptyValue] = useState(false)

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

  return (
    <div className="projects">
      {projectStore.loading && <Loader />}
      {createProject && (
        <PopUpDialog
          actionBtnText="Create"
          closePopUp={() => setCreateProject(false)}
          handleSuccess={handleCreateProject}
          headerText="Create new project"
          message={projectStore.error}
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

export default connect(projectStore => projectStore, projectsAction)(Projects)

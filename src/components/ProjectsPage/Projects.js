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

const Projects = ({ projectStore, fetchProjects, match }) => {
  const [createNewProject, setCreateNewProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="projects">
      {projectStore.loading && <Loader />}
      {createNewProject && (
        <PopUpDialog
          actionBtnText="Create"
          closePopUp={() => setCreateNewProject(false)}
          headerText="Create new project"
        >
          <div className="pop-up-dialog__form">
            <Input
              className="pop-up-dialog__form-input"
              floatingLabel
              label="Name"
              onChange={name =>
                setNewProject({
                  ...newProject,
                  name
                })
              }
              type="text"
              value={newProject.name}
            />
            <Input
              className="pop-up-dialog__form-input"
              floatingLabel
              label="Description"
              onChange={description =>
                setNewProject({
                  ...newProject,
                  description
                })
              }
              type="text"
              value={newProject.description}
            />
          </div>
        </PopUpDialog>
      )}
      <div className="projects__header">
        <Breadcrumbs match={match} />
        <PageActionsMenu
          match={match}
          onClick={() => setCreateNewProject(true)}
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

import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import projectsAction from '../../actions/projects'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'

import './projects.scss'

const Projects = ({ projects, error, fetchProjects, match }) => {
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <>
      <div className="breadcrumbs_container">
        <Breadcrumbs match={match} />
      </div>
      <div className="projects_wrapper">
        {projects.length !== 0 ? (
          projects.map(project => {
            return <ProjectCard key={project.id} project={project} />
          })
        ) : error.length === 0 ? (
          <Loader />
        ) : (
          <span className="error_container">
            <h1>No projects found</h1>
          </span>
        )}
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  projects: state.projectStore.projects,
  error: state.projectStore.error
})

export default connect(mapStateToProps, projectsAction)(Projects)

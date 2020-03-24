import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import projectsAction from '../../actions/projects'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import NoData from '../../common/NoData/NoData'

import './projects.scss'

const Projects = ({ projectStore, fetchProjects, match }) => {
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <>
      <div className="breadcrumbs_container">
        <Breadcrumbs match={match} />
      </div>
      <div className="projects_wrapper">
        {projectStore.loading && <Loader />}
        {projectStore.projects.length !== 0 || projectStore.error ? (
          projectStore.projects.map(project => {
            return <ProjectCard key={project.id} project={project} />
          })
        ) : projectStore.loading ? null : (
          <NoData />
        )}
      </div>
    </>
  )
}

export default connect(projectStore => projectStore, projectsAction)(Projects)

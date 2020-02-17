import React, { useEffect } from 'react'
import projectsAction from '../../actions/projects'
import Breadcrums from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import artifact from '../../images/file-chart.png'
import jobs from '../../images/check-all.png'
import './projects.scss'
const Projects = ({ projects, fetchProjects, match }) => {
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])
  return (
    <>
      <div className="breadcrums_container">
        <Breadcrums match={match}></Breadcrums>
      </div>
      <div className="projects_wrapper">
        {projects.length !== 0 ? (
          projects.map(project => {
            return (
              <div key={project} className="project_card">
                <div className="project_card_header">{project}</div>
                <div className="project_card_links">
                  <Link to={`/projects/${project}/jobs`}>
                    <img src={jobs} alt="jobs" />
                    <div>Jobs</div>
                  </Link>
                  <Link to={`/projects/${project}/artifacts`}>
                    <img src={artifact} alt="artifact" />
                    <div>Artifacts</div>
                  </Link>
                </div>
              </div>
            )
          })
        ) : (
          <Loader />
        )}
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  projects: state.projectStore.projects
})

export default connect(mapStateToProps, projectsAction)(Projects)

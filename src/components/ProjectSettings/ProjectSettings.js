import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import NoData from '../../common/NoData/NoData'
import Loader from '../../common/Loader/Loader'

import projectsAction from '../../actions/projects'

import './projectSettings.scss'

const ProjectSettings = ({
  fetchProject,
  fetchProjectSecrets,
  match,
  projectStore,
  removeProjectData
}) => {
  const fetchProjectData = useCallback(() => {
    fetchProject(match.params.projectName)
  }, [fetchProject, match.params.projectName])

  useEffect(() => {
    fetchProjectData()

    return () => {
      removeProjectData()
    }
  }, [fetchProjectData, removeProjectData])

  return (
    <div className="settings">
      <div className="settings__header">
        <Breadcrumbs match={match} />
      </div>
      {projectStore.project.loading ? (
        <Loader />
      ) : projectStore.project.error ? (
        <div className=" project__error-container">
          <h1>{projectStore.project.error}</h1>
        </div>
      ) : isEmpty(projectStore.project.data) ? (
        <NoData />
      ) : (
        <div className="settings__content">
          <ProjectSettingsGeneral match={match} />
          <ProjectSettingsSecrets match={match} />
        </div>
      )}
    </div>
  )
}

ProjectSettings.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ projectStore }) => ({
    projectStore
  }),
  {
    ...projectsAction
  }
)(ProjectSettings)

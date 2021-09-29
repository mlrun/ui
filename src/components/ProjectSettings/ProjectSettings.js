import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import SettingsGeneral from '../../elements/SettingsGeneral/SettingsGeneral'
import SettingsSecrets from '../../elements/SettingsSecrets/SettingsSecrets'
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

  const fetchSecrets = useCallback(() => {
    fetchProjectSecrets(match.params.projectName)
  }, [fetchProjectSecrets, match.params.projectName])

  useEffect(() => {
    fetchProjectData()
    fetchSecrets()

    return () => {
      removeProjectData()
    }
  }, [fetchProjectData, fetchSecrets, removeProjectData])

  return (
    <div className="settings-wrapper">
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
          <SettingsGeneral match={match} />
          <SettingsSecrets match={match} />
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

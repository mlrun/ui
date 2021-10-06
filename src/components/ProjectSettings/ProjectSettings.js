import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'

import projectsAction from '../../actions/projects'
import { PROJECTS_SETTINGS_GENERAL_TAB } from '../../constants'
import { page, tabs } from './projectSettings.util'

import './projectSettings.scss'

const ProjectSettings = ({ match }) => {
  const location = useLocation()

  return (
    <div className="settings">
      <div className="settings__header">
        <Breadcrumbs match={match} />
      </div>
      <div className="settings__content">
        <ContentMenu
          activeTab={match.params.pageTab}
          location={location}
          match={match}
          screen={page}
          tabs={tabs}
        />
        {match.params.pageTab === PROJECTS_SETTINGS_GENERAL_TAB ? (
          <ProjectSettingsGeneral match={match} />
        ) : (
          <ProjectSettingsSecrets match={match} />
        )}
      </div>
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

import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectCardView from './ProjectCardView'

import { generateProjectStatistic } from './projectCard.util'
import projectsAction from '../../actions/projects'
import { ACTIONS_MENU } from '../../types'

const ProjectCard = ({
  actionsMenu,
  nuclioStore,
  project,
  projectStore,
  projectSummary
}) => {
  const [
    fetchNuclioFunctionsFailure,
    setFetchNuclioFunctionsFailure
  ] = useState(false)

  const actionsMenuRef = React.createRef()

  useEffect(() => {
    setFetchNuclioFunctionsFailure(
      nuclioStore.error && !nuclioStore.functions[project.metadata.name]
    )
  }, [project.metadata.name, nuclioStore.functions, nuclioStore.error])

  const statistics = useMemo(() => {
    return generateProjectStatistic(
      projectSummary,
      projectStore.projectsSummary.error,
      projectStore.projectsSummary.loading,
      fetchNuclioFunctionsFailure,
      nuclioStore.functions[project.metadata.name],
      nuclioStore.loading
    )
  }, [
    fetchNuclioFunctionsFailure,
    nuclioStore.functions,
    nuclioStore.loading,
    project.metadata.name,
    projectStore.projectsSummary.error,
    projectStore.projectsSummary.loading,
    projectSummary
  ])

  return (
    <ProjectCardView
      actionsMenu={actionsMenu}
      project={project}
      statistics={statistics}
      ref={actionsMenuRef}
    />
  )
}

ProjectCard.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  project: PropTypes.shape({}).isRequired
}

export default connect(
  (projectStore, nuclioStore) => ({
    ...projectStore,
    ...nuclioStore
  }),
  {
    ...projectsAction
  }
)(ProjectCard)

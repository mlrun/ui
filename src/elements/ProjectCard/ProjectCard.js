import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectCardView from './ProjectCardView'

import { generateProjectStatistic } from './projectCard.util'
import projectsAction from '../../actions/projects'

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
  const [showActionsList, setShowActionsList] = useState(false)

  const actionsMenuRef = React.createRef()

  useEffect(() => {
    setFetchNuclioFunctionsFailure(
      nuclioStore.error && !nuclioStore.functions[project.metadata.name]
    )
  }, [project.metadata.name, nuclioStore.functions, nuclioStore.error])

  const closeActionsMenu = useCallback(
    event => {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target) &&
        showActionsList
      ) {
        setShowActionsList(false)
      }
    },
    [actionsMenuRef, showActionsList]
  )

  useEffect(() => {
    window.addEventListener('click', closeActionsMenu)

    return () => {
      window.removeEventListener('click', closeActionsMenu)
    }
  }, [closeActionsMenu])

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
      setShowActionsList={setShowActionsList}
      showActionsList={showActionsList}
      statistics={statistics}
      ref={actionsMenuRef}
    />
  )
}

ProjectCard.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
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

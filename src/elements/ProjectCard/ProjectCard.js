import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'

import ProjectCardView from './ProjectCardView'

import { generateProjectStatistic } from './projectCard.util'
import projectsAction from '../../actions/projects'

const ProjectCard = ({
  actionsMenu,
  fetchProjectFeatureSets,
  fetchProjectFailedJobs,
  fetchProjectFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  nuclioStore,
  project,
  projectStore
}) => {
  const [failedJobs, setFailedJobs] = useState([])
  const [featureSets, setFeatureSets] = useState([])
  const [fetchFailedJobsFailure, setFetchFailedJobsFailure] = useState(false)
  const [fetchFeatureSetsFailure, setFetchFeatureSetsFailure] = useState(false)
  const [fetchFunctionsFailure, setFetchFunctionsFailure] = useState(false)
  const [
    fetchNuclioFunctionsFailure,
    setFetchNuclioFunctionsFailure
  ] = useState(false)
  const [fetchModelsFailure, setFetchModelsFailure] = useState(false)
  const [fetchRunningJobsFailure, setFetchRunningJobsFailure] = useState(false)
  const [functions, setFunctions] = useState([])
  const [models, setModels] = useState([])
  const [runningJobs, setRunningJobs] = useState([])
  const [showActionsList, setShowActionsList] = useState(false)
  const [source] = useState(axios.CancelToken.source())

  const actionsMenuRef = React.createRef()

  useEffect(() => {
    fetchProjectRunningJobs(project.metadata.name, source.token)
      .then(jobs => {
        if (fetchRunningJobsFailure) {
          setFetchRunningJobsFailure(false)
        }

        setRunningJobs(jobs)
      })
      .catch(() => {
        setFetchRunningJobsFailure(true)
      })
    fetchProjectFailedJobs(project.metadata.name, source.token)
      .then(jobs => {
        if (fetchFailedJobsFailure) {
          setFetchFailedJobsFailure(false)
        }

        setFailedJobs(jobs)
      })
      .catch(() => setFetchFailedJobsFailure(true))
    fetchProjectModels(project.metadata.name, source.token)
      .then(models => {
        if (fetchModelsFailure) {
          setFetchModelsFailure(false)
        }

        setModels(models)
      })
      .catch(() => setFetchModelsFailure(true))
    fetchProjectFeatureSets(project.metadata.name, source.token)
      .then(featureSets => {
        if (fetchFeatureSetsFailure) {
          setFetchFeatureSetsFailure(false)
        }

        setFeatureSets(featureSets)
      })
      .catch(() => setFetchFeatureSetsFailure(true))
    fetchProjectFunctions(project.metadata.name, source.token)
      .then(funcs => {
        if (fetchFunctionsFailure) {
          setFetchFunctionsFailure(false)
        }

        setFunctions(funcs)
      })
      .catch(() => setFetchFunctionsFailure(true))
  }, [
    fetchFailedJobsFailure,
    fetchFeatureSetsFailure,
    fetchFunctionsFailure,
    fetchModelsFailure,
    fetchNuclioFunctionsFailure,
    fetchProjectFailedJobs,
    fetchProjectFeatureSets,
    fetchProjectFunctions,
    fetchProjectModels,
    fetchProjectRunningJobs,
    fetchRunningJobsFailure,
    project.metadata.name,
    source.token
  ])

  useEffect(() => {
    return () => {
      source.cancel('canceled')
    }
  }, [source])

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
      failedJobs,
      projectStore.project.failedJobs.loading,
      featureSets,
      projectStore.project.featureSets.loading,
      fetchFailedJobsFailure,
      fetchFeatureSetsFailure,
      fetchFunctionsFailure,
      fetchModelsFailure,
      fetchNuclioFunctionsFailure,
      fetchRunningJobsFailure,
      functions,
      projectStore.project.functions.loading,
      models,
      projectStore.project.models.loading,
      nuclioStore.functions[project.metadata.name],
      nuclioStore.loading,
      runningJobs,
      projectStore.project.runningJobs.loading
    )
  }, [
    failedJobs,
    featureSets,
    fetchFailedJobsFailure,
    fetchFeatureSetsFailure,
    fetchFunctionsFailure,
    fetchModelsFailure,
    fetchNuclioFunctionsFailure,
    fetchRunningJobsFailure,
    functions,
    models,
    nuclioStore.functions,
    nuclioStore.loading,
    project.metadata.name,
    projectStore.project.failedJobs.loading,
    projectStore.project.featureSets.loading,
    projectStore.project.functions.loading,
    projectStore.project.models.loading,
    projectStore.project.runningJobs.loading,
    runningJobs
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

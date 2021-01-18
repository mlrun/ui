import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import ProjectCardView from './ProjectCardView'

import { generateProjectStatistic } from './projectCard.util'

const ProjectCard = ({
  actionsMenu,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchProjectFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  nuclioStore,
  project,
  projectStore
}) => {
  const [failedJobs, setFailedJobs] = useState([])
  const [features, setFeatures] = useState([])
  const [fetchFailedJobsFailure, setFetchFailedJobsFailure] = useState(false)
  const [fetchFeaturesFailure, setFetchFeaturesFailure] = useState(false)
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

  const actionsMenuRef = React.createRef()

  useEffect(() => {
    fetchProjectRunningJobs(project.metadata.name)
      .then(jobs => {
        if (fetchRunningJobsFailure) {
          setFetchRunningJobsFailure(false)
        }

        setRunningJobs(jobs)
      })
      .catch(() => {
        setFetchRunningJobsFailure(true)
      })
    fetchProjectFailedJobs(project.metadata.name)
      .then(jobs => {
        if (fetchFailedJobsFailure) {
          setFetchFailedJobsFailure(false)
        }

        setFailedJobs(jobs)
      })
      .catch(() => setFetchFailedJobsFailure(true))
    fetchProjectModels(project.metadata.name)
      .then(models => {
        if (fetchModelsFailure) {
          setFetchModelsFailure(false)
        }

        setModels(models)
      })
      .catch(() => setFetchModelsFailure(true))
    fetchProjectDataSets(project.metadata.name)
      .then(datasets => {
        if (fetchFeaturesFailure) {
          setFetchFeaturesFailure(false)
        }

        setFeatures(datasets)
      })
      .catch(() => setFetchFeaturesFailure(true))
    fetchProjectFunctions(project.metadata.name)
      .then(funcs => {
        if (fetchFunctionsFailure) {
          setFetchFunctionsFailure(false)
        }

        setFunctions(funcs)
      })
      .catch(() => setFetchFunctionsFailure(true))
  }, [
    fetchFailedJobsFailure,
    fetchFeaturesFailure,
    fetchFunctionsFailure,
    fetchModelsFailure,
    fetchNuclioFunctionsFailure,
    fetchProjectDataSets,
    fetchProjectFailedJobs,
    fetchProjectFunctions,
    fetchProjectModels,
    fetchProjectRunningJobs,
    fetchRunningJobsFailure,
    project.metadata.name
  ])

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
      features,
      projectStore.project.dataSets.loading,
      fetchFailedJobsFailure,
      fetchFeaturesFailure,
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
    features,
    fetchFailedJobsFailure,
    fetchFeaturesFailure,
    fetchFunctionsFailure,
    fetchModelsFailure,
    fetchNuclioFunctionsFailure,
    fetchRunningJobsFailure,
    functions,
    models,
    nuclioStore.functions,
    nuclioStore.loading,
    project.metadata.name,
    projectStore.project.dataSets.loading,
    projectStore.project.failedJobs.loading,
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
  fetchProjectDataSets: PropTypes.func.isRequired,
  fetchProjectFailedJobs: PropTypes.func.isRequired,
  fetchProjectFunctions: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  fetchProjectRunningJobs: PropTypes.func.isRequired,
  nuclioStore: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  projectStore: PropTypes.shape({}).isRequired
}

export default ProjectCard

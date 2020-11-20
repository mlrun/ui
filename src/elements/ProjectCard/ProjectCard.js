import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import './projectCard.scss'
import ProjectCardView from './ProjectCardView'

const ProjectCard = ({
  actionsMenu,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchNuclioFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  project
}) => {
  const [failedJobs, setFailedJobs] = useState([])
  const [features, setFeatures] = useState([])
  const [fetchFailedJobsFailure, setFetchFailedJobsFailure] = useState(false)
  const [fetchFeaturesFailure, setFetchFeaturesFailure] = useState(false)
  const [fetchFunctionsFailure, setFetchFunctionsFailure] = useState(false)
  const [fetchModelsFailure, setFetchModelsFailure] = useState(false)
  const [fetchRunningJobsFailure, setFetchRunningJobsFailure] = useState(false)
  const [functions, setFunctions] = useState({})
  const [models, setModels] = useState([])
  const [runningJobs, setRunningJobs] = useState([])
  const [showActionsList, setShowActionsList] = useState(false)

  const actionsMenuRef = React.createRef()

  useEffect(() => {
    fetchProjectRunningJobs(project.name)
      .then(jobs => {
        if (fetchRunningJobsFailure) {
          setFetchRunningJobsFailure(false)
        }

        setRunningJobs(jobs)
      })
      .catch(() => setFetchRunningJobsFailure(true))
    fetchProjectFailedJobs(project.name)
      .then(jobs => {
        if (fetchFailedJobsFailure) {
          setFetchFailedJobsFailure(false)
        }

        setFailedJobs(jobs)
      })
      .catch(() => setFetchFailedJobsFailure(true))
    fetchProjectModels(project.name)
      .then(models => {
        if (fetchModelsFailure) {
          setFetchModelsFailure(false)
        }

        setModels(models)
      })
      .catch(() => setFetchModelsFailure(true))
    fetchProjectDataSets(project.name)
      .then(datasets => {
        if (fetchFeaturesFailure) {
          setFetchFeaturesFailure(false)
        }

        setFeatures(datasets)
      })
      .catch(() => setFetchFeaturesFailure(true))
    fetchNuclioFunctions(project.name)
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
    fetchNuclioFunctions,
    fetchProjectDataSets,
    fetchProjectFailedJobs,
    fetchProjectModels,
    fetchProjectRunningJobs,
    fetchRunningJobsFailure,
    project.name
  ])

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

  const statistics = useMemo(
    () => ({
      runningJobs: {
        value: fetchRunningJobsFailure ? 'N/A' : runningJobs.length,
        label: 'Running jobs',
        className: runningJobs.length > 0 ? 'running' : 'default'
      },
      failedJobs: {
        value: fetchFailedJobsFailure ? 'N/A' : failedJobs.length,
        label: 'Failed (24hrs)',
        className: failedJobs.length > 0 ? 'failed' : 'default'
      },
      models: {
        value: fetchModelsFailure ? 'N/A' : models.length,
        label: 'Models',
        className: 'default'
      },
      features: {
        value: fetchFeaturesFailure ? 'N/A' : features.length,
        label: 'Features',
        className: 'default'
      },
      nuclioFunctions: {
        value: fetchFunctionsFailure ? 'N/A' : Object.values(functions).length,
        label: 'Functions',
        className: 'default'
      }
    }),
    [
      failedJobs.length,
      features.length,
      fetchFailedJobsFailure,
      fetchFeaturesFailure,
      fetchFunctionsFailure,
      fetchModelsFailure,
      fetchRunningJobsFailure,
      functions,
      models.length,
      runningJobs.length
    ]
  )

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
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchProjectDataSets: PropTypes.func.isRequired,
  fetchProjectFailedJobs: PropTypes.func.isRequired,
  fetchNuclioFunctions: PropTypes.func.isRequired,
  fetchProjectModels: PropTypes.func.isRequired,
  fetchProjectRunningJobs: PropTypes.func.isRequired,
  project: PropTypes.shape({}).isRequired
}

export default ProjectCard

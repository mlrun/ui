export const generateProjectStatistic = (
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
  nuclioFunctions,
  runningJobs
) => {
  const runningNuclioFunctions = Object.values(nuclioFunctions).reduce(
    (prev, curr) =>
      curr.status.state === 'ready' && !curr.spec.disable ? (prev += 1) : prev,
    0
  )
  const failedNuclioFunctions = Object.values(nuclioFunctions).reduce(
    (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
    0
  )

  return {
    runningJobs: {
      value:
        fetchRunningJobsFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : runningJobs.length + runningNuclioFunctions,
      label: 'Running',
      className:
        runningJobs.length + runningNuclioFunctions > 0 &&
        !fetchRunningJobsFailure &&
        !fetchNuclioFunctionsFailure
          ? 'running'
          : 'default',
      counterTooltip: 'ML jobs and Nuclio functions'
    },
    failedJobs: {
      value:
        fetchFailedJobsFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : failedJobs.length + failedNuclioFunctions,
      label: 'Failed (24hrs)',
      className:
        failedJobs.length + failedNuclioFunctions > 0 &&
        !fetchFailedJobsFailure &&
        !fetchNuclioFunctionsFailure
          ? 'failed'
          : 'default',
      labelClassName: 'wrap',
      counterTooltip: 'ML jobs and Nuclio functions'
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
    functions: {
      value: fetchFunctionsFailure ? 'N/A' : functions.length,
      label: 'ML functions',
      className: 'default'
    }
  }
}

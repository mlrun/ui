export const generateProjectStatistic = (
  failedJobs,
  failedJobsLoading,
  features,
  featuresLoading,
  fetchFailedJobsFailure,
  fetchFeaturesFailure,
  fetchFunctionsFailure,
  fetchModelsFailure,
  fetchNuclioFunctionsFailure,
  fetchRunningJobsFailure,
  functions,
  functionsLoading,
  models,
  modelsLoading,
  nuclioFunctions,
  nuclioFunctionsLoading,
  runningJobs,
  runningJobsLoading
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
      className:
        runningJobs.length + runningNuclioFunctions > 0 &&
        !fetchRunningJobsFailure &&
        !fetchNuclioFunctionsFailure
          ? 'running'
          : 'default',
      counterTooltip: 'ML jobs and Nuclio functions',
      label: 'Running',
      loading: runningJobsLoading || nuclioFunctionsLoading,
      value:
        fetchRunningJobsFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : runningJobs.length + runningNuclioFunctions
    },
    failedJobs: {
      className:
        failedJobs.length + failedNuclioFunctions > 0 &&
        !fetchFailedJobsFailure &&
        !fetchNuclioFunctionsFailure
          ? 'failed'
          : 'default',
      counterTooltip: 'ML jobs and Nuclio functions',
      label: 'Failed (24hrs)',
      labelClassName: 'wrap',
      loading: failedJobsLoading || nuclioFunctionsLoading,
      value:
        fetchFailedJobsFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : failedJobs.length + failedNuclioFunctions
    },
    models: {
      className: 'default',
      label: 'Models',
      loading: modelsLoading,
      value: fetchModelsFailure ? 'N/A' : models.length
    },
    features: {
      className: 'default',
      label: 'Features',
      loading: featuresLoading,
      value: fetchFeaturesFailure ? 'N/A' : features.length
    },
    functions: {
      className: 'default',
      label: 'ML functions',
      loading: functionsLoading,
      value: fetchFunctionsFailure ? 'N/A' : functions.length
    }
  }
}

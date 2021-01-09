import { groupByUniqName } from '../../utils/groupByUniqName'

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
  nuclioFunctions = [],
  nuclioFunctionsLoading,
  runningJobs,
  runningJobsLoading
) => {
  const grouppedNuclioFunctions = groupByUniqName(nuclioFunctions, 'metadata')
  const runningNuclioFunctions = Object.values(grouppedNuclioFunctions).reduce(
    (prev, curr) =>
      curr.status.state === 'ready' && !curr.spec.disable ? (prev += 1) : prev,
    0
  )
  const failedNuclioFunctions = Object.values(grouppedNuclioFunctions).reduce(
    (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
    0
  )

  return {
    runningJobs: {
      className:
        groupByUniqName(runningJobs, 'metadata').length +
          runningNuclioFunctions >
          0 &&
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
          : groupByUniqName(runningJobs, 'metadata').length +
            runningNuclioFunctions
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
          : groupByUniqName(failedJobs, 'metadata').length +
            failedNuclioFunctions
    },
    models: {
      className: 'default',
      label: 'Models',
      loading: modelsLoading,
      value: fetchModelsFailure
        ? 'N/A'
        : groupByUniqName(models, 'producer').length
    },
    features: {
      className: 'default',
      label: 'Features',
      loading: featuresLoading,
      value: fetchFeaturesFailure
        ? 'N/A'
        : groupByUniqName(features, 'producer').length
    },
    functions: {
      className: 'default',
      label: 'ML functions',
      loading: functionsLoading,
      value: fetchFunctionsFailure
        ? 'N/A'
        : groupByUniqName(functions, 'metadata').length
    }
  }
}

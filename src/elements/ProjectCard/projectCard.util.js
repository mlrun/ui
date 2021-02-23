import { groupByUniqName } from '../../utils/groupByUniqName'

export const generateProjectStatistic = (
  failedJobs,
  failedJobsLoading,
  featureSets,
  featuresLoading,
  fetchFailedJobsFailure,
  fetchFeatureSetsFailure,
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
  const grouppedNuclioFunctions = groupByUniqName(
    nuclioFunctions,
    'metadata.name'
  )
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
        groupByUniqName(runningJobs, 'metadata.name').length +
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
          : groupByUniqName(runningJobs, 'metadata.name').length +
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
          : groupByUniqName(failedJobs, 'metadata.name').length +
            failedNuclioFunctions
    },
    models: {
      className: 'default',
      label: 'Models',
      loading: modelsLoading,
      value: fetchModelsFailure
        ? 'N/A'
        : groupByUniqName(models, 'db_key').length
    },
    featureSets: {
      className: 'default',
      label: 'Feature sets',
      loading: featuresLoading,
      value: fetchFeatureSetsFailure
        ? 'N/A'
        : groupByUniqName(featureSets, 'metadata.name').length
    },
    functions: {
      className: 'default',
      label: 'ML functions',
      loading: functionsLoading,
      value: fetchFunctionsFailure
        ? 'N/A'
        : groupByUniqName(functions, 'metadata.name').length
    }
  }
}

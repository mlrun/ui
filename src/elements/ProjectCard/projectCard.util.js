import { groupByUniqName } from '../../utils/groupByUniqName'

export const generateProjectStatistic = (
  projectSummary = {},
  fetchProjectsSummaryFailure,
  projectsSummaryLoading,
  fetchNuclioFunctionsFailure,
  nuclioFunctions = [],
  nuclioFunctionsLoading
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
        !fetchProjectsSummaryFailure &&
        !fetchNuclioFunctionsFailure &&
        projectSummary.runs_running_count + runningNuclioFunctions > 0
          ? 'running'
          : 'default',
      counterTooltip: 'ML jobs and Nuclio functions',
      label: 'Running',
      loading: projectsSummaryLoading || nuclioFunctionsLoading,
      value:
        fetchProjectsSummaryFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : projectSummary.runs_running_count + runningNuclioFunctions
    },
    failedJobs: {
      className:
        !fetchProjectsSummaryFailure &&
        !fetchNuclioFunctionsFailure &&
        projectSummary.runs_failed_recent_count?.length +
          failedNuclioFunctions >
          0
          ? 'failed'
          : 'default',
      counterTooltip: 'ML jobs and Nuclio functions',
      label: 'Failed (24hrs)',
      labelClassName: 'wrap',
      loading: projectsSummaryLoading || nuclioFunctionsLoading,
      value:
        fetchProjectsSummaryFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : projectSummary.runs_failed_recent_count + failedNuclioFunctions
    },
    models: {
      className: 'default',
      label: 'Models',
      loading: projectsSummaryLoading,
      value: fetchProjectsSummaryFailure ? 'N/A' : projectSummary.models_count
    },
    featureSets: {
      className: 'default',
      label: 'Feature sets',
      loading: projectsSummaryLoading,
      value: fetchProjectsSummaryFailure
        ? 'N/A'
        : projectSummary.feature_sets_count
    },
    functions: {
      className: 'default',
      label: 'ML functions',
      loading: projectsSummaryLoading,
      value: fetchProjectsSummaryFailure
        ? 'N/A'
        : projectSummary.functions_count
    }
  }
}

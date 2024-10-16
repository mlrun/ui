/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { isEmpty } from 'lodash'

import { groupByUniqName } from '../../utils/groupByUniqName'
import { ERROR_STATE } from '../../constants'

export const generateProjectStatistic = (
  projectSummary = {},
  fetchProjectsSummaryFailure,
  projectsSummaryLoading,
  fetchNuclioFunctionsFailure,
  nuclioFunctions = [],
  nuclioFunctionsLoading
) => {
  const grouppedNuclioFunctions = groupByUniqName(nuclioFunctions, 'metadata.name')
  const runningNuclioFunctions = Object.values(grouppedNuclioFunctions).reduce(
    (prev, curr) => (curr.status.state === 'ready' && !curr.spec.disable ? (prev += 1) : prev),
    0
  )
  const failedNuclioFunctions = Object.values(grouppedNuclioFunctions).reduce(
    (prev, curr) => (curr.status.state === ERROR_STATE ? (prev += 1) : prev),
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
          : isEmpty(projectSummary)
            ? '-'
            : projectSummary.runs_running_count + runningNuclioFunctions
    },
    failedJobs: {
      className:
        !fetchProjectsSummaryFailure &&
        !fetchNuclioFunctionsFailure &&
        projectSummary.runs_failed_recent_count + failedNuclioFunctions > 0
          ? 'failed'
          : 'default',
      counterTooltip: 'Failed ML jobs and nuclio functions in the last 24 hours',
      label: 'Failed',
      labelClassName: 'wrap',
      loading: projectsSummaryLoading || nuclioFunctionsLoading,
      value:
        fetchProjectsSummaryFailure || fetchNuclioFunctionsFailure
          ? 'N/A'
          : isEmpty(projectSummary)
            ? '-'
            : projectSummary.runs_failed_recent_count + failedNuclioFunctions
    }
    // models: {
    //   className: 'default',
    //   label: 'Models',
    //   loading: projectsSummaryLoading,
    //   value: fetchProjectsSummaryFailure
    //     ? 'N/A'
    //     : isEmpty(projectSummary)
    //     ? '-'
    //     : projectSummary.models_count
    // },
    // featureSets: {
    //   className: 'default',
    //   label: 'Feature sets',
    //   loading: projectsSummaryLoading,
    //   value: fetchProjectsSummaryFailure
    //     ? 'N/A'
    //     : isEmpty(projectSummary)
    //     ? '-'
    //     : projectSummary.feature_sets_count
    // },
    // files: {
    //   className: 'default',
    //   label: 'Files',
    //   loading: projectsSummaryLoading,
    //   value: fetchProjectsSummaryFailure
    //     ? 'N/A'
    //     : isEmpty(projectSummary)
    //     ? '-'
    //     : projectSummary.files_count
    // }
  }
}

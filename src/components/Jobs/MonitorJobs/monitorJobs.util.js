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
import React from 'react'
import { isEmpty } from 'lodash'

import { FUNCTION_RUN_KINDS } from '../../../constants'
import {
  JOB_STEADY_STATES,
  isJobKindAbortable,
  isJobKindDask,
  isJobAborting,
  JOB_RUNNING_STATES
} from '../jobs.util'

import { ReactComponent as MonitorIcon } from 'igz-controls/images/monitor-icon.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Cancel } from 'igz-controls/images/close.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

export const generateActionsMenu = (
  job,
  handleRerunJob,
  jobs_dashboard_url,
  handleMonitoring,
  abortable_function_kinds,
  handleConfirmAbortJob,
  toggleConvertedYaml,
  selectedJob,
  handleConfirmDeleteJob,
  isDetailsPopUp = false,
  jobName
) => {
  if (job?.uid) {
    const jobKindIsAbortable = isJobKindAbortable(job, abortable_function_kinds)
    const jobIsAborting = isJobAborting(job)
    const jobKindIsDask = isJobKindDask(job?.labels)

    return [
      [
        {
          label: 'Batch re-run',
          icon: <Run />,
          hidden:
            !FUNCTION_RUN_KINDS.includes(job?.ui?.originalContent.metadata.labels?.kind) ||
            isDetailsPopUp,
          onClick: handleRerunJob
        },
        {
          label: 'Monitoring',
          icon: <MonitorIcon />,
          tooltip: !jobs_dashboard_url
            ? 'Grafana service unavailable'
            : jobKindIsDask
              ? 'Unavailable for Dask jobs'
              : '',
          disabled: !jobs_dashboard_url || jobKindIsDask,
          onClick: handleMonitoring,
          hidden: !isEmpty(selectedJob)
        },
        {
          label: 'Abort',
          icon: <Cancel />,
          onClick: handleConfirmAbortJob,
          tooltip: jobKindIsAbortable
            ? jobIsAborting
              ? 'Job is aborting'
              : ''
            : 'Cannot abort jobs of this kind',
          disabled: !jobKindIsAbortable || jobIsAborting,
          hidden: JOB_STEADY_STATES.includes(job?.state?.value) || isDetailsPopUp
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        },
        {
          label: 'Delete run',
          icon: <Delete />,
          className: 'danger',
          onClick: (job) => handleConfirmDeleteJob(job),
          hidden: JOB_RUNNING_STATES.includes(job?.state?.value) || isDetailsPopUp
        },
        {
          label: 'Delete all runs',
          icon: <Delete />,
          className: 'danger',
          onClick: (job) => handleConfirmDeleteJob(job, true),
          hidden: JOB_RUNNING_STATES.includes(job?.state?.value) || jobName || isDetailsPopUp
        }
      ]
    ]
  } else {
    return [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]
    ]
  }
}

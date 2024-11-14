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

import {
  DATES_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  STATUS_FILTER,
  TYPE_FILTER
} from '../constants'

export const getJobKindFromLabels = (labels = []) => {
  return labels.find(label => label.includes('kind:'))?.replace('kind: ', '') ?? ''
}

export const getJobsFiltersConfig = jobName => {
  return {
    [NAME_FILTER]: { label: 'Name:', hidden: Boolean(jobName) },
    [DATES_FILTER]: { label: 'Start time:' },
    [PROJECT_FILTER]: { label: 'Project:' },
    [STATUS_FILTER]: { label: 'Status:' },
    [TYPE_FILTER]: { label: 'Type:' },
    [LABELS_FILTER]: { label: 'Labels:' }
  }
}

export const getWorkflowsFiltersConfig = () => {
  return {
    [NAME_FILTER]: { label: 'Name:' },
    [DATES_FILTER]: { label: 'Created at:' },
    [PROJECT_FILTER]: { label: 'Project:' },
    [STATUS_FILTER]: { label: 'Status:' },
    [LABELS_FILTER]: { label: 'Labels:' }
  }
}

export const getScheduledFiltersConfig = () => {
  return {
    [NAME_FILTER]: { label: 'Name:' },
    [DATES_FILTER]: { label: 'Scheduled at:', isFuture: true },
    [PROJECT_FILTER]: { label: 'Project:' },
    [TYPE_FILTER]: { label: 'Type:' },
    [LABELS_FILTER]: { label: 'Labels:' }
  }
}

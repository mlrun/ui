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
  GROUP_BY_FILTER,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  PROJECT_FILTER,
  SORT_BY,
  STATE_FILTER_ALL_ITEMS,
  STATUS_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../../constants'

export const generateStatusFilter = useFailedStatus => {
  const status = useFailedStatus ? 'failed' : 'error'

  return [
    { label: 'All', id: STATE_FILTER_ALL_ITEMS, status: 'all' },
    { label: 'Completed', id: 'completed', status: 'completed' },
    { label: 'Running', id: 'running', status: 'running' },
    { label: 'Pending', id: 'pending', status: 'pending' },
    { label: 'Error', id: status, status: status },
    { label: 'Aborted', id: 'aborted', status: 'aborted' }
  ]
}

export const filterSelectOptions = {
  [STATUS_FILTER]: generateStatusFilter(false),
  [GROUP_BY_FILTER]: [
    { label: 'None', id: GROUP_BY_NONE },
    { label: 'Name', id: GROUP_BY_NAME }
  ],
  [SORT_BY]: [{ label: 'Name', id: 'name' }],
  [PROJECT_FILTER]: [{ label: 'Project', id: 'project' }]
}

export const tagFilterOptions = [
  { label: 'All', id: TAG_FILTER_ALL_ITEMS },
  { label: 'latest', id: TAG_FILTER_LATEST }
]

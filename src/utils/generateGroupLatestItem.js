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
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  FUNCTIONS_PAGE,
  JOBS_PAGE
} from '../constants'

export const generateGroupLatestItem = (page, tableContent, pageTab) =>
  tableContent?.map(group =>
    Array.isArray(group) && [FUNCTIONS_PAGE, JOBS_PAGE].includes(page)
      ? group.reduce((prev, curr) => {
          const prevDate = new Date(prev.updated?.value)
          const currDate = new Date(curr.updated?.value)

          // if either dates is invalid - return the other one
          // if both are valid - return the later one
          return isNaN(prevDate)
            ? curr
            : isNaN(currDate)
            ? prev
            : prevDate.getTime() > currDate.getTime()
            ? prev
            : curr
        })
      : Array.isArray(group) &&
        [FEATURE_STORE_PAGE].includes(page) &&
        ![FEATURES_TAB].includes(pageTab)
      ? group.find(groupItem => groupItem.version?.value === 'latest') ??
        group[0]
      : group[0]
  )

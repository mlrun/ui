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
  DATE_FILTER_ANY_TIME,
  GROUP_BY_NAME,
  REMOVE_FILTERS,
  SET_FILTER_PROJECT_OPTIONS,
  SET_FILTER_TAG_OPTIONS,
  SET_FILTERS,
  SHOW_ITERATIONS,
  STATE_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../constants'

const initialState = {
  dates: {
    value: DATE_FILTER_ANY_TIME,
    isPredefined: false
  },
  entities: '',
  groupBy: GROUP_BY_NAME,
  iter: SHOW_ITERATIONS,
  labels: '',
  name: '',
  project: '',
  showUntagged: '',
  state: STATE_FILTER_ALL_ITEMS,
  sortBy: '',
  tag: TAG_FILTER_LATEST,
  tagOptions: [],
  projectOptions: []
}

const filtersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REMOVE_FILTERS:
      return initialState
    case SET_FILTERS:
      return {
        ...state,
        ...payload
      }
    case SET_FILTER_TAG_OPTIONS:
      return {
        ...state,
        tagOptions: payload
      }
    case SET_FILTER_PROJECT_OPTIONS:
      return {
        ...state,
        projectOptions: payload
      }
    default:
      return state
  }
}

export default filtersReducer

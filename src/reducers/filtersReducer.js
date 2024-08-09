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
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash'

import {
  ARTIFACT_OTHER_TYPE,
  CONSUMER_GROUPS_FILTER,
  CONSUMER_GROUP_FILTER,
  DATASETS_FILTERS,
  DATASET_TYPE,
  DATES_FILTER,
  DATE_FILTER_ANY_TIME,
  FILES_FILTERS,
  FILTER_ALL_ITEMS,
  FILTER_MENU,
  FILTER_MENU_MODAL,
  FUNCTION_FILTERS,
  GROUP_BY_NAME,
  ITERATIONS_FILTER,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_SCHEDULED_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB,
  LABELS_FILTER,
  MODELS_FILTERS,
  MODEL_TYPE,
  NAME_FILTER,
  PROJECT_FILTER,
  SHOW_ITERATIONS,
  SHOW_UNTAGGED_FILTER,
  STATUS_FILTER,
  TAG_FILTER,
  TAG_FILTER_LATEST,
  TYPE_FILTER
} from '../constants'
import {
  NEXT_24_HOUR_DATE_OPTION,
  PAST_24_HOUR_DATE_OPTION,
  PAST_WEEK_DATE_OPTION,
  datePickerFutureOptions,
  datePickerPastOptions,
  getDatePickerFilterValue
} from '../utils/datePicker.util'

const initialState = {
  saveFilters: false,
  dates: {
    value: DATE_FILTER_ANY_TIME,
    isPredefined: false,
    initialSelectedOptionId: ''
  },
  entities: '',
  groupBy: GROUP_BY_NAME,
  iter: SHOW_ITERATIONS,
  labels: '',
  name: '',
  project: '',
  state: FILTER_ALL_ITEMS,
  sortBy: '',
  tag: TAG_FILTER_LATEST,
  tagOptions: null,
  projectOptions: [],
  [FILTER_MENU]: {
    [JOBS_MONITORING_JOBS_TAB]: {
      [NAME_FILTER]: '',
      [DATES_FILTER]: getDatePickerFilterValue(datePickerPastOptions, PAST_24_HOUR_DATE_OPTION)
    },
    [JOBS_MONITORING_WORKFLOWS_TAB]: {
      [NAME_FILTER]: '',
      [DATES_FILTER]: getDatePickerFilterValue(datePickerPastOptions, PAST_24_HOUR_DATE_OPTION)
    },
    [JOBS_MONITORING_SCHEDULED_TAB]: {
      [NAME_FILTER]: '',
      [DATES_FILTER]: getDatePickerFilterValue(
        datePickerFutureOptions,
        NEXT_24_HOUR_DATE_OPTION,
        true
      )
    },
    [FUNCTION_FILTERS]: {
      [NAME_FILTER]: '',
      [DATES_FILTER]: getDatePickerFilterValue(datePickerPastOptions, PAST_WEEK_DATE_OPTION)
    },
    [CONSUMER_GROUPS_FILTER]: {
      [NAME_FILTER]: '',
    },
    [CONSUMER_GROUP_FILTER]: {
      [NAME_FILTER]: '',
    }
  },
  [FILTER_MENU_MODAL]: {
    [DATASETS_FILTERS]: {
      initialValues: {
        [TAG_FILTER]: TAG_FILTER_LATEST,
        [LABELS_FILTER]: '',
        [ITERATIONS_FILTER]: SHOW_ITERATIONS
      },
      values: {
        [TAG_FILTER]: TAG_FILTER_LATEST,
        [LABELS_FILTER]: '',
        [ITERATIONS_FILTER]: SHOW_ITERATIONS
      }
    },
    [FILES_FILTERS]: {
      initialValues: {
        [TAG_FILTER]: TAG_FILTER_LATEST,
        [LABELS_FILTER]: '',
        [ITERATIONS_FILTER]: SHOW_ITERATIONS
      },
      values: {
        [TAG_FILTER]: TAG_FILTER_LATEST,
        [LABELS_FILTER]: '',
        [ITERATIONS_FILTER]: SHOW_ITERATIONS
      }
    },
    [MODELS_FILTERS]: {
      initialValues: {
        [TAG_FILTER]: TAG_FILTER_LATEST,
        [LABELS_FILTER]: '',
        [ITERATIONS_FILTER]: SHOW_ITERATIONS
      },
      values: {
        [TAG_FILTER]: TAG_FILTER_LATEST,
        [LABELS_FILTER]: '',
        [ITERATIONS_FILTER]: SHOW_ITERATIONS
      }
    },
    [FUNCTION_FILTERS]: {
      initialValues: { [SHOW_UNTAGGED_FILTER]: false },
      values: { [SHOW_UNTAGGED_FILTER]: false }
    },
    [JOBS_MONITORING_JOBS_TAB]: {
      initialValues: {
        [LABELS_FILTER]: '',
        [PROJECT_FILTER]: '',
        [STATUS_FILTER]: [FILTER_ALL_ITEMS],
        [TYPE_FILTER]: FILTER_ALL_ITEMS
      },
      values: {
        [LABELS_FILTER]: '',
        [PROJECT_FILTER]: '',
        [STATUS_FILTER]: [FILTER_ALL_ITEMS],
        [TYPE_FILTER]: FILTER_ALL_ITEMS
      }
    },
    [JOBS_MONITORING_WORKFLOWS_TAB]: {
      initialValues: {
        [LABELS_FILTER]: '',
        [PROJECT_FILTER]: '',
        [STATUS_FILTER]: [FILTER_ALL_ITEMS]
      },
      values: {
        [LABELS_FILTER]: '',
        [PROJECT_FILTER]: '',
        [STATUS_FILTER]: [FILTER_ALL_ITEMS]
      }
    },
    [JOBS_MONITORING_SCHEDULED_TAB]: {
      initialValues: {
        [LABELS_FILTER]: '',
        [PROJECT_FILTER]: '',
        [TYPE_FILTER]: FILTER_ALL_ITEMS
      },
      values: {
        [LABELS_FILTER]: '',
        [PROJECT_FILTER]: '',
        [TYPE_FILTER]: FILTER_ALL_ITEMS
      }
    }
  }
}

export const getFilterTagOptions = createAsyncThunk(
  'getFilterTagOptions',
  ({ dispatch, fetchTags, project, category, config }) => {
    const fetchTagsArguments = {
      project,
      category,
      config
    }
    const fetchTagsPromise =
      [ARTIFACT_OTHER_TYPE, MODEL_TYPE, DATASET_TYPE].includes(category) && dispatch
        ? dispatch(fetchTags(fetchTagsArguments)).unwrap()
        : fetchTags(fetchTagsArguments)

    return fetchTagsPromise.then(response => {
      if (response?.data) {
        return [...new Set(response.data.tags)].filter(option => option)
      }
    })
  }
)

const filtersSlice = createSlice({
  name: 'filtersStore',
  initialState,
  reducers: {
    removeFilters() {
      return initialState
    },
    resetFilter(state, action) {
      state[FILTER_MENU][action.payload] = initialState[FILTER_MENU][action.payload]
    },
    resetModalFilter(state, action) {
      state[FILTER_MENU_MODAL][action.payload] = initialState[FILTER_MENU_MODAL][action.payload]
    },
    setFilters(state, action) {
      for (let filterProp in action.payload) {
        state[filterProp] = action.payload[filterProp]
      }
    },
    setFiltersValues(state, action) {
      const payloadValue = action.payload.value ?? {}
      const newFilterValues = {
        ...state[FILTER_MENU][action.payload.name],
        ...payloadValue
      }

      set(state, [FILTER_MENU, action.payload.name], newFilterValues)
    },
    setModalFiltersValues(state, action) {
      const payloadValue = action.payload.value ?? {}
      const newFilterValues = {
        ...state[FILTER_MENU_MODAL][action.payload.name]?.values,
        ...payloadValue
      }

      set(state, [FILTER_MENU_MODAL, action.payload.name, 'values'], newFilterValues)
    },
    setModalFiltersInitialValues(state, action) {
      const payloadValue = action.payload.value ?? {}
      const newFilterInitialValues = {
        ...state[FILTER_MENU_MODAL][action.payload.name]?.initialValues,
        ...payloadValue
      }

      set(state, [FILTER_MENU_MODAL, action.payload.name, 'initialValues'], newFilterInitialValues)
    },
    setFilterProjectOptions(state, action) {
      state.projectOptions = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(getFilterTagOptions.fulfilled, (state, { payload }) => {
      state.tagOptions = payload
    })
  }
})

export const {
  removeFilters,
  resetFilter,
  resetModalFilter,
  setFilters,
  setFiltersValues,
  setModalFiltersValues,
  setModalFiltersInitialValues,
  setFilterProjectOptions
} = filtersSlice.actions

export default filtersSlice.reducer

import {
  SET_FILTERS,
  REMOVE_FILTERS,
  SET_FILTER_TAG_OPTIONS,
  SET_FILTER_PROJECT_OPTIONS
} from '../constants'

const filtersActions = {
  getFilterTagOptions: (fetchTagOption, projectName) => dispatch => {
    return fetchTagOption(projectName).then(({ data }) =>
      dispatch(filtersActions.setFilterTagOptions([...new Set(data.tags)]))
    )
  },
  removeFilters: () => ({
    type: REMOVE_FILTERS
  }),
  setFilters: filters => ({
    type: SET_FILTERS,
    payload: filters
  }),
  setFilterTagOptions: options => ({
    type: SET_FILTER_TAG_OPTIONS,
    payload: options
  }),
  setFilterProjectOptions: options => ({
    type: SET_FILTER_PROJECT_OPTIONS,
    payload: options
  })
}

export default filtersActions

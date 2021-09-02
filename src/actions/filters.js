import {
  SET_FILTERS,
  REMOVE_FILTERS,
  SET_FILTER_TAG_OPTIONS
} from '../constants'

const filtersActions = {
  setFilters: filters => ({
    type: SET_FILTERS,
    payload: filters
  }),
  getFilterTagOptions: (fetchTagOption, projectName) => dispatch => {
    return fetchTagOption(projectName).then(({ data }) =>
      dispatch(filtersActions.setFilterTagOptions([...new Set(data.tags)]))
    )
  },
  setFilterTagOptions: options => ({
    type: SET_FILTER_TAG_OPTIONS,
    payload: options
  }),
  removeFilters: () => ({
    type: REMOVE_FILTERS
  })
}

export default filtersActions

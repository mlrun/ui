import { SET_FILTERS, REMOVE_FILTERS } from '../constants'

const filtersActions = {
  setFilters: filters => ({
    type: SET_FILTERS,
    payload: filters
  }),
  removeFilters: () => ({
    type: REMOVE_FILTERS
  })
}

export default filtersActions

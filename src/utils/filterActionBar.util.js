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
import { SHOW_UNTAGGED_ITEMS } from '../constants'

import detailsActions from '../actions/details'
import { setFilters } from '../reducers/filtersReducer'

export const filtersHelper = async (changes, dispatch, detailsActions) => {
  let handleChangeFilters = Promise.resolve(true)

  if (changes.counter > 0) {
    handleChangeFilters = await new Promise(resolve => {
      const handleDiscardChanges = () => {
        window.removeEventListener('discardChanges', handleDiscardChanges)
        resolve(true)
      }
      window.addEventListener('discardChanges', handleDiscardChanges)

      dispatch(detailsActions.setFiltersWasHandled(true))
      dispatch(detailsActions.showWarning(true))
    })
  }

  return handleChangeFilters
}

export const applyFunctionsChanges = async (
  name,
  filterMenuModal,
  changes,
  dispatch,
  setSelectedRowData,
  handleRefresh
) => {
  const filtersHelperResult = await filtersHelper(changes, dispatch, detailsActions)
  if (filtersHelperResult) {
    const showUntaggedValue =
      filterMenuModal.showUntagged === SHOW_UNTAGGED_ITEMS ? SHOW_UNTAGGED_ITEMS : ''
    dispatch(setFilters({ showUntagged: showUntaggedValue }))
    setSelectedRowData({})
    handleRefresh({ name, ...filterMenuModal })
  }
}

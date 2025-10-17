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
import { MODELS_PAGE, NAME_FILTER } from '../../../constants'
import { parseFunction } from '../../../utils/parseFunction'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { fetchFunction } from '../../../reducers/functionReducer'

export const filtersConfig = {
  [NAME_FILTER]: { label: 'Name:', initialValue: '' }
}

export const generatePageData = hideFilterMenu => ({
  page: MODELS_PAGE,
  hidePageActionMenu: true,
  hideFilterMenu
})

export const fetchAndParseFunction = (selectedFunction, dispatch) => {
  return dispatch(
    fetchFunction({
      project: selectedFunction.project,
      name: selectedFunction.name,
      hash: selectedFunction.hash,
      tag: selectedFunction.tag
    })
  )
    .unwrap()
    .then(func => {
      return parseFunction(func, selectedFunction.project.project)
    })
    .catch(error => {
      showErrorNotification(dispatch, error)
    })
}

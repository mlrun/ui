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
import { debounce, isEqual } from 'lodash'

import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { fetchArtifactsFunction } from '../../../reducers/artifactsReducer'
import {
  DETAILS_MODEL_ENDPOINTS_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_REALTIME_PIPELINE_TAB,
  MODELS_PAGE,
  NAME_FILTER,
  REAL_TIME_PIPELINES_TAB
} from '../../../constants'

export const filtersConfig = {
  [NAME_FILTER]: { label: 'Name:', initialValue: '' }
}

const infoHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Root function', id: 'rootFunction' },
  { label: 'Child functions', id: 'childFunction' },
  { label: 'Topology', id: 'topology' },
  { label: 'Internal invocation URLs', id: 'internalUrl' },
  { label: 'External invocation URLs', id: 'externalUrl' },
  { label: 'Kind', id: 'kind' },
  { label: 'Code entry point', id: 'command' },
  { label: 'Image', id: 'image' },
  { label: 'Version tag', id: 'tag' },
  { label: 'Hash', id: 'hash' },
  { label: 'Code origin', id: 'codeOrigin' },
  { label: 'Updated', id: 'updated' },
  { label: 'Default handler', id: 'defaultHandler' },
  { label: 'Description', id: 'description' }
]

const detailsMenu = [
  {
    label: 'Realtime pipeline',
    id: DETAILS_REALTIME_PIPELINE_TAB
  },
  {
    label: 'overview',
    id: DETAILS_OVERVIEW_TAB
  },
  {
    label: 'Model endpoints',
    id: DETAILS_MODEL_ENDPOINTS_TAB
  }
]

export const generatePageData = hideFilterMenu => ({
  page: MODELS_PAGE,
  pageTab: REAL_TIME_PIPELINES_TAB,
  hidePageActionMenu: true,
  hideFilterMenu,
  details: {
    menu: detailsMenu,
    infoHeaders,
    type: REAL_TIME_PIPELINES_TAB,
    hideCloseBtn: true
  }
})

export const fetchAndParsePipeline = (dispatch, selectedFunction) => {
  return dispatch(
    fetchArtifactsFunction({
      project: selectedFunction.project,
      name: selectedFunction.name,
      hash: selectedFunction.hash,
      tag: selectedFunction.tag
    })
  )
    .unwrap()
    .catch(error => {
      showErrorNotification(
        dispatch,
        error,
        '',
        'This real-time pipeline either does not exist or was deleted'
      )
      return null
    })
}

export const checkForSelectedPipeline = debounce(
  (
    pipelines,
    pipelineId,
    navigate,
    projectName,
    setSelectedPipeline,
    dispatch,
    lastCheckedPipelineIdRef
  ) => {
    if (pipelineId) {
      if (pipelines.length > 0 && lastCheckedPipelineIdRef.current !== pipelineId) {
        lastCheckedPipelineIdRef.current = pipelineId

        const foundPipeline = pipelines.find(item => item.hash === pipelineId)

        if (foundPipeline) {
          fetchAndParsePipeline(dispatch, foundPipeline).then(selectedPipeline => {
            if (selectedPipeline) {
              setSelectedPipeline(prevState => {
                return isEqual(prevState, selectedPipeline) ? prevState : selectedPipeline
              })
            } else {
              navigate(
                `/projects/${projectName}/models/${REAL_TIME_PIPELINES_TAB}${window.location.search}`,
                { replace: true }
              )
            }
          })
        } else {
          navigate(
            `/projects/${projectName}/models/${REAL_TIME_PIPELINES_TAB}${window.location.search}`,
            { replace: true }
          )
        }
      }
    } else {
      setSelectedPipeline({})
    }
  },
  30
)

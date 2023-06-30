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

import { applyTagChanges } from '../../utils/artifacts.util'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { generateProducerDetailsInfo } from '../../utils/generateProducerDetailsInfo'
import {
  DATASETS,
  DATASETS_PAGE,
  FULL_VIEW_MODE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER
} from '../../constants'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { sortListByDate } from '../../utils'
import { fetchDataSet } from '../../reducers/artifactsReducer'

export const infoHeaders = [
  {
    label: 'Hash',
    id: 'hash',
    tip: 'Represents hash of the data. when the data changes the hash would change'
  },
  { label: 'Key', id: 'db_key' },
  { label: 'Version tag', id: 'tag' },
  { label: 'Iter', id: 'iter' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'target_path' },
  { label: 'URI', id: 'target_uri' },
  {
    label: 'UID',
    id: 'tree',
    tip: 'Unique identifier representing the job or the workflow that generated the artifact'
  },
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' },
  { label: 'Sources', id: 'sources' }
]

export const filters = [
  { type: TAG_FILTER, label: 'Version tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show best iteration only' }
]

export const actionsMenuHeader = 'Register dataset'

export const generateDataSetsDetailsMenu = selectedItem => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  },
  {
    label: 'metadata',
    id: 'metadata',
    hidden: !selectedItem.schema
  },
  {
    label: 'analysis',
    id: 'analysis',
    hidden: !selectedItem.extra_data
  }
]

export const generatePageData = (selectedItem, viewMode) => ({
  page: DATASETS_PAGE,
  details: {
    menu: generateDataSetsDetailsMenu(selectedItem),
    infoHeaders,
    type: DATASETS,
    additionalInfo: {
      header: 'Producer',
      body: generateProducerDetailsInfo(selectedItem),
      hidden: !selectedItem.item?.producer
    },
    hideBackBtn: viewMode === FULL_VIEW_MODE,
    withToggleViewBtn: true
  }
})

export const fetchDataSetRowData = async (
  dispatch,
  dataSet,
  setSelectedRowData,
  iter,
  tag,
  projectName,
  frontendSpec
) => {
  const dataSetIdentifier = getArtifactIdentifier(dataSet)

  setSelectedRowData(state => ({
    ...state,
    loading: true
  }))

  dispatch(fetchDataSet({ project: dataSet.project, dataSet: dataSet.db_key, iter, tag }))
    .unwrap()
    .then(result => {
      if (result?.length > 0) {
        setSelectedRowData(state => {
          return {
            ...state,
            [dataSetIdentifier]: {
              content: sortListByDate(result, 'updated', false).map(artifact =>
                createDatasetsRowData(artifact, projectName, frontendSpec)
              )
            },
            error: null,
            loading: false
          }
        })
      }
    })
    .catch(error => {
      setSelectedRowData(state => ({
        ...state,
        [dataSetIdentifier]: {
          ...state[dataSetIdentifier]
        },
        error,
        loading: false
      }))
    })
}

export const handleApplyDetailsChanges = (
  changes,
  projectName,
  selectedItem,
  setNotification,
  dispatch
) => {
  return applyTagChanges(changes, selectedItem, projectName, dispatch, setNotification)
}

export const checkForSelectedDataset = (
  name,
  selectedRowData,
  datasets,
  tag,
  iter,
  uid,
  projectName,
  setSelectedDataset,
  navigate
) => {
  queueMicrotask(() => {
    if (name) {
      const artifacts = selectedRowData?.[name]?.content || datasets

      if (artifacts.length > 0) {
        const searchItem = searchArtifactItem(
          artifacts.map(artifact => artifact.data ?? artifact),
          name,
          tag,
          iter,
          uid
        )

        if (!searchItem) {
          navigate(`/projects/${projectName}/datasets`, { replace: true })
        } else {
          setSelectedDataset(searchItem)
        }
      }
    } else {
      setSelectedDataset({})
    }
  })
}

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
import React from 'react'

import JobWizard from '../JobWizard/JobWizard'

import {
  DATASET_TYPE,
  DATASETS_PAGE,
  DATASETS_TAB,
  FULL_VIEW_MODE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER
} from '../../constants'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { applyTagChanges } from '../../utils/artifacts.util'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { createDatasetsRowData, getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { fetchDataSet, showArtifactsPreview } from '../../reducers/artifactsReducer'
import { generateUri } from '../../utils/resources'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { openDeleteConfirmPopUp } from 'igz-controls/utils/common.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { sortListByDate } from '../../utils'

import { ReactComponent as TagIcon } from 'igz-controls/images/tag-icon.svg'
import { ReactComponent as YamlIcon } from 'igz-controls/images/yaml.svg'
import { ReactComponent as ArtifactView } from 'igz-controls/images/eye-icon.svg'
import { ReactComponent as Copy } from 'igz-controls/images/copy-to-clipboard-icon.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/download.svg'

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
  { label: 'Label column', id: 'label_column' },
  { label: 'Path', id: 'target_path' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' }
]

export const filters = [
  { type: TAG_FILTER, label: 'Version tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show best iteration only' }
]

export const registerDatasetTitle = 'Register dataset'

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

export const generatePageData = (selectedItem, viewMode, params) => ({
  page: DATASETS_PAGE,
  details: {
    menu: generateDataSetsDetailsMenu(selectedItem),
    infoHeaders,
    type: DATASETS_TAB,
    hideBackBtn: viewMode === FULL_VIEW_MODE,
    withToggleViewBtn: true,
    actionButton: {
      label: 'Train',
      variant: PRIMARY_BUTTON,
      onClick: () => handleTrainDataset(selectedItem, params)
    }
  }
})

const handleTrainDataset = (selectedItem, params) => {
  openPopUp(JobWizard, {
    params,
    isTrain: true,
    wizardTitle: 'Train model',
    prePopulatedData: {
      trainDatasetUri: selectedItem.URI
    }
  })
}

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
      } else {
        setSelectedRowData(state => {
          return {
            ...state,
            [dataSetIdentifier]: {
              content: []
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

export const generateActionsMenu = (
  dataset,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  handleRefresh,
  datasetsFilters
) => {
  const isTargetPathValid = getIsTargetPathValid(dataset ?? {}, frontendSpec)
  const downloadPath = `${dataset?.target_path}${dataset?.model_file || ''}`

  return [
    [
      {
        label: 'Add a tag',
        icon: <TagIcon />,
        onClick: handleAddTag
      },
      {
        label: 'Download',
        icon: <DownloadIcon />,
        onClick: dataset => {
          dispatch(
            setDownloadItem({
              path: downloadPath,
              user: dataset.producer?.owner,
              id: downloadPath
            })
          )
          dispatch(setShowDownloadsList(true))
        }
      },
      {
        label: 'Copy URI',
        icon: <Copy />,
        onClick: dataset => copyToClipboard(generateUri(dataset, DATASETS_TAB), dispatch)
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: toggleConvertedYaml
      },
      {
        label: 'Delete',
        icon: <Delete />,
        disabled: !dataset?.tag,
        tooltip: !dataset?.tag
          ? 'A tag is required to delete a dataset. Open the dataset, click on the edit icon, and assign a tag before proceeding with the deletion'
          : '',
        className: 'danger',
        onClick: () =>
          openDeleteConfirmPopUp(
            'Delete dataset?',
            `Do you want to delete the dataset "${dataset.db_key}"? Deleted datasets can not be restored.`,
            () => {
              handleDeleteArtifact(
                dispatch,
                projectName,
                dataset.db_key,
                dataset.tag,
                dataset.tree,
                handleRefresh,
                datasetsFilters,
                DATASET_TYPE
              )
            }
          )
      }
    ],
    [
      {
        disabled: !isTargetPathValid,
        id: 'dataset-preview',
        label: 'Preview',
        icon: <ArtifactView />,
        onClick: dataset => {
          dispatch(
            showArtifactsPreview({
              isPreview: true,
              selectedItem: dataset
            })
          )
        }
      }
    ]
  ]
}

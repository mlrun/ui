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
import DeleteArtifactPopUp from '../../elements/DeleteArtifactPopUp/DeleteArtifactPopUp'

import { ARTIFACT_MAX_DOWNLOAD_SIZE, DATASET_TYPE, DATASETS_PAGE } from '../../constants'
import { PRIMARY_BUTTON, FULL_VIEW_MODE } from 'igz-controls/constants'
import {
  applyTagChanges,
  chooseOrFetchArtifact,
  processActionAfterTagUniquesValidation
} from '../../utils/artifacts.util'
import { getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
import { generateUri } from '../../utils/resources'
import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { openPopUp, openDeleteConfirmPopUp, copyToClipboard } from 'igz-controls/utils/common.util'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import {
  decreaseDetailsLoadingCounter,
  increaseDetailsLoadingCounter
} from '../../reducers/detailsReducer'

import TagIcon from 'igz-controls/images/tag-icon.svg?react'
import YamlIcon from 'igz-controls/images/yaml.svg?react'
import ArtifactView from 'igz-controls/images/eye-icon.svg?react'
import Copy from 'igz-controls/images/copy-to-clipboard-icon.svg?react'
import Delete from 'igz-controls/images/delete.svg?react'
import DownloadIcon from 'igz-controls/images/download.svg?react'
import HistoryIcon from 'igz-controls/images/history.svg?react'

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
    hidden: !selectedItem?.schema
  },
  {
    label: 'analysis',
    id: 'analysis',
    hidden: !selectedItem?.extra_data
  }
]

export const generatePageData = (viewMode, isDetailsPopUp = false, selectedItem, params) => {
  return {
    page: DATASETS_PAGE,
    details: {
      menu: generateDataSetsDetailsMenu(selectedItem),
      infoHeaders,
      type: DATASETS_PAGE,
      hideBackBtn: viewMode === FULL_VIEW_MODE && !isDetailsPopUp,
      withToggleViewBtn: true,
      actionButton: {
        label: 'Train',
        hidden: isDetailsPopUp,
        variant: PRIMARY_BUTTON,
        onClick: () => handleTrainDataset(selectedItem, params)
      }
    }
  }
}

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

export const handleApplyDetailsChanges = (
  changes,
  projectName,
  selectedItem,
  setNotification,
  dispatch
) => {
  return processActionAfterTagUniquesValidation({
    tag: changes?.data?.tag?.currentFieldValue,
    artifact: selectedItem,
    projectName,
    dispatch,
    actionCallback: () =>
      applyTagChanges(changes, selectedItem, projectName, dispatch, setNotification),
    throwError: true,
    showLoader: () => dispatch(increaseDetailsLoadingCounter()),
    hideLoader: () => dispatch(decreaseDetailsLoadingCounter())
  })
}

export const generateActionsMenu = (
  datasetMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  refreshArtifacts,
  refreshAfterDeleteCallback,
  datasetsFilters,
  selectedDataset,
  showAllVersions,
  isAllVersions,
  isDetailsPopUp = false
) => {
  const isTargetPathValid = getIsTargetPathValid(datasetMin ?? {}, frontendSpec)
  const datasetDataCouldBeDeleted =
    datasetMin?.target_path?.endsWith('.pq') || datasetMin?.target_path?.endsWith('.parquet')

  const getFullDataset = datasetMin => {
    return chooseOrFetchArtifact(dispatch, DATASETS_PAGE, null, selectedDataset, datasetMin)
  }

  return [
    [
      {
        label: 'Add a tag',
        hidden: isDetailsPopUp,
        icon: <TagIcon />,
        onClick: handleAddTag,
        allowLeaveWarning: true
      },
      {
        label: 'Download',
        disabled:
          !isTargetPathValid ||
          datasetMin.size >
            (frontendSpec.artifact_limits.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: datasetMin => {
          getFullDataset(datasetMin).then(dataset => {
            if (dataset) {
              const downloadPath = `${dataset?.target_path}${dataset?.model_file || ''}`
              dispatch(
                setDownloadItem({
                  path: downloadPath,
                  user: dataset.producer?.owner,
                  id: downloadPath,
                  artifactLimits: frontendSpec?.artifact_limits,
                  fileSize: dataset.size,
                  projectName
                })
              )
              dispatch(setShowDownloadsList(true))
            }
          })
        }
      },
      {
        label: 'Copy URI',
        icon: <Copy />,
        onClick: datasetMin => copyToClipboard(generateUri(datasetMin, DATASETS_PAGE), dispatch)
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: datasetMin => getFullDataset(datasetMin).then(toggleConvertedYaml)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        hidden: isDetailsPopUp,
        className: 'danger',
        onClick: () =>
          datasetDataCouldBeDeleted
            ? openPopUp(DeleteArtifactPopUp, {
                artifact: datasetMin,
                artifactType: DATASET_TYPE,
                category: DATASET_TYPE,
                filters: datasetsFilters,
                refreshArtifacts,
                refreshAfterDeleteCallback
              })
            : openDeleteConfirmPopUp(
                'Delete dataset?',
                `Do you want to delete the dataset "${datasetMin.db_key}"? Deleted datasets can not be restored.`,
                () => {
                  handleDeleteArtifact(
                    dispatch,
                    projectName,
                    datasetMin.db_key,
                    datasetMin.uid,
                    refreshArtifacts,
                    refreshAfterDeleteCallback,
                    datasetsFilters,
                    DATASET_TYPE
                  )
                }
              ),
        allowLeaveWarning: true
      },
      {
        label: 'Delete all versions',
        icon: <Delete />,
        hidden: isDetailsPopUp || isAllVersions,
        className: 'danger',
        onClick: () =>
          openDeleteConfirmPopUp(
            'Delete dataset?',
            `Do you want to delete all versions of the dataset "${datasetMin.db_key}"? Deleted datasets can not be restored.`,
            () => {
              handleDeleteArtifact(
                dispatch,
                projectName,
                datasetMin.db_key,
                datasetMin.uid,
                refreshArtifacts,
                refreshAfterDeleteCallback,
                datasetsFilters,
                DATASET_TYPE,
                DATASET_TYPE,
                true
              )
            }
          ),
        allowLeaveWarning: true
      }
    ],
    [
      {
        id: 'show-all-versions',
        label: 'Show all versions',
        icon: <HistoryIcon />,
        onClick: () => showAllVersions(datasetMin.db_key),
        hidden: isAllVersions
      },
      {
        label: 'Preview',
        id: 'dataset-preview',
        disabled: !isTargetPathValid,
        icon: <ArtifactView />,
        onClick: datasetMin => {
          getFullDataset(datasetMin).then(dataset => {
            if (dataset) {
              dispatch(
                showArtifactsPreview({
                  isPreview: true,
                  selectedItem: dataset
                })
              )
            }
          })
        }
      }
    ]
  ]
}

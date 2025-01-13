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
import { debounce, isEqual } from 'lodash'

import JobWizard from '../JobWizard/JobWizard'
import DeleteArtifactPopUp from '../../elements/DeleteArtifactPopUp/DeleteArtifactPopUp'

import {
  ARTIFACT_MAX_DOWNLOAD_SIZE,
  ALL_VERSIONS_PATH,
  DATASET_TYPE,
  DATASETS_PAGE,
  DATASETS_TAB,
  FULL_VIEW_MODE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST,
  VIEW_SEARCH_PARAMETER,
  BE_PAGE,
  SHOW_ITERATIONS
} from '../../constants'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { applyTagChanges, chooseOrFetchArtifact } from '../../utils/artifacts.util'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
import { generateUri } from '../../utils/resources'
import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { openDeleteConfirmPopUp } from 'igz-controls/utils/common.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { getFilteredSearchParams } from '../../utils/filter.util'
import { parseIdentifier } from '../../utils'

import { ReactComponent as TagIcon } from 'igz-controls/images/tag-icon.svg'
import { ReactComponent as YamlIcon } from 'igz-controls/images/yaml.svg'
import { ReactComponent as ArtifactView } from 'igz-controls/images/eye-icon.svg'
import { ReactComponent as Copy } from 'igz-controls/images/copy-to-clipboard-icon.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/download.svg'
import { ReactComponent as HistoryIcon } from 'igz-controls/images/history.svg'

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

export const getFiltersConfig = isAllVersions => ({
  [NAME_FILTER]: { label: 'Name:', initialValue: '', hidden: isAllVersions },
  [TAG_FILTER]: {
    label: 'Version tag:',
    initialValue: isAllVersions ? TAG_FILTER_ALL_ITEMS : TAG_FILTER_LATEST,
    isModal: true
  },
  [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true },
  [ITERATIONS_FILTER]: {
    label: 'Show best iteration only:',
    initialValue: isAllVersions ? '' : SHOW_ITERATIONS,
    isModal: true
  }
})

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

export const generatePageData = (selectedItem, viewMode, params, isDetailsPopUp = false) => ({
  page: DATASETS_PAGE,
  details: {
    menu: generateDataSetsDetailsMenu(selectedItem),
    infoHeaders,
    type: DATASETS_TAB,
    hideBackBtn: viewMode === FULL_VIEW_MODE,
    withToggleViewBtn: true,
    actionButton: {
      label: 'Train',
      hidden: isDetailsPopUp,
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

export const handleApplyDetailsChanges = (
  changes,
  projectName,
  selectedItem,
  setNotification,
  dispatch
) => {
  return applyTagChanges(changes, selectedItem, projectName, dispatch, setNotification)
}

export const checkForSelectedDataset = debounce(
  (
    paramsName,
    datasets,
    paramsId,
    projectName,
    setSelectedDataset,
    navigate,
    isAllVersions,
    searchParams,
    paginationConfigRef
  ) => {
    if (paramsId) {
      const searchBePage = parseInt(searchParams.get(BE_PAGE))
      const configBePage = paginationConfigRef.current[BE_PAGE]
      const { tag, uid, iter } = parseIdentifier(paramsId)

      if (datasets.length > 0 && searchBePage === configBePage) {
        const searchItem = searchArtifactItem(
          datasets.map(artifact => artifact.data ?? artifact),
          paramsName,
          tag,
          iter,
          uid
        )

        if (!searchItem) {
          navigate(
            `/projects/${projectName}/datasets${isAllVersions ? `/${paramsName}/${ALL_VERSIONS_PATH}` : ''}${getFilteredSearchParams(
              window.location.search,
              [VIEW_SEARCH_PARAMETER]
            )}`,
            { replace: true }
          )
        } else {
          setSelectedDataset(prevState => {
            return isEqual(prevState, searchItem) ? prevState : searchItem
          })
        }
      }
    } else {
      setSelectedDataset({})
    }
  }
)

export const generateActionsMenu = (
  datasetMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  handleRefresh,
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
    return chooseOrFetchArtifact(dispatch, DATASETS_TAB, selectedDataset, datasetMin)
  }

  return [
    [
      {
        label: 'Add a tag',
        hidden: isDetailsPopUp,
        icon: <TagIcon />,
        onClick: handleAddTag
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
          })
        }
      },
      {
        label: 'Copy URI',
        icon: <Copy />,
        onClick: datasetMin => copyToClipboard(generateUri(datasetMin, DATASETS_TAB), dispatch)
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
                handleRefresh
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
                    handleRefresh,
                    datasetsFilters,
                    DATASET_TYPE
                  )
                }
              )
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
                handleRefresh,
                datasetsFilters,
                DATASET_TYPE,
                DATASET_TYPE,
                true
              )
            }
          )
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
            dispatch(
              showArtifactsPreview({
                isPreview: true,
                selectedItem: dataset
              })
            )
          })
        }
      }
    ]
  ]
}

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

import DeleteArtifactPopUp from '../../elements/DeleteArtifactPopUp/DeleteArtifactPopUp'

import {
  ARTIFACT_MAX_DOWNLOAD_SIZE,
  ARTIFACT_OTHER_TYPE,
  ARTIFACT_TYPE,
  FILES_PAGE
} from '../../constants'
import { FULL_VIEW_MODE } from 'igz-controls/constants'
import {
  processActionAfterTagUniquesValidation,
  applyTagChanges,
  chooseOrFetchArtifact
} from '../../utils/artifacts.util'
import { generateUri } from '../../utils/resources'
import { getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { openDeleteConfirmPopUp, openPopUp, copyToClipboard } from 'igz-controls/utils/common.util'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
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

export const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview'
  }
]

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
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' }
]

export const generatePageData = (viewMode, isDetailsPopUp = false) => {
  return {
    page: FILES_PAGE,
    details: {
      type: FILES_PAGE,
      menu: detailsMenu,
      infoHeaders,
      hideBackBtn: viewMode === FULL_VIEW_MODE && !isDetailsPopUp,
      withToggleViewBtn: true
    }
  }
}

export const registerArtifactTitle = 'Register artifact'

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
  fileMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  refreshArtifacts,
  refreshAfterDeleteCallback,
  filters,
  selectedFile,
  showAllVersions,
  isAllVersions,
  isDetailsPopUp = false
) => {
  const isTargetPathValid = getIsTargetPathValid(fileMin ?? {}, frontendSpec)

  const getFullFile = fileMin => {
    return chooseOrFetchArtifact(dispatch, FILES_PAGE, null, selectedFile, fileMin)
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
          fileMin.size >
            (frontendSpec?.artifact_limits?.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: fileMin => {
          getFullFile(fileMin).then(file => {
            if (file) {
              const downloadPath = `${fileMin?.target_path}${fileMin?.model_file || ''}`
              dispatch(
                setDownloadItem({
                  path: downloadPath,
                  user: file.producer?.owner,
                  id: downloadPath,
                  artifactLimits: frontendSpec?.artifact_limits,
                  fileSize: file.size,
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
        onClick: file => copyToClipboard(generateUri(file, FILES_PAGE), dispatch)
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: fileMin => getFullFile(fileMin).then(toggleConvertedYaml)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        hidden: isDetailsPopUp,
        className: 'danger',
        onClick: () =>
          openPopUp(DeleteArtifactPopUp, {
            artifact: fileMin,
            artifactType: ARTIFACT_TYPE,
            category: ARTIFACT_OTHER_TYPE,
            filters,
            refreshArtifacts,
            refreshAfterDeleteCallback
          }),
        allowLeaveWarning: true
      },
      {
        label: 'Delete all versions',
        icon: <Delete />,
        hidden: isAllVersions || isDetailsPopUp,
        className: 'danger',
        onClick: () =>
          openDeleteConfirmPopUp(
            'Delete artifact?',
            `Do you want to delete all versions of the artifact "${fileMin.db_key}"? Deleted artifacts can not be restored.`,
            () => {
              handleDeleteArtifact(
                dispatch,
                projectName,
                fileMin.db_key,
                fileMin.uid,
                refreshArtifacts,
                refreshAfterDeleteCallback,
                filters,
                ARTIFACT_TYPE,
                ARTIFACT_OTHER_TYPE,
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
        onClick: () => showAllVersions(fileMin.db_key),
        hidden: isAllVersions
      },
      {
        label: 'Preview',
        id: 'artifact-preview',
        disabled: !isTargetPathValid,
        icon: <ArtifactView />,
        onClick: fileMin => {
          getFullFile(fileMin).then(file => {
            if (file) {
              dispatch(
                showArtifactsPreview({
                  isPreview: true,
                  selectedItem: file
                })
              )
            }
          })
        }
      }
    ]
  ]
}

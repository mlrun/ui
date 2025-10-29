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
import { cloneDeep, isEmpty, omit } from 'lodash'

import { ARTIFACT_MAX_DOWNLOAD_SIZE, DOCUMENT_TYPE, DOCUMENTS_PAGE } from '../../constants'
import { openDeleteConfirmPopUp, openPopUp, copyToClipboard } from 'igz-controls/utils/common.util'
import { getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { applyTagChanges, chooseOrFetchArtifact } from '../../utils/artifacts.util'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { generateUri } from '../../utils/resources'
import DeleteArtifactPopUp from '../../elements/DeleteArtifactPopUp/DeleteArtifactPopUp'
import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { FULL_VIEW_MODE } from 'igz-controls/constants'
import { convertChipsData } from '../../utils/convertChipsData'
import { updateArtifact } from '../../reducers/artifactsReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import TagIcon from 'igz-controls/images/tag-icon.svg?react'
import YamlIcon from 'igz-controls/images/yaml.svg?react'
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
    label: 'collections',
    id: 'collections'
  }
]

export const infoHeaders = [
  { label: 'Key', id: 'db_key' },
  {
    label: 'Hash',
    id: 'hash',
    tip: 'Represents hash of the data. when the data changes the hash would change'
  },
  { label: 'Version tag', id: 'tag' },
  { label: 'Original source', id: 'original_source' },
  { label: 'Iter', id: 'iter' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Path', id: 'target_path' },
  { label: 'UID', id: 'uid' },
  { label: 'Updated', id: 'updated' },
  { label: 'Labels', id: 'labels' }
]

export const generatePageData = (viewMode, isDetailsPopUp = false) => {
  return {
    page: DOCUMENTS_PAGE,
    details: {
      type: DOCUMENTS_PAGE,
      menu: detailsMenu,
      infoHeaders,
      hideBackBtn: viewMode === FULL_VIEW_MODE && !isDetailsPopUp,
      withToggleViewBtn: true
    }
  }
}

export const generateActionsMenu = (
  documentMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  refreshArtifacts,
  refreshAfterDeleteCallback,
  filters,
  selectedDocument,
  showAllVersions,
  isAllVersions,
  isDetailsPopUp = false
) => {
  const isTargetPathValid = getIsTargetPathValid(documentMin ?? {}, frontendSpec)

  const getFullDocument = documentMin => {
    return chooseOrFetchArtifact(dispatch, DOCUMENTS_PAGE, null, selectedDocument, documentMin)
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
          documentMin.size >
            (frontendSpec?.artifact_limits?.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: documentMin => {
          getFullDocument(documentMin).then(document => {
            if (document) {
              const downloadPath = `${documentMin?.target_path}${documentMin?.model_file || ''}`
              dispatch(
                setDownloadItem({
                  path: downloadPath,
                  user: document.producer?.owner,
                  id: downloadPath,
                  artifactLimits: frontendSpec?.artifact_limits,
                  fileSize: document.size,
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
        onClick: document => copyToClipboard(generateUri(document, DOCUMENTS_PAGE), dispatch)
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: documentMin => getFullDocument(documentMin).then(toggleConvertedYaml)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        hidden: isDetailsPopUp,
        className: 'danger',
        onClick: () =>
          openPopUp(DeleteArtifactPopUp, {
            artifact: documentMin,
            artifactType: DOCUMENT_TYPE,
            category: DOCUMENT_TYPE,
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
            `Do you want to delete all versions of the artifact "${documentMin.db_key}"? Deleted artifacts can not be restored.`,
            () => {
              handleDeleteArtifact(
                dispatch,
                projectName,
                documentMin.db_key,
                documentMin.uid,
                refreshArtifacts,
                refreshAfterDeleteCallback,
                filters,
                DOCUMENT_TYPE,
                DOCUMENT_TYPE,
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
        onClick: () => showAllVersions(documentMin.db_key),
        hidden: isAllVersions
      }
    ]
  ]
}

export const handleApplyDetailsChanges = (
  changes,
  projectName,
  selectedItem,
  setNotification,
  dispatch
) => {
  const isNewFormat =
    selectedItem.ui.originalContent.metadata && selectedItem.ui.originalContent.spec
  const artifactItem = cloneDeep(
    isNewFormat ? selectedItem.ui.originalContent : omit(selectedItem, ['ui'])
  )

  if (!isEmpty(omit(changes.data, ['tag']))) {
    Object.keys(changes.data).forEach(key => {
      if (key === 'labels') {
        isNewFormat
          ? (artifactItem.metadata[key] = changes.data[key].currentFieldValue)
          : (artifactItem[key] = changes.data[key].currentFieldValue)
      }
    })

    const labels = convertChipsData(artifactItem.metadata?.labels || artifactItem.labels)

    if (isNewFormat) {
      artifactItem.metadata.labels = labels
    } else {
      artifactItem.labels = labels
    }

    return dispatch(updateArtifact({ project: projectName, data: artifactItem }))
      .unwrap()
      .then(response => {
        dispatch(
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Document was updated successfully'
          })
        )
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '', null, () =>
          handleApplyDetailsChanges(changes, projectName, selectedItem, setNotification, dispatch)
        )
      })
      .finally(() => {
        return applyTagChanges(changes, selectedItem, projectName, dispatch, setNotification)
      })
  } else {
    return applyTagChanges(changes, selectedItem, projectName, dispatch, setNotification)
  }
}

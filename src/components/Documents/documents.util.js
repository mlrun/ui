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
import { cloneDeep, debounce, isEmpty, isEqual, omit } from 'lodash'

import {
  ALL_VERSIONS_PATH,
  ARTIFACT_MAX_DOWNLOAD_SIZE,
  BE_PAGE,
  DOCUMENT_TYPE,
  DOCUMENTS_PAGE,
  DOCUMENTS_TAB,
  FULL_VIEW_MODE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  SHOW_ITERATIONS,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST,
  VIEW_SEARCH_PARAMETER
} from '../../constants'
import { getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { applyTagChanges, chooseOrFetchArtifact } from '../../utils/artifacts.util'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { generateUri } from '../../utils/resources'
import DeleteArtifactPopUp from '../../elements/DeleteArtifactPopUp/DeleteArtifactPopUp'
import { handleDeleteArtifact } from '../../utils/handleDeleteArtifact'
import { openDeleteConfirmPopUp, openPopUp } from 'igz-controls/utils/common.util'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { getErrorMsg } from 'igz-controls/utils/common.util'
import { convertChipsData } from '../../utils/convertChipsData'
import { updateArtifact } from '../../reducers/artifactsReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { parseIdentifier } from '../../utils'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { getFilteredSearchParams } from '../../utils/filter.util'

import { ReactComponent as TagIcon } from 'igz-controls/images/tag-icon.svg'
import { ReactComponent as YamlIcon } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Copy } from 'igz-controls/images/copy-to-clipboard-icon.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/download.svg'
import { ReactComponent as HistoryIcon } from 'igz-controls/images/history.svg'

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

export const generatePageData = viewMode => {
  return {
    page: DOCUMENTS_PAGE,
    details: {
      type: DOCUMENTS_TAB,
      menu: detailsMenu,
      infoHeaders,
      hideBackBtn: viewMode === FULL_VIEW_MODE,
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
  handleRefresh,
  filters,
  selectedDocument,
  showAllVersions,
  isAllVersions,
  isDetailsPopUp = false
) => {
  const isTargetPathValid = getIsTargetPathValid(documentMin ?? {}, frontendSpec)

  const getFullDocument = fileMin => {
    return chooseOrFetchArtifact(dispatch, DOCUMENTS_TAB, selectedDocument, documentMin)
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
          documentMin.size >
            (frontendSpec?.artifact_limits?.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: documentMin => {
          getFullDocument(documentMin).then(document => {
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
          })
        }
      },
      {
        label: 'Copy URI',
        icon: <Copy />,
        onClick: document => copyToClipboard(generateUri(document, DOCUMENTS_TAB), dispatch)
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
            handleRefresh
          })
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
                handleRefresh,
                filters,
                DOCUMENT_TYPE,
                DOCUMENT_TYPE,
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
            message: 'Model was updated successfully'
          })
        )
      })
      .catch(error => {
        const customErrorMsg =
          error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
            ? 'Permission denied'
            : getErrorMsg(error, 'Failed to update the model')

        showErrorNotification(dispatch, error, '', customErrorMsg, () =>
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

export const checkForSelectedDocument = debounce(
  (
    paramsName,
    documents,
    paramsId,
    projectName,
    setSelectedDocument,
    navigate,
    isAllVersions,
    searchParams,
    paginationConfigRef
  ) => {
    if (paramsId) {
      const searchBePage = parseInt(searchParams.get(BE_PAGE))
      const configBePage = paginationConfigRef.current[BE_PAGE]
      const { tag, uid, iter } = parseIdentifier(paramsId)

      if (documents.length > 0 && searchBePage === configBePage) {
        const searchItem = searchArtifactItem(
          documents.map(artifact => artifact.data ?? artifact),
          paramsName,
          tag,
          iter,
          uid
        )

        if (!searchItem) {
          navigate(
            `/projects/${projectName}/documents${isAllVersions ? `/${paramsName}/${ALL_VERSIONS_PATH}` : ''}${getFilteredSearchParams(
              window.location.search,
              [VIEW_SEARCH_PARAMETER]
            )}`,
            { replace: true }
          )
        } else {
          setSelectedDocument(prevState => {
            return isEqual(prevState, searchItem) ? prevState : searchItem
          })
        }
      }
    } else {
      setSelectedDocument({})
    }
  }
)

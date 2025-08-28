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

import {
  ARTIFACT_MAX_DOWNLOAD_SIZE,
  ITERATIONS_FILTER,
  LABELS_FILTER,
  LLM_PROMPTS_PAGE,
  MODEL_NAME_FILTER,
  MODEL_TAG_FILTER,
  NAME_FILTER,
  SHOW_ITERATIONS,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../../constants'
import { applyTagChanges, chooseOrFetchArtifact } from '../../utils/artifacts.util'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { generateUri } from '../../utils/resources'
import { getIsTargetPathValid } from '../../utils/createArtifactsContent'
import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'
import { showArtifactsPreview } from '../../reducers/artifactsReducer'
import { FULL_VIEW_MODE } from 'igz-controls/constants'

import TagIcon from 'igz-controls/images/tag-icon.svg?react'
import YamlIcon from 'igz-controls/images/yaml.svg?react'
import ArtifactView from 'igz-controls/images/eye-icon.svg?react'
import Copy from 'igz-controls/images/copy-to-clipboard-icon.svg?react'
import DownloadIcon from 'igz-controls/images/download.svg?react'
import HistoryIcon from 'igz-controls/images/history.svg?react'

export const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'Prompt template',
    id: 'prompt-template'
  },
  {
    label: 'Generation configuration',
    id: 'generation-configuration'
  }
]

export const infoHeaders = [
  { label: 'Key', id: 'db_key' },
  { label: 'Model name', id: 'model_artifact' },
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
    page: LLM_PROMPTS_PAGE,
    details: {
      type: LLM_PROMPTS_PAGE,
      menu: detailsMenu,
      infoHeaders,
      hideBackBtn: viewMode === FULL_VIEW_MODE && !isDetailsPopUp,
      withToggleViewBtn: true
    }
  }
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

export const generateActionsMenu = (
  llmPromptMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  refreshArtifacts,
  refreshAfterDeleteCallback,
  llmPromptsFilters,
  selectedLLMPrompt,
  showAllVersions,
  isAllVersions,
  isDetailsPopUp = false
) => {
  const isTargetPathValid = getIsTargetPathValid(llmPromptMin ?? {}, frontendSpec)
  //TODO: uncomment when MEP delete will be implemented
  // const llmPromptDataCouldBeDeleted =
  //   llmPromptMin?.target_path?.endsWith('.pq') || llmPromptMin?.target_path?.endsWith('.parquet')

  const getFullLLMPrompt = llmPromptMin => {
    return chooseOrFetchArtifact(dispatch, LLM_PROMPTS_PAGE, null, selectedLLMPrompt, llmPromptMin)
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
          llmPromptMin.size >
            (frontendSpec.artifact_limits.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: llmPromptMin => {
          getFullLLMPrompt(llmPromptMin).then(llmPrompt => {
            if (llmPrompt) {
              const downloadPath = `${llmPrompt?.target_path}${llmPrompt?.model_file || ''}`
              dispatch(
                setDownloadItem({
                  path: downloadPath,
                  user: llmPrompt.producer?.owner,
                  id: downloadPath,
                  artifactLimits: frontendSpec?.artifact_limits,
                  fileSize: llmPrompt.size,
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
        onClick: llmPromptMin =>
          copyToClipboard(generateUri(llmPromptMin, LLM_PROMPTS_PAGE), dispatch)
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: llmPromptMin => getFullLLMPrompt(llmPromptMin).then(toggleConvertedYaml)
      }
      //TODO: uncomment when MEP delete will be implemented,
      // correct delete confirmation message ( currently it's shown as Llm-prompt deleted, should be LLM prompt deleted  )
      // {
      //   label: 'Delete',
      //   icon: <Delete />,
      //   hidden: isDetailsPopUp,
      //   className: 'danger',
      //   onClick: () =>
      //     llmPromptDataCouldBeDeleted
      //       ? openPopUp(DeleteArtifactPopUp, {
      //           artifact: llmPromptMin,
      //           artifactType: LLM_PROMPT_TYPE,
      //           category: LLM_PROMPT_TYPE,
      //           filters: llmPromptsFilters,
      //           refreshArtifacts,
      //           refreshAfterDeleteCallback
      //         })
      //       : openDeleteConfirmPopUp(
      //           'Delete LLM Prompt?',
      //           `Do you want to delete the LLM Prompt "${llmPromptMin.db_key}"? Deleted LLM Prompt can not be restored.`,
      //           () => {
      //             handleDeleteArtifact(
      //               dispatch,
      //               projectName,
      //               llmPromptMin.db_key,
      //               llmPromptMin.uid,
      //               refreshArtifacts,
      //               refreshAfterDeleteCallback,
      //               llmPromptsFilters,
      //               LLM_PROMPT_TYPE
      //             )
      //           }
      //         ),
      //   allowLeaveWarning: true
      // },
      // {
      //   label: 'Delete all versions',
      //   icon: <Delete />,
      //   hidden: isDetailsPopUp || isAllVersions,
      //   className: 'danger',
      //   onClick: () =>
      //     openDeleteConfirmPopUp(
      //       'Delete LLM Prompt?',
      //       `Do you want to delete all versions of the LLM Prompt "${llmPromptMin.db_key}"? Deleted LLM prompt can not be restored.`,
      //       () => {
      //         handleDeleteArtifact(
      //           dispatch,
      //           projectName,
      //           llmPromptMin.db_key,
      //           llmPromptMin.uid,
      //           refreshArtifacts,
      //           refreshAfterDeleteCallback,
      //           llmPromptsFilters,
      //           LLM_PROMPT_TYPE,
      //           LLM_PROMPT_TYPE,
      //           true
      //         )
      //       }
      //     ),
      //   allowLeaveWarning: true
      // }
    ],
    [
      {
        id: 'show-all-versions',
        label: 'Show all versions',
        icon: <HistoryIcon />,
        onClick: () => showAllVersions(llmPromptMin.db_key),
        hidden: isAllVersions
      },
      {
        label: 'Preview',
        id: 'llm-prompt-preview',
        disabled: !isTargetPathValid,
        icon: <ArtifactView />,
        onClick: llmPromptMin => {
          getFullLLMPrompt(llmPromptMin).then(llmPrompt => {
            if (llmPrompt) {
              dispatch(
                showArtifactsPreview({
                  isPreview: true,
                  selectedItem: llmPrompt
                })
              )
            }
          })
        }
      }
    ]
  ]
}

export const getFiltersConfig = isAllVersions => ({
  [NAME_FILTER]: { label: 'Name:', initialValue: '', hidden: isAllVersions },
  [TAG_FILTER]: {
    label: 'LLM prompt version tag:',
    initialValue: isAllVersions ? TAG_FILTER_ALL_ITEMS : TAG_FILTER_LATEST,
    isModal: true
  },
  [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true },
  [ITERATIONS_FILTER]: {
    label: 'Show best iteration only',
    initialValue: isAllVersions ? '' : SHOW_ITERATIONS,
    isModal: true
  },
  [MODEL_NAME_FILTER]: {
    label: 'Model name:',
    initialValue: '',
    isModal: true
  },
  [MODEL_TAG_FILTER]: {
    label: 'Model version tag:',
    initialValue: '',
    isModal: true
  }
})

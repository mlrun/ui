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
import Prism from 'prismjs'

import { PopUpDialog } from 'igz-controls/components'

import {
  MODELS_PAGE,
  MODELS_TAB,
  TAG_LATEST,
  MODEL_TYPE,
  ARTIFACT_MAX_DOWNLOAD_SIZE
} from '../../../constants'
import {
  getErrorMsg,
  openPopUp,
  openDeleteConfirmPopUp,
  copyToClipboard
} from 'igz-controls/utils/common.util'
import { showArtifactsPreview, updateArtifact } from '../../../reducers/artifactsReducer'
import { FORBIDDEN_ERROR_STATUS_CODE, FULL_VIEW_MODE } from 'igz-controls/constants'
import {
  applyTagChanges,
  chooseOrFetchArtifact,
  processActionAfterTagUniquesValidation
} from '../../../utils/artifacts.util'
import { convertChipsData } from '../../../utils/convertChipsData'
import { getIsTargetPathValid } from '../../../utils/createArtifactsContent'
import { generateUri } from '../../../utils/resources'
import { handleDeleteArtifact } from '../../../utils/handleDeleteArtifact'
import { setDownloadItem, setShowDownloadsList } from '../../../reducers/downloadReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import {
  decreaseDetailsLoadingCounter,
  increaseDetailsLoadingCounter
} from '../../../reducers/detailsReducer'

import TagIcon from 'igz-controls/images/tag-icon.svg?react'
import YamlIcon from 'igz-controls/images/yaml.svg?react'
import ArtifactView from 'igz-controls/images/eye-icon.svg?react'
import Copy from 'igz-controls/images/copy-to-clipboard-icon.svg?react'
import Delete from 'igz-controls/images/delete.svg?react'
import DeployIcon from 'igz-controls/images/deploy-icon.svg?react'
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
  { label: 'Kind', id: 'kind' },
  { label: 'Size', id: 'size' },
  { label: 'Path', id: 'target_path' },
  { label: 'URI', id: 'target_uri' },
  { label: 'Model file', id: 'model_file' },
  { label: 'Feature vector', id: 'feature_vector' },
  { label: 'Updated', id: 'updated' },
  { label: 'Framework', id: 'framework' },
  { label: 'Algorithm', id: 'algorithm' },
  { label: 'Labels', id: 'labels' },
  { label: 'Metrics', id: 'metrics' }
]

export const generateModelsDetailsMenu = selectedModel => [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'preview',
    id: 'preview',
    hidden:
      isEmpty(selectedModel.extra_data) &&
      isEmpty(selectedModel.preview) &&
      isEmpty(selectedModel.schema) &&
      !selectedModel.target_path
  },
  {
    label: 'features',
    id: 'features',
    hidden:
      !selectedModel.features &&
      !selectedModel.inputs &&
      !selectedModel.outputs &&
      !selectedModel.feature_vector
  },
  {
    label: 'statistics',
    id: 'statistics',
    hidden: !selectedModel.stats && !selectedModel.feature_stats && !selectedModel.feature_vector,
    tip: 'Note that some values may be empty due to the use of different engines for calculating statistics'
  }
]

export const generatePageData = (viewMode, isDetailsPopUp = false, selectedItem) => ({
  page: MODELS_PAGE,
  details: {
    menu: generateModelsDetailsMenu(selectedItem),
    infoHeaders,
    type: MODELS_TAB,
    hideBackBtn: viewMode === FULL_VIEW_MODE && !isDetailsPopUp,
    withToggleViewBtn: true
  }
})

export const getFeatureVectorData = uri => {
  const [name, tag = TAG_LATEST] = uri.slice(uri.lastIndexOf('/') + 1).split(/[@:]/)

  return { name, tag }
}

export const handleApplyDetailsChanges = (
  changes,
  projectName,
  selectedItem,
  setNotification,
  dispatch
) => {
  const updateModel = () => {
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

  return processActionAfterTagUniquesValidation({
    tag: changes?.data?.tag?.currentFieldValue,
    artifact: selectedItem,
    projectName,
    dispatch,
    actionCallback: updateModel,
    throwError: true,
    showLoader: () => dispatch(increaseDetailsLoadingCounter()),
    hideLoader: () => dispatch(decreaseDetailsLoadingCounter())
  }).finally(() => {})
}

export const generateActionsMenu = (
  modelMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  handleRefresh,
  refreshAfterDeleteCallback,
  modelsFilters,
  selectedModel,
  showAllVersions,
  isAllVersions,
  isDetailsPopUp = false,
  handleDeployModel
) => {
  const isTargetPathValid = getIsTargetPathValid(modelMin ?? {}, frontendSpec)

  const getFullModel = modelMin => {
    return chooseOrFetchArtifact(dispatch, MODELS_PAGE, MODELS_TAB, selectedModel, modelMin)
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
          modelMin.size >
            modelMin.size >
            (frontendSpec?.artifact_limits?.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: modelMin => {
          getFullModel(modelMin).then(model => {
            if (model) {
              const downloadPath = `${model?.target_path}${model?.model_file || ''}`
              dispatch(
                setDownloadItem({
                  path: downloadPath,
                  user: model.producer?.owner,
                  id: downloadPath,
                  artifactLimits: frontendSpec?.artifact_limits,
                  fileSize: model.size,
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
        onClick: model => copyToClipboard(generateUri(model, MODELS_PAGE), dispatch)
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: modelMin => getFullModel(modelMin).then(toggleConvertedYaml)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        className: 'danger',
        hidden: isDetailsPopUp,
        disabled: modelMin?.has_children,
        tooltip: modelMin?.has_children
          ? 'There are llm-prompt artifacts pointing to this model. The model cannot be deleted'
          : null,
        onClick: () =>
          openDeleteConfirmPopUp(
            'Delete model?',
            `Do you want to delete the model "${modelMin.db_key}"? Deleted models can not be restored.`,
            () => {
              handleDeleteArtifact(
                dispatch,
                projectName,
                modelMin.db_key,
                modelMin.uid,
                handleRefresh,
                refreshAfterDeleteCallback,
                modelsFilters,
                MODEL_TYPE
              )
            }
          ),
        allowLeaveWarning: true
      },
      {
        label: 'Delete all versions',
        icon: <Delete />,
        hidden: isAllVersions || isDetailsPopUp,
        disabled: modelMin?.has_children,
        tooltip: modelMin?.has_children
          ? 'There are llm-prompt artifacts pointing to this model. The model cannot be deleted'
          : null,
        className: 'danger',
        onClick: () =>
          openDeleteConfirmPopUp(
            'Delete model?',
            `Do you want to delete all versions of the model "${modelMin.db_key}"? Deleted models can not be restored.`,
            () => {
              handleDeleteArtifact(
                dispatch,
                projectName,
                modelMin.db_key,
                modelMin.uid,
                handleRefresh,
                refreshAfterDeleteCallback,
                modelsFilters,
                MODEL_TYPE,
                MODEL_TYPE,
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
        onClick: () => showAllVersions(modelMin.db_key),
        hidden: isAllVersions
      },
      {
        label: 'Preview',
        id: 'model-preview',
        disabled: !isTargetPathValid,
        icon: <ArtifactView />,
        onClick: modelMin => {
          getFullModel(modelMin).then(model => {
            if (model) {
              dispatch(
                showArtifactsPreview({
                  isPreview: true,
                  selectedItem: model
                })
              )
            }
          })
        }
      },
      {
        label: 'Deploy',
        id: 'model-deploy',
        icon: <DeployIcon />,
        onClick: handleDeployModel,
        hidden: isDetailsPopUp
      }
    ]
  ]
}

export const handleDeployModelFailure = (projectName, modelName) => {
  const codeSnippet = `project = mlrun.get_or_create_project("${projectName}", context="./")

# Specify the runtime image: mlrun/mlrun or mlrun/mlrun-gpu
image = "mlrun/mlrun"

# Use your custom class name
serving_model_class_name = <Class name>

# Create a serving function
serving_fn = mlrun.new_function("serving", project="${projectName}", kind="serving", image=image)
serving_fn.add_model(key="myKey", model_path=project.get_artifact_uri("${modelName}"))

serving_fn.deploy()`

  openPopUp(PopUpDialog, {
    children: (
      <>
        <div>
          See how to create a serving function in{' '}
          <a
            className="link"
            href="https://docs.mlrun.org/en/stable/serving/built-in-model-serving.html"
            rel="noreferrer"
            target="_blank"
          >
            https://docs.mlrun.org/en/stable/serving/built-in-model-serving.html
          </a>{' '}
          and{' '}
          <a
            className="link"
            href="https://docs.mlrun.org/en/stable/tutorials/03-model-serving.html"
            rel="noreferrer"
            target="_blank"
          >
            https://docs.mlrun.org/en/stable/tutorials/03-model-serving.html
          </a>
        </div>
        <p>Basic example:</p>
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(codeSnippet, Prism.languages.py, 'py')
            }}
          />
        </pre>
      </>
    ),
    className: 'deploy-model-failure-popup',
    headerText: 'Model cannot be deployed'
  })
}

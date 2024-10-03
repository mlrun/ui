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
import { cloneDeep, isEmpty, isEqual, omit } from 'lodash'
import Prism from 'prismjs'

import { PopUpDialog } from 'igz-controls/components'

import {
  ITERATIONS_FILTER,
  LABELS_FILTER,
  NAME_FILTER,
  TAG_FILTER,
  MODELS_PAGE,
  MODELS_TAB,
  TAG_LATEST,
  FULL_VIEW_MODE,
  MODEL_TYPE,
  ACTION_MENU_PARENT_ROW,
  ACTION_MENU_PARENT_ROW_EXPANDED,
  ARTIFACT_MAX_DOWNLOAD_SIZE
} from '../../../constants'
import {
  showArtifactsPreview,
  updateArtifact
} from '../../../reducers/artifactsReducer'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { applyTagChanges, chooseOrFetchArtifact } from '../../../utils/artifacts.util'
import { convertChipsData } from '../../../utils/convertChipsData'
import { copyToClipboard } from '../../../utils/copyToClipboard'
import { getIsTargetPathValid } from '../../../utils/createArtifactsContent'
import { generateUri } from '../../../utils/resources'
import { getErrorMsg } from 'igz-controls/utils/common.util'
import { handleDeleteArtifact } from '../../../utils/handleDeleteArtifact'
import { openDeleteConfirmPopUp } from 'igz-controls/utils/common.util'
import { searchArtifactItem } from '../../../utils/searchArtifactItem'
import { setDownloadItem, setShowDownloadsList } from '../../../reducers/downloadReducer'
import { showErrorNotification } from '../../../utils/notifications.util'
import { openPopUp } from 'igz-controls/utils/common.util'

import { ReactComponent as TagIcon } from 'igz-controls/images/tag-icon.svg'
import { ReactComponent as YamlIcon } from 'igz-controls/images/yaml.svg'
import { ReactComponent as ArtifactView } from 'igz-controls/images/eye-icon.svg'
import { ReactComponent as Copy } from 'igz-controls/images/copy-to-clipboard-icon.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as DeployIcon } from 'igz-controls/images/deploy-icon.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/download.svg'

export const filters = [
  { type: TAG_FILTER, label: 'Version tag:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: ITERATIONS_FILTER, label: 'Show best iteration only:' }
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

export const generatePageData = (selectedItem, viewMode) => ({
  page: MODELS_PAGE,
  details: {
    menu: generateModelsDetailsMenu(selectedItem),
    infoHeaders,
    type: MODELS_TAB,
    hideBackBtn: viewMode === FULL_VIEW_MODE,
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
        return applyTagChanges(
          changes,
          selectedItem,
          projectName,
          dispatch,
          setNotification
        )
      })
  } else {
    return applyTagChanges(
      changes,
      selectedItem,
      projectName,
      dispatch,
      setNotification
    )
  }
}

export const checkForSelectedModel = (
  name,
  selectedRowData,
  models,
  tag,
  iter,
  uid,
  navigate,
  projectName,
  setSelectedModel
) => {
  queueMicrotask(() => {
    if (name) {
      const artifacts = selectedRowData?.[name]?.content || models

      if (artifacts.length > 0) {
        const searchItem = searchArtifactItem(
          artifacts.map(artifact => artifact.data ?? artifact),
          name,
          tag,
          iter,
          uid
        )

        if (!searchItem) {
          navigate(`/projects/${projectName}/models/models`)
        } else {
          setSelectedModel(prevState => {
            return isEqual(prevState, searchItem) ? prevState : searchItem
          })
        }
      }
    } else {
      setSelectedModel({})
    }
  })
}

export const generateActionsMenu = (
  modelMin,
  frontendSpec,
  dispatch,
  toggleConvertedYaml,
  handleAddTag,
  projectName,
  handleRefresh,
  modelsFilters,
  handleDeployModel,
  menuPosition,
  selectedModel
) => {
  const isTargetPathValid = getIsTargetPathValid(modelMin ?? {}, frontendSpec)

  const getFullModel = modelMin => {
    return chooseOrFetchArtifact(dispatch, MODELS_TAB, selectedModel, modelMin)
  }

  return [
    [
      {
        label: 'Add a tag',
        hidden: menuPosition === ACTION_MENU_PARENT_ROW_EXPANDED,
        icon: <TagIcon />,
        onClick: handleAddTag
      },
      {
        label: 'Download',
        hidden: menuPosition === ACTION_MENU_PARENT_ROW_EXPANDED,
        disabled:
          !isTargetPathValid ||
          modelMin.size > (frontendSpec?.artifact_limits?.max_download_size ?? ARTIFACT_MAX_DOWNLOAD_SIZE),
        icon: <DownloadIcon />,
        onClick: modelMin => {
          getFullModel(modelMin).then(model => {
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
          })
        }
      },
      {
        label: 'Copy URI',
        hidden: menuPosition === ACTION_MENU_PARENT_ROW_EXPANDED,
        icon: <Copy />,
        onClick: model => copyToClipboard(generateUri(model, MODELS_TAB), dispatch)
      },
      {
        label: 'View YAML',
        hidden: menuPosition === ACTION_MENU_PARENT_ROW_EXPANDED,
        icon: <YamlIcon />,
        onClick: modelMin => getFullModel(modelMin).then(toggleConvertedYaml)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        className: 'danger',
        hidden: [ACTION_MENU_PARENT_ROW, ACTION_MENU_PARENT_ROW_EXPANDED].includes(menuPosition),
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
                modelsFilters,
                MODEL_TYPE
              )
            }
          )
      },
      {
        label: 'Delete all',
        icon: <Delete />,
        hidden: ![ACTION_MENU_PARENT_ROW, ACTION_MENU_PARENT_ROW_EXPANDED].includes(menuPosition),
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
                modelsFilters,
                MODEL_TYPE,
                MODEL_TYPE,
                true
              )
            }
          )
      }
    ],
    [
      {
        label: 'Preview',
        id: 'model-preview',
        disabled: !isTargetPathValid,
        icon: <ArtifactView />,
        onClick: modelMin => {
          getFullModel(modelMin).then(model => {
            dispatch(
              showArtifactsPreview({
                isPreview: true,
                selectedItem: model
              })
            )
          })
        }
      },
      {
        label: 'Deploy',
        id: 'model-deploy',
        icon: <DeployIcon />,
        onClick: handleDeployModel
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

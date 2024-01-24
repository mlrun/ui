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
import { get, isEmpty, isEqual, cloneDeep } from 'lodash'

import {
  DATASETS_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  FILES_PAGE,
  FUNCTION_TYPE_LOCAL,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../../constants'
import { formatDatetime, generateLinkPath } from '../../utils'
import { isArtifactTagUnique } from '../../utils/artifacts.util'
import { getFunctionImage } from '../FunctionsPage/functions.util'
import { generateFunctionDetailsLink } from '../../utils/generateFunctionDetailsLink'

export const generateArtifactsContent = (detailsType, selectedItem, projectName) => {
  if (detailsType === MODEL_ENDPOINTS_TAB) {
    const monitoringFeatureSetUri = selectedItem?.status?.monitoring_feature_set_uri ?? ''

    return {
      uid: {
        value: selectedItem?.metadata?.uid ?? '-'
      },
      model_class: {
        value: selectedItem?.spec?.model_class ?? '-'
      },
      stream_path: {
        value: selectedItem?.spec?.stream_path ?? '-'
      },
      model_artifact: {
        value: selectedItem?.spec?.model_uri?.replace(/^store:\/\/artifacts\//, ''),
        link: `${generateLinkPath(selectedItem?.spec?.model_uri)}/overview`
      },
      function_uri: {
        value: selectedItem?.spec?.function_uri,
        link: generateFunctionDetailsLink(selectedItem.spec.function_uri)
      },
      function_tag: {
        value: selectedItem?.spec?.function_uri?.match(/(?<=:)[^:]*$/) || 'latest'
      },
      monitoring_feature_set_uri: {
        value: monitoringFeatureSetUri,
        link: monitoringFeatureSetUri
          ? `${generateLinkPath(monitoringFeatureSetUri)}${
              monitoringFeatureSetUri.split(':').length > 2 ? '' : '/latest'
            }/overview`
          : ''
      },
      last_prediction: {
        value: formatDatetime(selectedItem?.status?.last_request, '-')
      },
      error_count: {
        value: selectedItem?.status?.error_count ?? '-'
      },
      accuracy: {
        value: selectedItem?.status?.accuracy ?? '-'
      }
    }
  } else {
    return {
      hash: {
        value: selectedItem.hash ?? '',
        copyToClipboard: selectedItem.hash?.length > 0
      },
      db_key: {
        value: selectedItem.db_key
      },
      tag: {
        value: selectedItem.tag ?? '',
        editModeEnabled: true,
        editModeType: 'formInput',
        fieldData: {
          async: true,
          name: 'tag',
          validationRules: {
            name: 'common.tag',
            additionalRules: {
              name: 'tagUniqueness',
              label: 'Artifact tag must be unique',
              pattern: isArtifactTagUnique(projectName, detailsType, selectedItem),
              async: true
            }
          }
        },
        handleDiscardChanges: (formState, detailsStore) => {
          formState.form.change(
            'tag',
            detailsStore.changes.data.tag?.currentFieldValue ?? formState.initialValues.tag
          )
        }
      },
      iter: {
        value: selectedItem.iter || '0'
      },
      kind: {
        value:
          detailsType !== FEATURE_STORE_PAGE &&
          detailsType !== FILES_PAGE &&
          detailsType !== DATASETS_PAGE
            ? selectedItem.kind || ' '
            : null
      },
      size: {
        value: selectedItem.size ?? ''
      },
      label_column: {
        value: selectedItem.label_column ?? ''
      },
      target_path: {
        value: selectedItem.target_path,
        copyToClipboard: true
      },
      target_uri: {
        value: selectedItem.URI,
        copyToClipboard: true
      },
      metrics: {
        value: selectedItem.metrics ?? []
      },
      model_file: {
        value: selectedItem.model_file
      },
      feature_vector: {
        value: selectedItem.feature_vector,
        link: `${generateLinkPath(selectedItem.feature_vector)}/overview`
      },
      tree: {
        value: selectedItem.tree,
        copyToClipboard: selectedItem.tree?.length > 0
      },
      updated: {
        value: formatDatetime(selectedItem.updated, 'N/A')
      },
      framework: {
        value: detailsType === MODELS_TAB ? selectedItem.framework ?? '' : null
      },
      algorithm: {
        value: selectedItem.algorithm
      },
      labels: {
        value: selectedItem.labels ?? [],
        fieldData: {
          name: 'labels'
        },
        editModeEnabled: detailsType === MODELS_TAB,
        editModeType: 'chips'
      }
    }
  }
}

export const generateFeatureStoreContent = (detailsType, selectedItem) => {
  if (detailsType === FEATURE_SETS_TAB) {
    return generateFeatureSetsOverviewContent(selectedItem)
  } else if (detailsType === FEATURE_VECTORS_TAB) {
    return generateFeatureVectorsOverviewContent(selectedItem)
  }
}

export const generateJobsContent = selectedItem => {
  const sparkUiUrl = selectedItem.ui_run ? { sparkUiUrl: { value: selectedItem.ui_run } } : {}

  return {
    ...sparkUiUrl,
    uid: {
      value: selectedItem.uid
    },
    startTime: {
      value: formatDatetime(
        selectedItem.startTime,
        selectedItem.state?.value === 'aborted' ? 'N/A' : 'Not yet started'
      )
    },
    updated: {
      value: formatDatetime(selectedItem.updated, 'N/A')
    },
    runOnSpot: {
      value: selectedItem.ui.runOnSpot
    },
    nodeSelectorChips: {
      value: selectedItem.ui.nodeSelectorChips
    },
    priority: {
      value: selectedItem.ui.priority
    },
    parameters: {
      value: selectedItem.parametersChips
    },
    function: {
      value: selectedItem.function
    },
    functionTag: {
      value: selectedItem.ui?.functionTag ?? ''
    },
    resultsChips: {
      value: selectedItem.resultsChips
    },
    labels: {
      value: selectedItem.labels
    },
    logLevel: {
      value: selectedItem.logLevel
    },
    outputPath: {
      value: selectedItem.outputPath
    },
    iterations: {
      value:
        selectedItem.iteration >= 0
          ? selectedItem.iteration
          : selectedItem.iterationStats?.length
          ? selectedItem.iterationStats.length - 1
          : 'N/A'
    }
  }
}

export const generateFunctionsContent = selectedItem => ({
  name: {
    value: selectedItem.name
  },
  type: {
    value: selectedItem.type || FUNCTION_TYPE_LOCAL
  },
  hash: {
    value: selectedItem.hash
  },
  tag: {
    value: selectedItem.tag
  },
  codeOrigin: {
    value: selectedItem.build?.code_origin ?? ''
  },
  updated: {
    value: formatDatetime(selectedItem.updated, 'N/A')
  },
  command: {
    value: selectedItem.command
  },
  defaultHandler: {
    value: selectedItem.default_handler
  },
  image: {
    value: getFunctionImage(selectedItem)
  },
  description: {
    value: selectedItem.description
  }
})

export const generateFeatureSetsOverviewContent = selectedItem => ({
  description: {
    value: selectedItem.description ?? '',
    editModeEnabled: true,
    editModeType: 'textarea',
    fieldData: {
      name: 'description'
    },
    handleDiscardChanges: (formState, detailsStore) => {
      formState.form.change(
        'description',
        detailsStore.changes.data.description?.currentFieldValue ??
          formState.initialValues.description
      )
    }
  },
  labels: {
    value: selectedItem.labels ?? [],
    editModeEnabled: true,
    editModeType: 'chips',
    fieldData: {
      name: 'labels'
    }
  },
  tag: {
    value: selectedItem.tag
  },
  updated: {
    value: formatDatetime(selectedItem.updated, 'N/A')
  },
  usage_example: {
    value: selectedItem.usage_example ?? ''
  },
  entities: {
    value: selectedItem.entities?.map(entity => entity.name).join(', ')
  },
  engineType: {
    value: selectedItem?.engine ?? ''
  },
  target_uri: {
    value: selectedItem.URI,
    copyToClipboard: true
  },
  timestamp_key: {
    value: selectedItem.timestamp_key ?? ''
  },
  // temporary hidden
  // relations: {
  //   value: isEmpty(selectedItem.relations) ? [] : selectedItem.relations
  // },
  label_column: {
    value: selectedItem.label_column ?? ''
  }
})

export const generateFeatureVectorsOverviewContent = selectedItem => ({
  description: {
    value: selectedItem.description ?? '',
    editModeEnabled: true,
    editModeType: 'textarea',
    fieldData: {
      name: 'description'
    },
    handleDiscardChanges: (formState, detailsStore) => {
      formState.form.change(
        'description',
        detailsStore.changes.data.description?.currentFieldValue ??
          formState.initialValues.description
      )
    }
  },
  labels: {
    value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
    editModeEnabled: true,
    editModeType: 'chips',
    fieldData: {
      name: 'labels'
    }
  },
  tag: {
    value: selectedItem.tag
  },
  target_uri: {
    value: selectedItem.URI,
    copyToClipboard: true
  },
  updated: {
    value: formatDatetime(selectedItem.updated, 'N/A')
  },
  entities: {
    value: selectedItem.index_keys?.join(', ')
  },
  usage_example: {
    value: selectedItem.usage_example ?? ''
  },
  label_column: {
    value: selectedItem.label_feature ?? ''
  }
})

export const handleFinishEdit = (
  changes,
  detailsTabActions,
  detailsTabDispatch,
  setChangesData,
  setChangesCounter,
  currentField,
  formState,
  fields
) => {
  detailsTabDispatch({
    type: detailsTabActions.RESET_EDIT_MODE
  })

  const changesData = cloneDeep(changes.data)
  const initialFieldValue = formState.initialValues[currentField]
  let currentFieldValue = formState.values[currentField]

  if (!currentFieldValue && isEmpty(initialFieldValue)) {
    currentFieldValue = formState.initialValues[currentField]
  }

  if (currentField in get(formState, 'initialValues', {})) {
    if (isEqual(formState.initialValues[currentField], currentFieldValue)) {
      delete changesData[currentField]
    } else {
      changesData[currentField] = {
        initialFieldValue: formState.initialValues[currentField],
        currentFieldValue: currentFieldValue
      }
    }
  } else {
    fields.forEach(field => {
      if (changes.data[field]) {
        if (isEqual(changesData[field]?.initialFieldValue, changesData[field]?.currentFieldValue)) {
          delete changesData[field]
        } else {
          changesData[field] = {
            initialFieldValue: changesData[field].initialFieldValue,
            currentFieldValue: changesData[field].currentFieldValue,
            previousFieldValue: changesData[field].currentFieldValue
          }
        }
      }
    })
  }

  setChangesCounter(countChanges(changesData))
  setChangesData({ ...changesData })
}

export const countChanges = changesData => {
  let changesCounter = 0

  Object.keys(changesData).forEach(field => {
    if (field === 'features') {
      changesData.features.initialFieldValue.forEach(item => {
        if (
          !JSON.stringify(changesData.features.currentFieldValue).includes(JSON.stringify(item))
        ) {
          changesCounter++
        }
      })
    } else if (field !== 'label_feature') {
      changesCounter++
    }
  })

  return changesCounter
}

export const generateArtifactIndexes = (artifactsIndexes, index, setArtifactsIndexes) => {
  const newArtifactsIndexes = artifactsIndexes.filter(artifactIndex => artifactIndex !== index)

  if (!artifactsIndexes.includes(index)) {
    newArtifactsIndexes.push(index)
  }

  setArtifactsIndexes(newArtifactsIndexes)
}

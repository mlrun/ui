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

import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'
import FunctionPopUp from '../../elements/DetailsPopUp/FunctionPopUp/FunctionPopUp'
import FeatureSetPopUp from '../../elements/DetailsPopUp/FeatureSetPopUp/FeatureSetPopUp'
import JobPopUp from '../../elements/DetailsPopUp/JobPopUp/JobPopUp'

import {
  getValidationRules,
  getInternalLabelsValidationRule
} from 'igz-controls/utils/validation.util'

import {
  DATASETS_PAGE,
  DOCUMENTS_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FILES_PAGE,
  FUNCTION_TYPE_APPLICATION,
  FUNCTION_TYPE_LOCAL,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB,
  TAG_LATEST
} from '../../constants'
import { generateLinkPath, parseUri } from '../../utils'
import { getFunctionImage } from '../FunctionsPage/functions.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import {
  setChangesCounter,
  setChangesData,
  setFiltersWasHandled,
  showWarning
} from 'igz-controls/reducers/commonDetailsReducer'

export const generateArtifactsContent = (
  detailsType,
  selectedItem,
  projectName,
  isDetailsPopUp,
  internal_labels
) => {
  if (detailsType === MODEL_ENDPOINTS_TAB) {
    const monitoringFeatureSetUri = selectedItem?.spec?.monitoring_feature_set_uri ?? ''
    const featureSetParsedUri = parseUri(monitoringFeatureSetUri)

    return {
      uid: {
        value: selectedItem?.metadata?.uid ?? '-'
      },
      model_class: {
        value: selectedItem?.spec?.model_class ?? '-'
      },
      model_artifact: {
        value: selectedItem?.spec?.model_uri?.replace(/^store:\/\/artifacts\//, ''),
        shouldPopUp: !isEmpty(selectedItem?.spec?.model_uri),
        handleClick: () =>
          openPopUp(ArtifactPopUp, {
            artifactData: parseUri(selectedItem?.spec?.model_uri)
          })
      },
      function_uri: {
        value: selectedItem?.spec?.function_uri,
        shouldPopUp: !isEmpty(selectedItem?.spec?.function_uri),
        handleClick: () =>
          openPopUp(FunctionPopUp, {
            funcUri: selectedItem?.spec?.function_uri
          })
      },
      function_tag: {
        value: selectedItem?.spec?.function_tag
      },
      monitoring_feature_set_uri: {
        value: monitoringFeatureSetUri,
        shouldPopUp: !isEmpty(monitoringFeatureSetUri),
        handleClick: () =>
          openPopUp(FeatureSetPopUp, {
            featureSetData: {
              project: featureSetParsedUri.project,
              name: featureSetParsedUri.key,
              tag: featureSetParsedUri.tag
            }
          })
      },
      sampling_percentage: {
        value: selectedItem?.status?.sampling_percentage
          ? `${selectedItem.status.sampling_percentage}%`
          : 0
      },
      last_prediction: {
        value: formatDatetime(selectedItem?.status?.last_request, '-')
      },
      error_count: {
        value: selectedItem?.status?.error_count ?? '-'
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
      model_artifact: {
        value: !isEmpty(selectedItem?.parent_uri) ? parseUri(selectedItem.parent_uri).key : '',
        shouldPopUp: !isEmpty(selectedItem?.parent_uri),
        handleClick: () =>
          openPopUp(ArtifactPopUp, {
            artifactData: parseUri(selectedItem?.parent_uri)
          })
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
            additionalRules: [
              {
                name: 'latest',
                label: 'Tag name "latest" is reserved',
                pattern: value => value !== TAG_LATEST
              }
            ]
          }
        },
        handleDiscardChanges: (formState, commonDetailsStore) => {
          formState.form.change(
            'tag',
            commonDetailsStore.changes.data.tag?.currentFieldValue ?? formState.initialValues.tag
          )
        }
      },
      iter: {
        value: selectedItem.iter || '0'
      },
      kind: {
        value:
          detailsType !== FILES_PAGE && detailsType !== DATASETS_PAGE
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
      original_source: {
        value: selectedItem.original_source,
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
      uid: {
        value: selectedItem.uid,
        copyToClipboard: selectedItem.uid?.length > 0
      },
      updated: {
        value: formatDatetime(selectedItem.updated, 'N/A')
      },
      framework: {
        value: detailsType === MODELS_TAB ? (selectedItem.framework ?? '') : null
      },
      algorithm: {
        value: selectedItem.algorithm
      },
      labels: {
        value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
        fieldData: {
          name: 'labels'
        },
        editModeEnabled:
          !isDetailsPopUp && (detailsType === MODELS_TAB || detailsType === DOCUMENTS_PAGE),
        editModeType: 'chips',
        validationRules: {
          key: getValidationRules(
            'artifact.labels.key',
            getInternalLabelsValidationRule(internal_labels)
          ),
          value: getValidationRules('artifact.labels.value')
        }
      }
    }
  }
}

export const generateFeatureStoreContent = (detailsType, selectedItem, isDetailsPopUp) => {
  if (detailsType === FEATURE_SETS_TAB) {
    return generateFeatureSetsOverviewContent(selectedItem, isDetailsPopUp)
  } else if (detailsType === FEATURE_VECTORS_TAB) {
    return generateFeatureVectorsOverviewContent(selectedItem, isDetailsPopUp)
  }
}

export const generateAlertsContent = selectedItem => {
  return {
    uid: {
      value: selectedItem.uid
    },
    resultName: {
      value: selectedItem.resultName
    },
    projectName: {
      value: selectedItem.project
    },
    jobName: {
      value: selectedItem?.job?.name
    },
    applicationName: {
      value: selectedItem.applicationName
    },
    type: {
      value: selectedItem?.entityType?.detailsValue
    },
    timestamp: {
      value: selectedItem?.activationTime
    },
    severity: {
      value: selectedItem?.severity?.value
    },
    job: {
      value: selectedItem?.job?.jobUid,
      shouldPopUp: !isEmpty(selectedItem?.job?.jobUid),
      handleClick: () =>
        openPopUp(JobPopUp, {
          jobData: {
            project: selectedItem?.project,
            uid: selectedItem?.job?.jobUid,
            iter: 0
          }
        })
    },
    triggerCriteriaCount: {
      value: selectedItem.criteria.count
    },
    triggerCriteriaTimePeriod: {
      value: selectedItem.criteria.period
    },
    notifications: {
      value: selectedItem.notifications
    }
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
      value: selectedItem.nodeSelectorChips
    },
    priority: {
      value: selectedItem.ui.priority
    },
    parameters: {
      value: selectedItem.parametersChips
    },
    handler: {
      value: selectedItem.handler
    },
    function: {
      value: selectedItem.function,
      shouldPopUp: !isEmpty(selectedItem.function),
      handleClick: () =>
        openPopUp(FunctionPopUp, {
          funcUri: selectedItem.function,
          funcTag: selectedItem.ui?.functionTag ?? ''
        })
    },
    functionTag: {
      value: selectedItem.ui?.functionTag ?? ''
    },
    resultsChips: {
      value: selectedItem.resultsChips
    },
    labels: {
      value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels
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
    },
    retryCountWithInitialAttempt: {
      value: selectedItem.retryCountWithInitialAttempt
    },
    maxRetriesWithInitialAttempt: {
      value: selectedItem.maxRetriesWithInitialAttempt
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
    value: selectedItem.command,
    copyToClipboard: selectedItem.type !== FUNCTION_TYPE_APPLICATION,
    externalLink: selectedItem.type === FUNCTION_TYPE_APPLICATION
  },
  internalPort: {
    value: selectedItem.internal_application_port
  },
  internalUrl: {
    value: selectedItem.internal_invocation_urls
  },
  defaultHandler: {
    value: selectedItem.default_handler
  },
  image: {
    value: getFunctionImage(selectedItem)
  },
  applicationImage: {
    value: selectedItem.application_image
  },
  description: {
    value: selectedItem.description
  }
})

export const generateFeatureSetsOverviewContent = (selectedItem, isDetailsPopUp) => ({
  description: {
    value: selectedItem.description ?? '',
    editModeEnabled: true,
    editModeType: 'textarea',
    fieldData: {
      name: 'description'
    },
    handleDiscardChanges: (formState, commonDetailsStore) => {
      formState.form.change(
        'description',
        commonDetailsStore.changes.data.description?.currentFieldValue ??
          formState.initialValues.description
      )
    }
  },
  labels: {
    value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
    editModeEnabled: !isDetailsPopUp,
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

export const generateFeatureVectorsOverviewContent = (selectedItem, isDetailsPopUp) => ({
  description: {
    value: selectedItem.description ?? '',
    editModeEnabled: true,
    editModeType: 'textarea',
    fieldData: {
      name: 'description'
    },
    handleDiscardChanges: (formState, commonDetailsStore) => {
      formState.form.change(
        'description',
        commonDetailsStore.changes.data.description?.currentFieldValue ??
          formState.initialValues.description
      )
    }
  },
  labels: {
    value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
    editModeEnabled: !isDetailsPopUp,
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
  currentField,
  formState,
  dispatch,
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

  dispatch(setChangesCounter(countChanges(changesData)))
  dispatch(setChangesData({ ...changesData }))
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

export const generateArtifactIdentifiers = (
  artifactsIdentifiers,
  identifier,
  setArtifactsIdentifiers
) => {
  const newArtifactsIdentifiers = artifactsIdentifiers.filter(
    artifactsIdentifier => artifactsIdentifier !== identifier
  )

  if (!artifactsIdentifiers.includes(identifier)) {
    newArtifactsIdentifiers.push(identifier)
  }

  setArtifactsIdentifiers(newArtifactsIdentifiers)
}

export const performDetailsActionHelper = async (changes, dispatch, filtersWasHandled = false) => {
  let actionCanBePerformed = Promise.resolve(true)

  if (changes.counter > 0) {
    actionCanBePerformed = await new Promise(resolve => {
      const resolver = isSuccess => {
        window.removeEventListener('discardChanges', resolver)
        window.removeEventListener('cancelLeave', resolver)

        resolve(isSuccess)
      }

      window.addEventListener('discardChanges', () => resolver(true))
      window.addEventListener('cancelLeave', () => resolver(false))

      dispatch(setFiltersWasHandled(filtersWasHandled))
      dispatch(showWarning(true))
    })
  }

  return actionCanBePerformed
}

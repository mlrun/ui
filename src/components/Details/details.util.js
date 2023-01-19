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
import { isEmpty, isEqual, cloneDeep } from 'lodash'

import {
  DATASETS_PAGE,
  DETAILS_ANALYSIS_TAB,
  DETAILS_ARTIFACTS_TAB,
  DETAILS_BUILD_LOG_TAB,
  DETAILS_CODE_TAB,
  DETAILS_DRIFT_ANALYSIS_TAB,
  DETAILS_INPUTS_TAB,
  DETAILS_LOGS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_FEATURES_ANALYSIS_TAB,
  DETAILS_FEATURES_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_PODS_TAB,
  DETAILS_PREVIEW_TAB,
  DETAILS_REQUESTED_FEATURES_TAB,
  DETAILS_RESULTS_TAB,
  DETAILS_RETURNED_FEATURES_TAB,
  DETAILS_STATISTICS_TAB,
  DETAILS_TRANSFORMATIONS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  FILES_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../../constants'
import { formatDatetime, generateLinkPath } from '../../utils'
import { getValidationRules } from 'igz-controls/utils/validation.util'

import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsPreview from '../DetailsPreview/DetailsPreview'
import DetailsInputs from '../DetailsInputs/DetailsInputs'
import DetailsArtifacts from '../DetailsArtifacts/DetailsArtifacts'
import DetailsResults from '../DetailsResults/DetailsResults'
import DetailsLogs from '../DetailsLogs/DetailsLogs'
import DetailsCode from '../DetailsCode/DetailsCode'
import DetailsMetadata from '../DetailsMetadata/DetailsMetadata'
import DetailsAnalysis from '../DetailsAnalysis/DetailsAnalysis'
import DetailsStatistics from '../DetailsStatistics/DetailsStatistics'
import DetailsRequestedFeatures from '../DetailsRequestedFeatures/DetailsRequestedFeatures'
import DetailsTransformations from '../DetailsTransformations/DetailsTransformations'
import DetailsDriftAnalysis from '../DetailsDriftAnalysis/DetailsDriftAnalysis'
import DetailsFeatureAnalysis from '../DetailsFeaturesAnalysis/DetailsFeaturesAnalysis'
import DetailsPods from '../DetailsPods/DetailsPods'
import NoData from '../../common/NoData/NoData'

export const generateArtifactsContent = (
  addChip,
  deleteChip,
  editChips,
  editInput,
  detailsType,
  selectedItem
) => {
  if (detailsType === MODEL_ENDPOINTS_TAB) {
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
        link: selectedItem?.spec?.function_uri
          ? `${generateLinkPath(`store://functions/${selectedItem?.spec?.function_uri}`)}/overview`
          : ''
      },
      monitoring_feature_set_uri: {
        value: selectedItem?.status?.monitoring_feature_set_uri,
        link: selectedItem?.status?.monitoring_feature_set_uri
          ? `${generateLinkPath(selectedItem?.status?.monitoring_feature_set_uri)}/latest/overview`
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
        value: selectedItem.hash ?? ''
      },
      db_key: {
        value: selectedItem.db_key
      },
      tag: {
        value: selectedItem.tag ?? '',
        editModeEnabled: true,
        editModeType: 'input',
        validationRules: getValidationRules('common.tag'),
        onChange: value => editInput(value, 'tag')
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
        value: selectedItem.tree
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
        editModeEnabled: detailsType === MODELS_TAB,
        editModeType: 'chips',
        onChange: (chip, field) => editChips(chip, field),
        onAdd: (chip, chips, field) => addChip(chip, chips, field),
        handleDelete: (chips, field) => deleteChip(chips, field)
      },
      sources: {
        value: selectedItem.sources
      }
    }
  }
}

export const generateFeatureStoreContent = (
  addChip,
  deleteChip,
  editChips,
  editInput,
  detailsType,
  selectedItem
) => {
  if (detailsType === FEATURE_SETS_TAB) {
    return generateFeatureSetsOverviewContent(
      addChip,
      deleteChip,
      editChips,
      editInput,
      selectedItem
    )
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
    parameters: {
      value: selectedItem.parametersChips
    },
    function: {
      value: selectedItem.function
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
    value: selectedItem.type || 'Local'
  },
  hash: {
    value: selectedItem.hash
  },
  codeOrigin: {
    value: selectedItem.build.code_origin ?? ''
  },
  updated: {
    value: formatDatetime(selectedItem.updated, 'N/A')
  },
  command: {
    value: selectedItem.command
  },
  image: {
    value: selectedItem.image
  },
  description: {
    value: selectedItem.description
  }
})

export const renderContent = (
  applyChangesRef,
  tab,
  detailsStore,
  selectedItem,
  pageData,
  handlePreview,
  handleEditInput,
  setChanges,
  setChangesData,
  setChangesCounter,
  setIteration,
  setIterationOption
) => {
  switch (tab) {
    case DETAILS_OVERVIEW_TAB:
      return (
        <DetailsInfo
          detailsStore={detailsStore}
          pageData={pageData}
          ref={applyChangesRef}
          selectedItem={selectedItem}
          setChangesData={setChangesData}
          setChangesCounter={setChangesCounter}
        />
      )
    case DETAILS_DRIFT_ANALYSIS_TAB:
      return <DetailsDriftAnalysis />
    case DETAILS_PODS_TAB:
      return <DetailsPods />
    case DETAILS_FEATURES_ANALYSIS_TAB:
      return <DetailsFeatureAnalysis />
    case DETAILS_PREVIEW_TAB:
      return <DetailsPreview artifact={selectedItem} handlePreview={handlePreview} />
    case DETAILS_INPUTS_TAB:
      return <DetailsInputs inputs={selectedItem.inputs} />
    case DETAILS_ARTIFACTS_TAB:
      return (
        <DetailsArtifacts
          iteration={detailsStore.iteration}
          selectedItem={selectedItem}
          setIteration={setIteration}
          setIterationOption={setIterationOption}
        />
      )
    case DETAILS_RESULTS_TAB:
      return <DetailsResults job={selectedItem} />
    case DETAILS_LOGS_TAB:
    case DETAILS_BUILD_LOG_TAB:
      return (
        <DetailsLogs
          item={selectedItem}
          refreshLogs={pageData.details.refreshLogs}
          removeLogs={pageData.details.removeLogs}
          withLogsRefreshBtn={pageData.details.withLogsRefreshBtn}
        />
      )
    case DETAILS_CODE_TAB:
      return (
        <DetailsCode
          code={
            selectedItem.build.functionSourceCode ??
            selectedItem.base_spec.spec?.build?.functionSourceCode
          }
        />
      )
    case DETAILS_METADATA_TAB:
    case DETAILS_FEATURES_TAB:
    case DETAILS_RETURNED_FEATURES_TAB:
      return detailsStore.modelFeatureVectorData.features ??
        (selectedItem.schema ||
          selectedItem.entities ||
          selectedItem.features ||
          selectedItem.inputs ||
          selectedItem.outputs) ? (
        <DetailsMetadata
          selectedItem={
            selectedItem.schema ||
            selectedItem.entities ||
            selectedItem.features ||
            selectedItem.inputs ||
            selectedItem.outputs ||
            !detailsStore.modelFeatureVectorData.features
              ? selectedItem
              : detailsStore.modelFeatureVectorData
          }
        />
      ) : null
    case DETAILS_TRANSFORMATIONS_TAB:
      return <DetailsTransformations selectedItem={selectedItem} />
    case DETAILS_ANALYSIS_TAB:
      if ((selectedItem.kind === 'dataset' && selectedItem.extra_data) || selectedItem.analysis) {
        return <DetailsAnalysis artifact={selectedItem} />
      } else return <NoData />
    case DETAILS_STATISTICS_TAB:
      if (
        detailsStore.modelFeatureVectorData.stats ||
        selectedItem.stats ||
        selectedItem.feature_stats
      ) {
        return (
          <DetailsStatistics
            selectedItem={
              selectedItem?.stats ||
              selectedItem.feature_stats ||
              !detailsStore.modelFeatureVectorData.stats
                ? selectedItem
                : detailsStore.modelFeatureVectorData.stats
            }
          />
        )
      } else return <NoData />
    case DETAILS_REQUESTED_FEATURES_TAB:
      return (
        <DetailsRequestedFeatures
          changes={detailsStore.changes}
          selectedItem={selectedItem}
          handleEditInput={(value, field) => handleEditInput(value, field)}
          setChanges={setChanges}
          setChangesData={setChangesData}
          setChangesCounter={setChangesCounter}
        />
      )
    default:
      return null
  }
}

export const generateFeatureSetsOverviewContent = (
  addChip,
  deleteChip,
  editChips,
  editInput,
  selectedItem
) => ({
  description: {
    value: selectedItem.description ?? '',
    editModeEnabled: true,
    editModeType: 'textarea',
    onChange: value => editInput(value, 'description')
  },
  labels: {
    value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels,
    editModeEnabled: true,
    editModeType: 'chips',
    onChange: (chip, field) => editChips(chip, field),
    onAdd: (chip, chips, field) => addChip(chip, chips, field),
    handleDelete: (chips, field) => deleteChip(chips, field)
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
    value: selectedItem.description ?? ''
  },
  labels: {
    value: isEmpty(selectedItem.labels) ? [] : selectedItem.labels
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
  fields,
  changes,
  detailsTabActions,
  detailsTabDispatch,
  detailsTabState,
  setChangesData,
  setChangesCounter
) => {
  detailsTabDispatch({
    type: detailsTabActions.RESET_EDIT_MODE
  })

  const changesData = cloneDeep(changes.data)

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

  setChangesCounter(countChanges(changesData))
  setChangesData({ ...changesData })
}

export const countChanges = changesData => {
  let changesCounter = 0

  Object.keys(changesData).forEach(field => {
    if (field === 'features') {
      changesData[field].initialFieldValue.forEach(item => {
        if (!changesData[field].currentFieldValue.includes(item)) {
          changesCounter++
        }
      })
    } else {
      changesCounter++
    }
  })

  return changesCounter
}

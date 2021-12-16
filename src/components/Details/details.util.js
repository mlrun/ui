import React from 'react'
import { isEmpty, isEqual, cloneDeep } from 'lodash'

import {
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
  MODELS_PAGE
} from '../../constants'
import { formatDatetime, generateLinkPath } from '../../utils'

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

export const generateArtifactsContent = (detailsType, selectedItem) => {
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
        value: selectedItem?.spec?.model_uri?.replace(
          /^store:\/\/artifacts\//,
          ''
        ),
        link: `${generateLinkPath(selectedItem?.spec?.model_uri)}/overview`
      },
      function_uri: {
        value: selectedItem?.spec?.function_uri,
        link: selectedItem?.spec?.function_uri
          ? `${generateLinkPath(
              `store://functions/${selectedItem?.spec?.function_uri}`
            )}/overview`
          : ''
      },
      last_prediction: {
        value: formatDatetime(new Date(selectedItem?.status?.last_request), '-')
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
      iter: {
        value: selectedItem.iter || '0'
      },
      kind: {
        value:
          detailsType !== FEATURE_STORE_PAGE && detailsType !== FILES_PAGE
            ? selectedItem.kind || ' '
            : null
      },
      size: {
        value: selectedItem.size ?? ''
      },
      target_path: {
        value: selectedItem.target_path
      },
      target_uri: {
        value: selectedItem.URI
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
        value: formatDatetime(new Date(selectedItem.updated), 'N/A')
      },
      framework: {
        value: detailsType === MODELS_PAGE ? selectedItem.framework ?? '' : null
      },
      algorithm: {
        value: selectedItem.algorithm
      },
      labels: {
        value: selectedItem.labels ?? []
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
  editDescription,
  detailsType,
  selectedItem
) => {
  if (detailsType === FEATURE_SETS_TAB) {
    return generateFeatureSetsOverviewContent(
      addChip,
      deleteChip,
      editChips,
      editDescription,
      selectedItem
    )
  } else if (detailsType === FEATURE_VECTORS_TAB) {
    return generateFeatureVectorsOverviewContent(selectedItem)
  }
}

export const generateJobsContent = selectedItem => ({
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
    value: selectedItem.parameters
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
    value: selectedItem.iterations?.length ? selectedItem.iterations : '0'
  }
})

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
    value: formatDatetime(new Date(selectedItem.updated), 'N/A')
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
  match,
  detailsState,
  selectedItem,
  pageData,
  handlePreview,
  detailsStore,
  handleEditInput,
  setChanges,
  setChangesData,
  setChangesCounter,
  setIterationOption
) => {
  switch (match.params.tab) {
    case DETAILS_OVERVIEW_TAB:
      return (
        <DetailsInfo
          changes={detailsState.changes}
          content={detailsState.infoContent}
          match={match}
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
      return <DetailsPods match={match} />
    case DETAILS_FEATURES_ANALYSIS_TAB:
      return <DetailsFeatureAnalysis />
    case DETAILS_PREVIEW_TAB:
      return (
        <DetailsPreview artifact={selectedItem} handlePreview={handlePreview} />
      )
    case DETAILS_INPUTS_TAB:
      return <DetailsInputs inputs={selectedItem.inputs} />
    case DETAILS_ARTIFACTS_TAB:
      return (
        <DetailsArtifacts
          iteration={detailsState.iteration}
          match={match}
          selectedItem={selectedItem}
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
          match={match}
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
          selectedItem.features) ? (
        <DetailsMetadata
          selectedItem={
            detailsStore.modelFeatureVectorData.features
              ? detailsStore.modelFeatureVectorData
              : selectedItem
          }
        />
      ) : null
    case DETAILS_TRANSFORMATIONS_TAB:
      return <DetailsTransformations selectedItem={selectedItem} />
    case DETAILS_ANALYSIS_TAB:
      if (
        (selectedItem.kind === 'dataset' && selectedItem.extra_data) ||
        selectedItem.analysis
      ) {
        return <DetailsAnalysis artifact={selectedItem} />
      } else return null
    case DETAILS_STATISTICS_TAB:
      if (detailsStore.modelFeatureVectorData.stats || selectedItem.stats) {
        return (
          <DetailsStatistics
            selectedItem={
              detailsStore.modelFeatureVectorData.stats
                ? detailsStore.modelFeatureVectorData
                : selectedItem
            }
          />
        )
      } else return null
    case DETAILS_REQUESTED_FEATURES_TAB:
      return (
        <DetailsRequestedFeatures
          changes={detailsState.changes}
          match={match}
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
  editDescription,
  selectedItem
) => ({
  description: {
    value: selectedItem.description ?? '',
    editModeEnabled: true,
    editModeType: 'input',
    onChange: value => editDescription(value, 'description')
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
    value: formatDatetime(new Date(selectedItem.updated), 'N/A')
  },
  usage_example: {
    value: selectedItem.usage_example ?? ''
  },
  entities: {
    value: selectedItem.entities?.map(entity => entity.name).join(', ')
  },
  target_uri: {
    value: selectedItem.URI
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
    value: selectedItem.URI
  },
  updated: {
    value: formatDatetime(new Date(selectedItem.updated), 'N/A')
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
    type: detailsTabActions.SET_EDIT_MODE,
    payload: {
      field: '',
      fieldType: ''
    }
  })

  const changesData = cloneDeep(changes.data)

  fields.forEach(field => {
    if (changes.data[field]) {
      if (
        isEqual(
          changesData[field]?.initialFieldValue,
          changesData[field]?.currentFieldValue
        )
      ) {
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

  setChangesCounter(Object.keys(changesData).length)
  setChangesData({ ...changesData })
}

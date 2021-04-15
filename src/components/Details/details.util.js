import React from 'react'
import { isEmpty } from 'lodash'

import {
  DETAILS_ANALYSIS_TAB,
  DETAILS_ARTIFACTS_TAB,
  DETAILS_CODE_TAB,
  DETAILS_OVERVIEW_TAB,
  DETAILS_INPUTS_TAB,
  DETAILS_LOGS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_FEATURES_TAB,
  DETAILS_PREVIEW_TAB,
  DETAILS_RESULTS_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  FEATURE_VECTORS_TAB,
  DETAILS_REQUESTED_FEATURES_TAB,
  DETAILS_RETURNED_FEATURES_TAB,
  DETAILS_TRANSFORMATIONS_TAB,
  MODEL_ENDPOINTS_TAB,
  DETAILS_DRIFT_ANALYSIS_TAB
} from '../../constants'
import { formatDatetime, parseUri } from '../../utils'

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

export const generateArtifactsContent = (
  editDescription,
  page,
  pageTab,
  selectedItem,
  editChips,
  addChip,
  deleteChip
) => {
  if (pageTab === FEATURE_SETS_TAB) {
    return generateFeatureSetsOverviewContent(
      addChip,
      deleteChip,
      editChips,
      editDescription,
      selectedItem
    )
  } else if (pageTab === FEATURE_VECTORS_TAB) {
    return generateFeatureVectorsOverviewContent(selectedItem)
  } else if (pageTab === MODEL_ENDPOINTS_TAB) {
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
        link: (() => {
          const { key: modelArtifact, project } = parseUri(
            selectedItem?.spec?.model_uri
          )
          return `/projects/${project}/files/${modelArtifact}/overview`
        })()
      },
      function_uri: {
        value: selectedItem?.spec?.function_uri,
        link: (() => {
          const { key: functionName, project } = parseUri(
            `store://functions/${selectedItem?.spec?.function_uri}`
          )
          return `/projects/${project}/functions/${functionName}/overview`
        })()
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
          page !== FEATURE_STORE_PAGE && page !== FILES_PAGE
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
      tree: {
        value: selectedItem.tree
      },
      updated: {
        value: formatDatetime(new Date(selectedItem.updated), 'N/A')
      },
      framework: {
        value: page === MODELS_PAGE ? selectedItem.framework ?? '' : null
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

export const generateJobsContent = selectedItem => ({
  uid: {
    value: selectedItem.uid
  },
  startTime: {
    value: formatDatetime(
      selectedItem.startTime,
      selectedItem.state === 'aborted' ? 'N/A' : 'Not yet started'
    )
  },
  updated: {
    value: formatDatetime(selectedItem.updated, 'N/A')
  },
  state: {
    value: selectedItem.state
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
    value: selectedItem.type
  },
  hash: {
    value: selectedItem.hash
  },
  codeOrigin: {
    value: selectedItem.codeOrigin
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
  },
  state: {
    value: selectedItem.state
  }
})

export const renderContent = (
  match,
  detailsState,
  detailsDispatch,
  selectedItem,
  pageData,
  handlePreview,
  detailsStore
) => {
  switch (match.params.tab?.toUpperCase()) {
    case DETAILS_OVERVIEW_TAB:
      return (
        <DetailsInfo
          changes={detailsState.changes}
          content={detailsState.infoContent}
          detailsDispatch={detailsDispatch}
          match={match}
          pageData={pageData}
          selectedItem={selectedItem}
        />
      )
    case DETAILS_DRIFT_ANALYSIS_TAB:
      return <DetailsDriftAnalysis detailsStore={detailsStore} />
    case DETAILS_PREVIEW_TAB:
      return (
        <DetailsPreview artifact={selectedItem} handlePreview={handlePreview} />
      )
    case DETAILS_INPUTS_TAB:
      return <DetailsInputs inputs={selectedItem.inputs} />
    case DETAILS_ARTIFACTS_TAB:
      return (
        <DetailsArtifacts
          detailsDispatch={detailsDispatch}
          iteration={detailsState.iteration}
          match={match}
          selectedItem={selectedItem}
        />
      )
    case DETAILS_RESULTS_TAB:
      return <DetailsResults job={selectedItem} />
    case DETAILS_LOGS_TAB:
      return <DetailsLogs match={match} item={selectedItem} />
    case DETAILS_CODE_TAB:
      return <DetailsCode code={selectedItem.functionSourceCode} />
    case DETAILS_METADATA_TAB:
    case DETAILS_FEATURES_TAB:
    case DETAILS_RETURNED_FEATURES_TAB:
      return selectedItem.schema ||
        selectedItem.entities ||
        selectedItem.features ? (
        <DetailsMetadata selectedItem={selectedItem} />
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
      if (selectedItem.stats) {
        return <DetailsStatistics selectedItem={selectedItem} />
      } else return null
    case DETAILS_REQUESTED_FEATURES_TAB:
      return (
        <DetailsRequestedFeatures
          selectedItem={selectedItem}
          projectName={match.params.projectName}
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
    value: selectedItem.entities?.map(entity => entity.name)
  },
  target_uri: {
    value: selectedItem.URI
  },
  partition_keys: {
    value: (selectedItem.partition_keys || []).map(key => key)
  },
  timestamp_key: {
    value: selectedItem.timestamp_key ?? ''
  },
  relations: {
    value: isEmpty(selectedItem.relations) ? [] : selectedItem.relations
  },
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
  timestamp_key: {
    value: selectedItem.timestamp_field ?? ''
  },
  label_column: {
    value: selectedItem.label_column ?? ''
  }
})

import React from 'react'
import { isEmpty } from 'lodash'

import {
  DETAILS_ANALYSIS_TAB,
  DETAILS_ARTIFACTS_TAB,
  DETAILS_CODE_TAB,
  DETAILS_INFO_TAB,
  DETAILS_INPUTS_TAB,
  DETAILS_LOGS_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_PREVIEW_TAB,
  DETAILS_RESULTS_TAB,
  DETAILS_STATISTICS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODELS_PAGE
} from '../../constants'
import { formatDatetime } from '../../utils'

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
    return {
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
        value: formatDatetime(selectedItem.updated, 'N/A')
      },
      entities: {
        value: selectedItem.entities?.map(entity => entity.name)
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
    }
  }

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

export const generateJobsContent = selectedItem => ({
  uid: {
    value: selectedItem.uid
  },
  startTime: {
    value: formatDatetime(selectedItem.startTime, 'Not yet started')
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
  handlePreview
) => {
  switch (match.params.tab?.toUpperCase()) {
    case DETAILS_INFO_TAB:
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
      if (selectedItem.schema || selectedItem.entities) {
        return <DetailsMetadata selectedItem={selectedItem} />
      } else {
        return null
      }
    case DETAILS_ANALYSIS_TAB:
      if (selectedItem.kind === 'dataset' && selectedItem.extra_data) {
        return (
          <DetailsAnalysis
            artifact={selectedItem}
            handlePreview={handlePreview}
          />
        )
      } else return null

    case DETAILS_STATISTICS_TAB:
      if (selectedItem.entities && selectedItem.stats) {
        return <DetailsStatistics selectedItem={selectedItem} />
      } else return null
    default:
      return null
  }
}

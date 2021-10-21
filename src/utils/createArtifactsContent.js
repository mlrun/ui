import React from 'react'

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { convertBytes } from './convertBytes'
import { copyToClipboard } from './copyToClipboard'
import { generateUri } from './resources'
import { generateLinkPath, parseUri, truncateUid } from '../utils'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getArtifactIdentifier } from './getUniqueIdentifier'

import { ReactComponent as SeverityOk } from '../images/severity-ok.svg'
import { ReactComponent as SeverityWarning } from '../images/severity-warning.svg'
import { ReactComponent as SeverityError } from '../images/severity-error.svg'

export const createArtifactsContent = (
  artifacts,
  page,
  pageTab,
  project,
  isSelectedItem
) => {
  return (artifacts.filter(artifact => !artifact.link_iteration) ?? []).map(
    artifact => {
      if (page === ARTIFACTS_PAGE) {
        return createArtifactsRowData(artifact)
      } else if (page === MODELS_PAGE) {
        if (pageTab === MODELS_TAB) {
          return createModelsRowData(artifact, project, isSelectedItem)
        } else if (pageTab === MODEL_ENDPOINTS_TAB) {
          return createModelEndpointsRowData(artifact, project, isSelectedItem)
        }
      } else if (page === FILES_PAGE) {
        return createFilesRowData(artifact, project, isSelectedItem)
      }

      return createDatasetsRowData(artifact, project, isSelectedItem)
    }
  )
}

const createArtifactsRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'artifacts_medium',
      link: 'overview'
    },
    kind: {
      value: artifact.kind,
      class: 'artifacts_extra-small'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    producer: {
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer'
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner'
    },
    updated: {
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small'
    },
    buttonPopout: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout'
    },
    buttonDownload: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload'
    }
  }
}

const createModelsRowData = (artifact, project, isSelectedItem) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`

  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: getArtifactIdentifier(artifact, true),
      value: artifact.db_key,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          MODELS_TAB,
          MODELS_TAB,
          artifact.db_key,
          artifact.tag,
          tab,
          artifact.tree,
          artifact.iter
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${truncateUid(artifact.tree)}${iter}`,
        tooltip: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${artifact.tree}${iter}`
      },
      rowExpanded: {
        getLink: false
      }
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_extra-small',
      type: 'labels',
      hidden: isSelectedItem
    },
    producer: {
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer',
      hidden: isSelectedItem
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner',
      hidden: isSelectedItem
    },
    updated: {
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    metrics: {
      value: parseKeyValues(artifact.metrics),
      class: 'artifacts_big',
      type: 'metrics',
      hidden: isSelectedItem
    },
    frameWorkAndAlgorithm: {
      value:
        artifact.framework || artifact.algorithm ? (
          <span>
            <span>{artifact.framework}</span>
            <br />
            <span>{artifact.algorithm}</span>
          </span>
        ) : (
          ''
        ),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    buttonPopout: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout',
      hidden: isSelectedItem
    },
    buttonDownload: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload',
      hidden: isSelectedItem
    },
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
      hidden: isSelectedItem
    }
  }
}

const createFilesRowData = (artifact, project, isSelectedItem) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`

  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: getArtifactIdentifier(artifact, true),
      value: artifact.db_key,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          FILES_PAGE,
          null,
          artifact.db_key,
          artifact.tag,
          tab,
          artifact.tree,
          artifact.iter
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${truncateUid(artifact.tree)}${iter}`,
        tooltip: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${artifact.tree}${iter}`
      },
      rowExpanded: {
        getLink: false
      }
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    kind: {
      value: artifact.kind,
      class: 'artifacts_extra-small',
      hidden: isSelectedItem
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    producer: {
      value: artifact.producer || {},
      class: 'artifacts_small',
      type: 'producer',
      hidden: isSelectedItem
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner',
      hidden: isSelectedItem
    },
    updated: {
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    size: {
      value: convertBytes(artifact.size || 0),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    buttonPopout: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout',
      hidden: isSelectedItem
    },
    buttonDownload: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload',
      hidden: isSelectedItem
    },
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) =>
        copyToClipboard(generateUri(item, tab ?? 'artifacts')),
      hidden: isSelectedItem
    }
  }
}

const driftStatusIcons = {
  NO_DRIFT: {
    value: <SeverityOk />,
    tooltip: 'No drift'
  },
  POSSIBLE_DRIFT: {
    value: <SeverityWarning />,
    tooltip: 'Possible drift'
  },
  DRIFT_DETECTED: {
    value: <SeverityError />,
    tooltip: 'Drift detected'
  }
}

const createModelEndpointsRowData = (artifact, project, isSelectedItem) => {
  const { name, tag = '-' } =
    (artifact.spec?.model ?? '').match(/^(?<name>.*?)(:(?<tag>.*))?$/)
      ?.groups ?? {}
  const functionUri = artifact.spec?.function_uri
    ? `store://functions/${artifact.spec.function_uri}`
    : ''
  const { key: functionName } = parseUri(functionUri)
  const averageLatency =
    artifact.status?.metrics?.latency_avg_1h?.values?.[0]?.[1]

  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: getArtifactIdentifier(artifact, true),
      value: name,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          MODELS_TAB,
          MODEL_ENDPOINTS_TAB,
          name,
          artifact.metadata?.uid,
          tab
        ),
      tooltip: artifact.spec?.model_uri
        ? `${name} - ${artifact.spec?.model_uri}`
        : name
    },
    functionName: {
      value: functionName,
      class: 'artifacts_small',
      link: `${generateLinkPath(functionUri)}/overview`,
      tooltip: functionUri,
      hidden: isSelectedItem
    },
    state: {
      value: artifact.status?.state,
      class: 'artifacts_extra-small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    version: {
      value: artifact?.status?.children ? 'Router' : tag,
      class: 'artifacts_extra-small',
      hidden: isSelectedItem
    },
    modelClass: {
      value: artifact.spec?.model_class,
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    labels: {
      value: parseKeyValues(artifact.metadata?.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    firstRequest: {
      value: formatDatetime(new Date(artifact.status?.first_request), '-'),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    lastRequest: {
      value: formatDatetime(new Date(artifact.status?.last_request), '-'),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    averageLatency: {
      value: averageLatency ? `${(averageLatency / 1000).toFixed(2)}ms` : '-',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    errorCount: {
      value: artifact.status?.error_count ?? '-',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    driftStatus: {
      value: driftStatusIcons[artifact.status?.drift_status]?.value,
      class: 'artifacts_extra-small',
      tooltip: driftStatusIcons[artifact.status?.drift_status]?.tooltip,
      hidden: isSelectedItem
    }
  }
}

const createDatasetsRowData = (artifact, project, isSelectedItem) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`

  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: getArtifactIdentifier(artifact, true),
      value: artifact.db_key,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          FEATURE_STORE_PAGE,
          DATASETS_TAB,
          artifact.db_key,
          artifact.tag,
          tab,
          artifact.tree,
          artifact.iter
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${truncateUid(artifact.tree)}${iter}`,
        tooltip: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${artifact.tree}${iter}`
      },
      rowExpanded: {
        getLink: false
      }
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    producer: {
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer',
      hidden: isSelectedItem
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner',
      hidden: isSelectedItem
    },
    updated: {
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    size: {
      value: convertBytes(artifact.size || 0),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    buttonPopout: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout',
      hidden: isSelectedItem
    },
    buttonDownload: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload',
      hidden: isSelectedItem
    },
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
      hidden: isSelectedItem
    }
  }
}

export default createArtifactsContent

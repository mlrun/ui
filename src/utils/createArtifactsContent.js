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

export const createArtifactsContent = (artifacts, page, pageTab, project) => {
  return (artifacts.filter(artifact => !artifact.link_iteration) ?? []).map(
    artifact => {
      if (page === ARTIFACTS_PAGE) {
        return createArtifactsRowData(artifact)
      } else if (page === MODELS_PAGE) {
        if (pageTab === MODELS_TAB) {
          return createModelsRowData(artifact, project)
        } else if (pageTab === MODEL_ENDPOINTS_TAB) {
          return createModelEndpointsRowData(artifact, project)
        }
      } else if (page === FILES_PAGE) {
        return createFilesRowData(artifact, project)
      }

      return createDatasetsRowData(artifact, project)
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

const createModelsRowData = (artifact, project) => {
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
    metrics: {
      value: parseKeyValues(artifact.metrics),
      class: 'artifacts_big',
      type: 'metrics'
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
      class: 'artifacts_small'
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden'
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
    },
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab))
    }
  }
}

const createFilesRowData = (artifact, project) => {
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
      type: 'hidden'
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
    size: {
      value: convertBytes(artifact.size || 0),
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
    },
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) =>
        copyToClipboard(generateUri(item, tab ?? 'artifacts'))
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

const createModelEndpointsRowData = (artifact, project) => {
  const { name, tag = '-' } =
    (artifact.spec?.model ?? '').match(/^(?<name>.*?)(:(?<tag>.*))?$/)
      ?.groups ?? {}
  const { key: modelArtifact } = parseUri(artifact.spec?.model_uri)

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
        )
    },
    state: {
      value: artifact.status?.state,
      class: 'artifacts_extra-small',
      type: 'hidden'
    },
    version: {
      value: tag,
      class: 'artifacts_extra-small'
    },
    modelClass: {
      value: artifact.spec?.model_class,
      class: 'artifacts_small'
    },
    modelArtifact: {
      value: modelArtifact,
      class: 'artifacts_small',
      link: `${generateLinkPath(artifact.spec?.model_uri)}/overview`,
      tooltip: artifact.spec?.model_uri
    },
    labels: {
      value: parseKeyValues(artifact.metadata?.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    firstRequest: {
      value: formatDatetime(new Date(artifact.status?.first_request), '-'),
      class: 'artifacts_small'
    },
    lastRequest: {
      value: formatDatetime(new Date(artifact.status?.last_request), '-'),
      class: 'artifacts_small'
    },
    errorCount: {
      value: artifact.status?.error_count ?? '-',
      class: 'artifacts_small'
    },
    driftStatus: {
      value: driftStatusIcons[artifact.status?.drift_status]?.value,
      class: 'artifacts_extra-small',
      tooltip: driftStatusIcons[artifact.status?.drift_status]?.tooltip
    },
    accuracy: {
      value: artifact.status?.accuracy
        ? `${Math.round(artifact.status.accuracy * 100)}%`
        : '-',
      class: 'artifacts_extra-small'
    }
  }
}

const createDatasetsRowData = (artifact, project) => {
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
    size: {
      value: convertBytes(artifact.size || 0),
      class: 'artifacts_small'
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden'
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
    },
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab))
    }
  }
}

export default createArtifactsContent

import React from 'react'

import AddFeatureButton from '../elements/AddFeatureButton/AddFeatureButton'
import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
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
import getArtifactIdentifier from './getArtifactIdentifier'

import { ReactComponent as SeverityOk } from '../images/severity-ok.svg'
import { ReactComponent as SeverityWarning } from '../images/severity-warning.svg'
import { ReactComponent as SeverityError } from '../images/severity-error.svg'
import { ReactComponent as Nosql } from '../images/nosql.svg'
import { ReactComponent as Stream } from '../images/stream.svg'
import { ReactComponent as TsdbIcon } from '../images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from '../images/db-icon.svg'

const createArtifactsContent = (
  artifacts,
  page,
  pageTab,
  project,
  isTablePanelOpen
) => {
  let filteredArtifacts = artifacts

  if (
    filteredArtifacts.length > 1 &&
    ([MODELS_TAB, DATASETS_TAB].includes(pageTab) || page === FILES_PAGE)
  ) {
    filteredArtifacts = artifacts.filter(artifact => !artifact.link_iteration)
  }

  return filteredArtifacts.map(artifact => {
    let rowData = []

    if (page === ARTIFACTS_PAGE) {
      rowData = createArtifactsRowData(artifact)
    } else if (page === MODELS_PAGE) {
      if (pageTab === MODELS_TAB) {
        rowData = createModelsRowData(artifact, project)
      } else if (pageTab === MODEL_ENDPOINTS_TAB) {
        rowData = createModelEndpointsRowData(artifact, project)
      }
    } else if (page === FILES_PAGE) {
      rowData = createFilesRowData(artifact, project)
    } else if (page === FEATURE_STORE_PAGE) {
      if (pageTab === DATASETS_TAB) {
        rowData = createDatasetsRowData(artifact, project)
      } else if (pageTab === FEATURE_SETS_TAB) {
        rowData = createFeatureSetsRowData(artifact, project)
      } else if (pageTab === FEATURES_TAB) {
        rowData = createFeaturesRowData(artifact, isTablePanelOpen)
      } else if (pageTab === FEATURE_VECTORS_TAB) {
        rowData = createFeatureVectorsRowData(artifact, project)
      }
    }

    return rowData
  })
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
  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
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
          ? `${artifact.tag} #${artifact.iter}`
          : `${truncateUid(artifact.tree)}${
              artifact.iter ? ` #${artifact.iter}` : ''
            }`,
        tooltip:
          artifact.tag ||
          `${artifact.tree}${artifact.iter ? ` #${artifact.iter}` : ''}`
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
      value: (
        <span>
          <span>{artifact.framework}</span>
          <br />
          <span>{artifact.algorithm}</span>
        </span>
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
  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
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
          ? `${artifact.tag} #${artifact.iter}`
          : `${truncateUid(artifact.tree)}${
              artifact.iter ? ` #${artifact.iter}` : ''
            }`,
        tooltip:
          artifact.tag ||
          `${artifact.tree}${artifact.iter ? ` #${artifact.iter}` : ''}`
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
  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
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
          ? `${artifact.tag} #${artifact.iter}`
          : `${truncateUid(artifact.tree)}${
              artifact.iter ? ` #${artifact.iter}` : ''
            }`,
        tooltip:
          artifact.tag ||
          `${artifact.tree}${artifact.iter ? ` #${artifact.iter}` : ''}`
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

const createFeatureSetsRowData = (artifact, project) => {
  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
      value: artifact.name,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          FEATURE_STORE_PAGE,
          FEATURE_SETS_TAB,
          artifact.name,
          artifact.tag,
          tab,
          artifact.uid
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag || truncateUid(artifact.uid),
        tooltip: artifact.tag || artifact.uid
      }
    },
    description: {
      value: artifact.description,
      class: 'artifacts_medium'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden'
    },
    entity: {
      value: artifact.entities ? artifact.entities[0]?.name : '',
      class: 'artifacts_small'
    },
    targets: getFeatureSetTargetCellValue(artifact.targets),
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab))
    }
  }
}

const createFeaturesRowData = (artifact, isTablePanelOpen) => {
  return {
    key: {
      identifier: getArtifactIdentifier(artifact),
      value: artifact.name,
      class: 'artifacts_medium',
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.metadata?.tag
      }
    },
    feature_set: {
      value: artifact.metadata?.name,
      class: 'artifacts_small',
      getLink: tab =>
        generateLinkToDetailsPanel(
          artifact.metadata?.project,
          FEATURE_STORE_PAGE,
          FEATURE_SETS_TAB,
          artifact.metadata?.name,
          artifact.metadata?.tag,
          tab
        ),
      expandedCellContent: {
        class: 'artifacts_small',
        value: ''
      }
    },
    type: {
      value: artifact.value_type,
      class: 'artifacts_extra-small'
    },
    entity: {
      value: artifact.spec?.entities?.[0]?.name,
      class: 'artifacts_small'
    },
    description: {
      value: artifact.description,
      class: 'artifacts_medium'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    targets: {
      ...getFeatureSetTargetCellValue(artifact.targets),
      hidden: isTablePanelOpen
    },
    validator: {
      value: <FeatureValidator validator={artifact.validator} />,
      class: 'artifacts_medium',
      type: 'component',
      hidden: isTablePanelOpen
    },
    addFeature: {
      value: <AddFeatureButton feature={artifact} />,
      class: 'artifacts_extra-small align-right',
      type: 'component',
      hidden: !isTablePanelOpen
    }
  }
}

const kindToIcon = {
  nosql: {
    icon: <Nosql />,
    tooltip: 'NoSql'
  },
  stream: {
    icon: <Stream />,
    tooltip: 'Stream'
  },
  tsdb: {
    icon: <TsdbIcon />,
    tooltip: 'TSDB'
  }
}

const getFeatureSetTargetCellValue = targets => ({
  value: (targets ?? [])
    .map(
      target =>
        kindToIcon[target.kind] ?? {
          icon: <DbIcon />,
          tooltip: target.kind
        }
    )
    .sort((icon, otherIcon) => (icon.tooltip < otherIcon.tooltip ? -1 : 1)),
  class: 'artifacts_small artifacts__targets-icon',
  type: 'icons'
})

const createFeatureVectorsRowData = (artifact, project) => ({
  key: {
    identifier: getArtifactIdentifier(artifact),
    value: artifact.name,
    class: 'artifacts_medium',
    getLink: tab =>
      generateLinkToDetailsPanel(
        project,
        FEATURE_STORE_PAGE,
        FEATURE_VECTORS_TAB,
        artifact.name,
        artifact.tag,
        tab,
        artifact.uid
      ),
    expandedCellContent: {
      class: 'artifacts_medium',
      value: artifact.tag || truncateUid(artifact.uid),
      tooltip: artifact.tag || artifact.uid
    }
  },
  description: {
    value: artifact.description,
    class: 'artifacts_medium'
  },
  labels: {
    value: parseKeyValues(artifact.labels),
    class: 'artifacts_big',
    type: 'labels'
  },
  version: {
    value: artifact.tag,
    class: 'artifacts_small',
    type: 'hidden'
  },
  updated: {
    value: artifact.updated
      ? formatDatetime(new Date(artifact.updated), 'N/A')
      : 'N/A',
    class: 'artifacts_small'
  },
  buttonCopy: {
    value: '',
    class: 'artifacts_extra-small artifacts__icon',
    type: 'buttonCopyURI',
    actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab))
  },
  uid: {
    value: artifact.uid,
    class: 'artifacts_small',
    type: 'hidden'
  }
})

export default createArtifactsContent

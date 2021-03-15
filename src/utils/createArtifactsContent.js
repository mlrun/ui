import React from 'react'

import { ReactComponent as SeverityOk } from '../images/severity-ok.svg'
import { ReactComponent as SeverityWarning } from '../images/severity-warning.svg'
import { ReactComponent as SeverityError } from '../images/severity-error.svg'

import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
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
import { convertBytes } from './convertBytes'

import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'

import { ReactComponent as Nosql } from '../images/nosql.svg'
import { ReactComponent as Stream } from '../images/stream.svg'
import { ReactComponent as TsdbIcon } from '../images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from '../images/db-icon.svg'

const createArtifactsContent = (artifacts, page, pageTab, project) => {
  return artifacts.map(artifact => {
    let rowData = []

    if (page === ARTIFACTS_PAGE) {
      rowData = createArtifactsRowData(artifact)
    } else if (page === MODELS_PAGE) {
      if (pageTab === MODELS_TAB) {
        rowData = createModelsRowData(artifact)
      } else if (pageTab === MODEL_ENDPOINTS_TAB) {
        rowData = createModelEndpointsRowData(artifact)
      }
    } else if (page === FILES_PAGE) {
      rowData = createFilesRowData(artifact)
    } else if (page === FEATURE_STORE_PAGE) {
      if (pageTab === DATASETS_TAB) {
        rowData = createDatasetsRowData(artifact)
      } else if (pageTab === FEATURE_SETS_TAB) {
        rowData = createFeatureSetsRowData(artifact, project)
      } else if (pageTab === FEATURES_TAB) {
        rowData = createFeaturesRowData(artifact)
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

const createModelsRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'artifacts_medium',
      link: 'overview'
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

const createFilesRowData = artifact => {
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
    }
  }
}

const driftStatusIcons = {
  '-1': {
    value: <SeverityOk />,
    tooltip: 'No drift'
  },
  '0': {
    value: <SeverityWarning />,
    tooltip: 'Possible drift'
  },
  '1': {
    value: <SeverityError />,
    tooltip: 'Drift detected'
  }
}

const createModelEndpointsRowData = artifact => {
  return {
    key: {
      value: artifact.endpoint?.id,
      class: 'artifacts_medium',
      link: 'overview'
    },
    state: {
      value: artifact.endpoint?.status?.state,
      class: 'artifacts_extra-small',
      type: 'hidden'
    },
    tag: {
      value: artifact.endpoint?.metadata?.tag,
      class: 'artifacts_extra-small'
    },
    modelClass: {
      value: artifact.endpoint?.spec?.model_class,
      class: 'artifacts_small'
    },
    labels: {
      value: parseKeyValues(artifact.endpoint?.metadata?.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    firstRequest: {
      value: artifact.first_request
        ? formatDatetime(new Date(artifact.first_request), 'N/A')
        : 'N/A',
      class: 'artifacts_small'
    },
    lastRequest: {
      value: artifact.last_request
        ? formatDatetime(new Date(artifact.last_request), 'N/A')
        : 'N/A',
      class: 'artifacts_small'
    },
    errorCount: {
      value: artifact.error_count,
      class: 'artifacts_small'
    },
    driftStatus: {
      value: driftStatusIcons[artifact.drift_status]?.value,
      class: 'artifacts_extra-small',
      tooltip: driftStatusIcons[artifact.drift_status]?.tooltip
    },
    accuracy: {
      value: artifact.accuracy ? `${Math.round(artifact.accuracy * 100)}%` : '',
      class: 'artifacts_extra-small'
    }
  }
}

const createDatasetsRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'artifacts_medium',
      link: 'overview'
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
    }
  }
}

const createFeatureSetsRowData = (artifact, project) => {
  return {
    key: {
      value: artifact.name,
      class: 'artifacts_medium',
      link: `/projects/${project}/feature-store/feature-sets/${artifact.name}/${artifact.tag}/overview`,
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
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
    targets: getFeatureSetTargetCellValue(artifact.targets)
  }
}

const createFeaturesRowData = artifact => {
  return {
    key: {
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
      link: `/projects/${artifact.metadata?.project}/feature-store/feature-sets/${artifact.metadata?.name}/${artifact.metadata?.tag}/overview`,
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
      value: artifact.spec?.entities[0]?.name,
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
    targets: getFeatureSetTargetCellValue(artifact.targets),
    validator: {
      value: <FeatureValidator validator={artifact.validator} />,
      class: 'artifacts_medium',
      type: 'component'
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
    value: artifact.name,
    class: 'artifacts_medium',
    link: `/projects/${project}/feature-store/feature-vectors/${artifact.name}/${artifact.tag}/overview`,
    expandedCellContent: {
      class: 'artifacts_medium',
      value: artifact.tag
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
  }
})

export default createArtifactsContent

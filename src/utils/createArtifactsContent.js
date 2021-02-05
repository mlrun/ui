import React from 'react'
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
  MODELS_PAGE
} from '../constants'
import { convertBytes } from './convertBytes'

import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'

import { ReactComponent as Nosql } from '../images/nosql.svg'
import { ReactComponent as Stream } from '../images/stream.svg'
import { ReactComponent as TsdbIcon } from '../images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from '../images/db-icon.svg'

const createArtifactsContent = (artifacts, page, featureStoreTab, project) => {
  return artifacts.map(artifact => {
    let rowData = []

    if (page === ARTIFACTS_PAGE) {
      rowData = createArtifactsRowData(artifact)
    } else if (page === MODELS_PAGE) {
      rowData = createModelsRowData(artifact)
    } else if (page === FILES_PAGE) {
      rowData = createFilesRowData(artifact)
    } else if (page === FEATURE_STORE_PAGE) {
      if (featureStoreTab === DATASETS_TAB) {
        rowData = createDatasetsRowData(artifact)
      } else if (featureStoreTab === FEATURE_SETS_TAB) {
        rowData = createFeatureSetsRowData(artifact, project)
      } else if (featureStoreTab === FEATURES_TAB) {
        rowData = createFeaturesRowData(artifact)
      } else if (featureStoreTab === FEATURE_VECTORS_TAB) {
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
      link: 'info'
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
      link: 'info'
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

const createFilesRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'artifacts_medium',
      link: 'info'
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

const createDatasetsRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'artifacts_medium',
      link: 'info'
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
      link: `/projects/${project}/feature-store/feature-sets/${artifact.name}/${artifact.tag}/overview`
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
    description: {
      value: artifact.description,
      class: 'artifacts_medium'
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
  description: {
    value: artifact.description,
    class: 'artifacts_medium'
  },
  updated: {
    value: artifact.updated
      ? formatDatetime(new Date(artifact.updated), 'N/A')
      : 'N/A',
    class: 'artifacts_small'
  }
})

export default createArtifactsContent

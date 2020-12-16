import React from 'react'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  FILES_PAGE,
  MODELS_PAGE
} from '../constants'
import { convertBytes } from './convertBytes'

import { ReactComponent as Nosql } from '../images/nosql.svg'
import { ReactComponent as Stream } from '../images/stream.svg'
import { ReactComponent as TsdbIcon } from '../images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from '../images/db-icon.svg'

const createArtifactsContent = (artifacts, page, featureStoreTab, project) =>
  artifacts.map(artifact => {
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
      }
    }

    return rowData
  })

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
      link: `/projects/${project}/feature-store/feature-sets/${artifact.name}/${artifact.tag}/info`
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
      value: artifact.entities[0]?.name,
      class: 'artifacts_small'
    },
    targets: getFeatureSetTargetCellValue(artifact.targets)
  }
}

const createFeaturesRowData = artifact => {
  const artifactMetadata = artifact.feature_set_digest?.metadata

  return {
    key: {
      value: artifact.feature?.name,
      class: 'artifacts_medium'
    },
    feature_set: {
      value: artifact.feature_set_digest?.metadata?.name,
      class: 'artifacts_medium',
      link: `/projects/${artifactMetadata?.project}/feature-store/feature-sets/${artifactMetadata?.name}/${artifactMetadata?.tag}/info`
    },
    labels: {
      value: parseKeyValues(artifact.feature?.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    type: {
      value: artifact.feature?.value_type,
      class: 'artifacts_extra-small'
    },
    entity: {
      value: artifact.feature_set_digest?.spec?.entities[0]?.name,
      class: 'artifacts_extra-small'
    }
  }
}

const getFeatureSetTargetCellValue = targets => {
  const icons = []

  if (targets) {
    targets.forEach(target => {
      if (target.kind === 'nosql') {
        icons.push({
          icon: <Nosql />,
          tooltip: 'NoSql'
        })
      } else if (target.kind === 'stream') {
        icons.push({
          icon: <Stream />,
          tooltip: 'Stream'
        })
      } else if (target.kind === 'tsdb') {
        icons.push({
          icon: <TsdbIcon />,
          tooltip: 'TSDB'
        })
      } else {
        icons.push({
          icon: <DbIcon />,
          tooltip: target.kind
        })
      }
    })
  }

  return {
    value: icons,
    class: 'artifacts_small artifacts__targets-icon',
    type: 'icons'
  }
}

export default createArtifactsContent

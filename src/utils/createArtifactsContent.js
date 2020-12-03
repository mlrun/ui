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

const createArtifactsContent = (artifacts, page, featureStoreTab) =>
  artifacts.map(artifact => {
    var rowData = []

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
        rowData = createFeatureSetsRowData(artifact)
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

const createFeatureSetsRowData = artifact => {
  return {
    key: {
      value: artifact.name,
      class: 'artifacts_medium',
      link: 'info'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    version: {
      value: artifact.tag,
      class: 'artifacts_small'
    },
    updated: {
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small'
    }
  }
}

const createFeaturesRowData = artifact => {
  return {
    key: {
      value: artifact.feature?.name,
      class: 'artifacts_medium'
    },
    feature_set: {
      value: artifact.feature_set_digest?.metadata?.name,
      class: 'artifacts_medium',
      link: `/projects/${artifact.feature_set_digest?.metadata?.project}/feature-store/feature-sets/${artifact.feature_set_digest?.metadata?.name}/info`
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

export default createArtifactsContent

import React from 'react'

import AddFeatureButton from '../elements/AddFeatureButton/AddFeatureButton'
import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'

import {
  FEATURE_STORE_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { copyToClipboard } from './copyToClipboard'
import { generateUri } from './resources'
import { truncateUid } from '../utils'
import { getFeatureIdentifier } from './getUniqueIdentifier'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

import { ReactComponent as Nosql } from '../images/nosql.svg'
import { ReactComponent as Stream } from '../images/stream.svg'
import { ReactComponent as TsdbIcon } from '../images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from '../images/db-icon.svg'

export const createFeatureStoreContent = (
  content,
  pageTab,
  project,
  isTablePanelOpen
) => {
  return content.map(contentItem => {
    if (pageTab === FEATURE_SETS_TAB) {
      return createFeatureSetsRowData(contentItem, project)
    } else if (pageTab === FEATURE_VECTORS_TAB) {
      return createFeatureVectorsRowData(contentItem, project)
    }

    return createFeaturesRowData(contentItem, isTablePanelOpen)
  })
}

const createFeatureSetsRowData = (featureSet, project) => {
  return {
    key: {
      identifier: getFeatureIdentifier(featureSet),
      value: featureSet.name,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          FEATURE_STORE_PAGE,
          FEATURE_SETS_TAB,
          featureSet.name,
          featureSet.tag,
          tab,
          featureSet.uid
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: featureSet.tag || truncateUid(featureSet.uid),
        tooltip: featureSet.tag || featureSet.uid
      }
    },
    description: {
      value: featureSet.description,
      class: 'artifacts_medium'
    },
    labels: {
      value: parseKeyValues(featureSet.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    version: {
      value: featureSet.tag,
      class: 'artifacts_small',
      type: 'hidden'
    },
    entity: {
      value: featureSet.entities ? featureSet.entities[0]?.name : '',
      class: 'artifacts_small'
    },
    targets: getFeatureSetTargetCellValue(featureSet.targets),
    buttonCopy: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab))
    }
  }
}

const createFeaturesRowData = (feature, isTablePanelOpen) => {
  return {
    key: {
      identifier: getFeatureIdentifier(feature),
      value: feature.name,
      class: 'artifacts_medium',
      expandedCellContent: {
        class: 'artifacts_medium',
        value: feature.metadata?.tag
      }
    },
    feature_set: {
      value: feature.metadata?.name,
      class: 'artifacts_small',
      getLink: tab =>
        generateLinkToDetailsPanel(
          feature.metadata?.project,
          FEATURE_STORE_PAGE,
          FEATURE_SETS_TAB,
          feature.metadata?.name,
          feature.metadata?.tag,
          tab
        ),
      expandedCellContent: {
        class: 'artifacts_small',
        value: ''
      },
      rowExpanded: {
        getLink: tab =>
          generateLinkToDetailsPanel(
            feature.metadata?.project,
            FEATURE_STORE_PAGE,
            FEATURE_SETS_TAB,
            feature.metadata?.name,
            feature.metadata?.tag,
            tab
          )
      }
    },
    type: {
      value: feature.value_type,
      class: 'artifacts_extra-small'
    },
    entity: {
      value: feature.spec?.entities[0]?.name,
      class: 'artifacts_small'
    },
    description: {
      value: feature.description,
      class: 'artifacts_medium'
    },
    labels: {
      value: parseKeyValues(feature.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    targets: {
      ...getFeatureSetTargetCellValue(feature.targets),
      hidden: isTablePanelOpen
    },
    validator: {
      value: <FeatureValidator validator={feature.validator} />,
      class: 'artifacts_medium',
      type: 'component',
      hidden: isTablePanelOpen
    },
    addFeature: {
      value: <AddFeatureButton feature={feature} />,
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

const createFeatureVectorsRowData = (featureVector, project) => ({
  key: {
    identifier: getFeatureIdentifier(featureVector),
    value: featureVector.name,
    class: 'artifacts_medium',
    getLink: tab =>
      generateLinkToDetailsPanel(
        project,
        FEATURE_STORE_PAGE,
        FEATURE_VECTORS_TAB,
        featureVector.name,
        featureVector.tag,
        tab,
        featureVector.uid
      ),
    expandedCellContent: {
      class: 'artifacts_medium',
      value: featureVector.tag || truncateUid(featureVector.uid),
      tooltip: featureVector.tag || featureVector.uid
    }
  },
  description: {
    value: featureVector.description,
    class: 'artifacts_medium'
  },
  labels: {
    value: parseKeyValues(featureVector.labels),
    class: 'artifacts_big',
    type: 'labels'
  },
  version: {
    value: featureVector.tag,
    class: 'artifacts_small',
    type: 'hidden'
  },
  updated: {
    value: featureVector.updated
      ? formatDatetime(new Date(featureVector.updated), 'N/A')
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
    value: featureVector.uid,
    class: 'artifacts_small',
    type: 'hidden'
  }
})

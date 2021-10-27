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
import {
  getFeatureIdentifier,
  getFeatureSetIdentifier,
  getFeatureVectorIdentifier
} from './getUniqueIdentifier'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

import { ReactComponent as Nosql } from '../images/nosql.svg'
import { ReactComponent as Stream } from '../images/stream.svg'
import { ReactComponent as TsdbIcon } from '../images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from '../images/db-icon.svg'

export const createFeatureStoreContent = (
  content,
  pageTab,
  project,
  isTablePanelOpen,
  isSelectedItem
) => {
  return content.map(contentItem => {
    if (pageTab === FEATURE_SETS_TAB) {
      return createFeatureSetsRowData(contentItem, project, isSelectedItem)
    } else if (pageTab === FEATURE_VECTORS_TAB) {
      return createFeatureVectorsRowData(contentItem, project, isSelectedItem)
    }

    return createFeaturesRowData(contentItem, isTablePanelOpen)
  })
}

const createFeatureSetsRowData = (featureSet, project, isSelectedItem) => {
  const identifierUnique = getFeatureSetIdentifier(featureSet, true)

  return {
    key: {
      id: `key.${identifierUnique}`,
      identifier: getFeatureSetIdentifier(featureSet),
      identifierUnique: identifierUnique,
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
      id: `description.${identifierUnique}`,
      value: featureSet.description,
      class: 'artifacts_medium',
      hidden: isSelectedItem
    },
    labels: {
      id: `labels.${identifierUnique}`,
      value: parseKeyValues(featureSet.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    version: {
      id: `version.${identifierUnique}`,
      value: featureSet.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    entity: {
      id: `entity.${identifierUnique}`,
      value:
        featureSet.entities
          ?.slice(0, 2)
          .map(entity => entity.name)
          .join(', ') ?? '',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    targets: getFeatureSetTargetCellValue(featureSet.targets, isSelectedItem),
    buttonCopy: {
      id: `buttonCopy.${identifierUnique}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
      hidden: isSelectedItem
    }
  }
}

const createFeaturesRowData = (feature, isTablePanelOpen) => {
  const identifierUnique = getFeatureIdentifier(feature, true)

  return {
    key: {
      id: `key.${identifierUnique}`,
      identifier: getFeatureIdentifier(feature),
      identifierUnique: identifierUnique,
      type: feature.ui.type,
      value: feature.name,
      class: 'artifacts_medium',
      expandedCellContent: {
        class: 'artifacts_medium',
        value: feature.metadata?.tag
      }
    },
    feature_set: {
      id: `feature_set.${identifierUnique}`,
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
      id: `type.${identifierUnique}`,
      value: feature.value_type,
      class: 'artifacts_extra-small'
    },
    entity: {
      id: `entity.${identifierUnique}`,
      type: 'labels',
      value: feature.spec?.entities.map(entity => entity.name),
      class: 'artifacts_big'
    },
    description: {
      id: `description.${identifierUnique}`,
      value: feature.description,
      class: 'artifacts_medium',
      hidden: isTablePanelOpen
    },
    labels: {
      id: `labels.${identifierUnique}`,
      value: parseKeyValues(feature.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isTablePanelOpen
    },
    targets: {
      ...getFeatureSetTargetCellValue(feature.targets),
      hidden: isTablePanelOpen
    },
    validator: {
      id: `validator.${identifierUnique}`,
      value: <FeatureValidator validator={feature.validator} />,
      class: 'artifacts_medium',
      type: 'component',
      hidden: isTablePanelOpen
    },
    addFeature: {
      id: `addFeature.${identifierUnique}`,
      value: <AddFeatureButton feature={feature} />,
      class: 'artifacts_big align-right',
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

const getFeatureSetTargetCellValue = (
  targets,
  isSelectedItem,
  identifierUnique
) => ({
  value: (targets ?? [])
    .map(
      target =>
        kindToIcon[target.kind] ?? {
          icon: <DbIcon />,
          tooltip: target.kind
        }
    )
    .sort((icon, otherIcon) => (icon.tooltip < otherIcon.tooltip ? -1 : 1)),
  id: `targets.${identifierUnique}`,
  class: 'artifacts_small artifacts__targets-icon',
  type: 'icons',
  hidden: isSelectedItem
})

const createFeatureVectorsRowData = (
  featureVector,
  project,
  isSelectedItem
) => {
  const identifierUnique = getFeatureVectorIdentifier(featureVector, true)

  return {
    key: {
      id: `key.${identifierUnique}`,
      identifier: getFeatureVectorIdentifier(featureVector),
      identifierUnique: identifierUnique,
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
      id: `description.${identifierUnique}`,
      value: featureVector.description,
      class: 'artifacts_medium',
      hidden: isSelectedItem
    },
    labels: {
      id: `labels.${identifierUnique}`,
      value: parseKeyValues(featureVector.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    version: {
      id: `version.${identifierUnique}`,
      value: featureVector.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    updated: {
      id: `updated.${identifierUnique}`,
      value: featureVector.updated
        ? formatDatetime(new Date(featureVector.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    buttonCopy: {
      id: `buttonCopy.${identifierUnique}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
      hidden: isSelectedItem
    },
    uid: {
      id: `uid.${identifierUnique}`,
      value: featureVector.uid,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    }
  }
}

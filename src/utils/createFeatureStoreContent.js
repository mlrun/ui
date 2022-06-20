import React from 'react'

import AddFeatureButton from '../elements/AddFeatureButton/AddFeatureButton'
import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'

import { FEATURE_STORE_PAGE, FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../constants'
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

import { ReactComponent as Nosql } from 'igz-controls/images/nosql.svg'
import { ReactComponent as Stream } from 'igz-controls/images/stream.svg'
import { ReactComponent as TsdbIcon } from 'igz-controls/images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from 'igz-controls/images/db-icon.svg'

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

export const createFeatureSetsRowData = (featureSet, project, isSelectedItem, showExpandButton) => {
  const identifierUnique = getFeatureSetIdentifier(featureSet, true)

  return {
    data: {
      ...featureSet,
      ui: {
        ...featureSet.ui,
        identifier: getFeatureSetIdentifier(featureSet),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Name',
        value: featureSet.name,
        class: 'table-cell-2',
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
        showTag: true,
        showStatus: true,
        expandedCellContent: {
          class: 'table-cell-2',
          value: featureSet.tag || truncateUid(featureSet.uid),
          tooltip: featureSet.tag || featureSet.uid,
          showTag: true,
          showStatus: true
        },
        showExpandButton
      },
      {
        id: `description.${identifierUnique}`,
        header: 'Description',
        value: featureSet.description,
        class: 'table-cell-2',
        hidden: isSelectedItem
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(featureSet.labels),
        class: 'table-cell-4',
        type: 'labels',
        hidden: isSelectedItem
      },
      {
        id: `version.${identifierUnique}`,
        value: featureSet.tag,
        class: 'table-cell-2',
        type: 'hidden',
        hidden: isSelectedItem
      },
      {
        id: `entity.${identifierUnique}`,
        header: 'Entities',
        value:
          featureSet.entities
            ?.slice(0, 2)
            .map(entity => entity.name)
            .join(', ') ?? '',
        class: 'table-cell-1',
        hidden: isSelectedItem
      },
      { ...getFeatureSetTargetCellValue(featureSet.targets, isSelectedItem) },
      {
        id: `buttonCopy.${identifierUnique}`,
        value: '',
        class: 'table-cell-small artifacts__icon',
        type: 'buttonCopyURI',
        actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
        hidden: isSelectedItem
      }
    ]
  }
}

export const createFeaturesRowData = (feature, isTablePanelOpen, showExpandButton) => {
  const identifierUnique = getFeatureIdentifier(feature, true)

  return {
    data: {
      ...feature,
      ui: {
        ...feature.ui,
        identifier: getFeatureIdentifier(feature),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Feature Name',
        type: feature.ui.type,
        value: feature.name,
        class: 'table-cell-3',
        expandedCellContent: {
          class: 'table-cell-3',
          value: feature.metadata?.tag
        },
        showExpandButton
      },
      {
        id: `feature_set.${identifierUnique}`,
        header: 'Feature set',
        value: feature.metadata?.name,
        class: 'table-cell-2',
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
          class: 'table-cell-2',
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
      {
        id: `type.${identifierUnique}`,
        header: 'Type',
        value: feature.value_type,
        class: 'table-cell-1'
      },
      {
        id: `entity.${identifierUnique}`,
        header: 'Entities',
        type: 'labels',
        value: feature.spec?.entities.map(entity => entity.name),
        class: 'table-cell-4'
      },
      {
        id: `description.${identifierUnique}`,
        header: 'Description',
        value: feature.description,
        class: 'table-cell-3',
        hidden: isTablePanelOpen
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(feature.labels),
        class: 'table-cell-4',
        type: 'labels',
        hidden: isTablePanelOpen
      },
      {
        ...getFeatureSetTargetCellValue(feature.targets),
        hidden: isTablePanelOpen
      },
      {
        id: `validator.${identifierUnique}`,
        header: 'Validator',
        value: <FeatureValidator validator={feature.validator} />,
        class: 'table-cell-3',
        type: 'component',
        hidden: isTablePanelOpen
      },
      {
        id: `addFeature.${identifierUnique}`,
        value: feature.ui.type === 'feature' && <AddFeatureButton feature={feature} />,
        class: 'table-cell-2 align-right',
        type: 'component',
        hidden: !isTablePanelOpen
      }
    ]
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

const getFeatureSetTargetCellValue = (targets, isSelectedItem, identifierUnique) => ({
  header: 'Targets',
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
  class: 'table-cell-1 artifacts__targets-icon',
  type: 'icons',
  hidden: isSelectedItem
})

export const createFeatureVectorsRowData = (
  featureVector,
  project,
  isSelectedItem,
  showExpandButton
) => {
  const identifierUnique = getFeatureVectorIdentifier(featureVector, true)

  return {
    data: {
      ...featureVector,
      ui: {
        ...featureVector.ui,
        identifier: getFeatureVectorIdentifier(featureVector),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Name',
        value: featureVector.name,
        class: 'table-cell-3',
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
        showTag: true,
        showStatus: true,
        expandedCellContent: {
          class: 'table-cell-3',
          value: featureVector.tag || truncateUid(featureVector.uid),
          tooltip: featureVector.tag || featureVector.uid,
          showTag: true,
          showStatus: true
        },
        showExpandButton
      },
      {
        id: `description.${identifierUnique}`,
        header: 'Description',
        value: featureVector.description,
        class: 'table-cell-3',
        hidden: isSelectedItem
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(featureVector.labels),
        class: 'table-cell-4',
        type: 'labels',
        hidden: isSelectedItem
      },
      {
        id: `version.${identifierUnique}`,
        value: featureVector.tag,
        class: 'table-cell-2',
        type: 'hidden',
        hidden: isSelectedItem
      },
      {
        id: `entity.${identifierUnique}`,
        header: 'Entities',
        value: featureVector.index_keys?.join(', ') ?? '',
        class: 'table-cell-2',
        hidden: isSelectedItem
      },
      {
        id: `updated.${identifierUnique}`,
        header: 'Updated',
        value: featureVector.updated
          ? formatDatetime(new Date(featureVector.updated), 'N/A')
          : 'N/A',
        class: 'table-cell-2',
        showTag: true,
        showStatus: true,
        hidden: isSelectedItem
      },
      {
        id: `buttonCopy.${identifierUnique}`,
        value: '',
        class: 'table-cell-1 artifacts__icon',
        type: 'buttonCopyURI',
        actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
        hidden: isSelectedItem
      },
      {
        id: `uid.${identifierUnique}`,
        value: featureVector.uid,
        class: 'table-cell-2',
        type: 'hidden',
        hidden: isSelectedItem
      }
    ]
  }
}

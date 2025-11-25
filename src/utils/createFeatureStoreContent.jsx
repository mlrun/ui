/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'

import AddFeatureButton from '../elements/AddFeatureButton/AddFeatureButton'
import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'
import FeatureSetPopUp from '../elements/DetailsPopUp/FeatureSetPopUp/FeatureSetPopUp'

import { FEATURE_STORE_PAGE, FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../constants'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import { generateLinkToDetailsPanel } from './link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData, parseEntitiesData } from './convertChipsData'
import { truncateUid } from 'igz-controls/utils/string.util'
import { validateArguments } from './validateArguments'

import Nosql from 'igz-controls/images/nosql.svg?react'
import Stream from 'igz-controls/images/stream.svg?react'
import TsdbIcon from 'igz-controls/images/tsdb-icon.svg?react'
import DbIcon from 'igz-controls/images/db-icon.svg?react'

export const createFeatureStoreContent = (content, pageTab, project, isTablePanelOpen) => {
  return content.map(contentItem => {
    if (pageTab === FEATURE_SETS_TAB) {
      return createFeatureSetsRowData(contentItem, project, pageTab)
    } else if (pageTab === FEATURE_VECTORS_TAB) {
      return createFeatureVectorsRowData(contentItem, pageTab, project)
    }

    return createFeaturesRowData(contentItem, isTablePanelOpen)
  })
}

export const createFeatureSetsRowData = (featureSet, project, pageTab, showExpandButton) => {
  return {
    data: {
      ...featureSet
    },
    content: [
      {
        id: `key.${featureSet.ui.identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: featureSet.name,
        className: 'table-cell-name',
        getLink: tab =>
          validateArguments(featureSet.name, featureSet.tag, tab)
            ? generateLinkToDetailsPanel(
                project,
                FEATURE_STORE_PAGE,
                FEATURE_SETS_TAB,
                featureSet.name,
                featureSet.tag,
                tab,
                featureSet.uid
              )
            : '',
        showTag: true,
        showStatus: true,
        expandedCellContent: {
          className: 'table-cell-name',
          value: featureSet.tag || truncateUid(featureSet.uid),
          tooltip: featureSet.tag || featureSet.uid,
          showTag: true,
          showStatus: true
        },
        showExpandButton
      },
      {
        id: `description.${featureSet.ui.identifierUnique}`,
        headerId: 'description',
        headerLabel: 'Description',
        value: featureSet.description,
        className: 'table-cell-2'
      },
      {
        id: `labels.${featureSet.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(featureSet.labels),
        className: 'table-cell-4',
        type: 'labels'
      },
      {
        id: `version.${featureSet.ui.identifierUnique}`,
        headerId: 'tag',
        value: featureSet.tag,
        className: 'table-cell-2',
        type: 'hidden'
      },
      {
        id: `entity.${featureSet.ui.identifierUnique}`,
        headerId: 'entities',
        headerLabel: 'Entities',
        value: parseEntitiesData(featureSet.entities?.slice(0, 2)),
        type: 'labels',
        className: 'table-cell-2'
      },
      { ...getFeatureSetTargetCellValue(featureSet.targets) },
      {
        id: `updated.${featureSet.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: featureSet.updated ? formatDatetime(featureSet.updated, 'N/A') : 'N/A',
        className: 'table-cell-2'
      }
    ]
  }
}

export const createFeaturesRowData = (feature, isTablePanelOpen, showExpandButton) => {
  return {
    data: {
      ...feature
    },
    content: [
      {
        id: `key.${feature.ui.identifierUnique}`,
        headerId: 'featurename',
        headerLabel: 'Feature name',
        type: feature.ui.type,
        value: feature.name,
        className: 'table-cell-name',
        expandedCellContent: {
          className: 'table-cell-name',
          value: feature.metadata?.tag || truncateUid(feature.metadata?.uid),
          tooltip: feature.metadata?.tag || feature.metadata.uid
        },
        showExpandButton
      },
      {
        id: `feature_set.${feature.ui.identifierUnique}`,
        headerId: 'featureset',
        headerLabel: 'Feature set',
        value: feature.metadata?.name,
        className: 'table-cell-2',
        handleClick: () =>
          openPopUp(FeatureSetPopUp, {
            featureSetData: {
              project: feature.metadata?.project,
              name: feature.metadata?.name,
              tag: feature.metadata?.tag
            }
          }),
        expandedCellContent: {
          className: 'table-cell-2',
          value: ''
        },
        rowExpanded: {
          handleClick: () =>
            openPopUp(FeatureSetPopUp, {
              featureSetData: {
                project: feature.metadata?.project,
                name: feature.metadata?.name,
                tag: feature.metadata?.tag
              }
            })
        }
      },
      {
        id: `type.${feature.ui.identifierUnique}`,
        headerId: 'type',
        headerLabel: 'Type',
        value: feature.value_type,
        className: 'table-cell-1'
      },
      {
        id: `entity.${feature.ui.identifierUnique}.${isTablePanelOpen}`,
        headerId: 'entities',
        headerLabel: 'Entities',
        type: 'labels',
        value: parseEntitiesData(feature.spec?.entities),
        className: 'table-cell-2'
      },
      {
        id: `description.${feature.ui.identifierUnique}`,
        headerId: 'description',
        headerLabel: 'Description',
        value: feature?.description ?? '',
        className: 'table-cell-2'
      },
      {
        id: `labels.${feature.ui.identifierUnique}.${isTablePanelOpen}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(feature.labels),
        className: isTablePanelOpen ? 'table-cell-2' : 'table-cell-3',
        type: 'labels'
      },
      {
        id: `validator.${feature.ui.identifierUnique}`,
        headerId: 'validator',
        headerLabel: 'Validator',
        value: <FeatureValidator validator={feature.validator} />,
        className: 'table-cell-2',
        type: 'component',
        hidden: isTablePanelOpen
      },
      {
        id: `addFeature.${feature.ui.identifierUnique}`,
        headerId: 'addfeature',
        value: feature.ui.type === 'feature' && <AddFeatureButton feature={feature} />,
        className: 'table-cell-1 align-right',
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

const getFeatureSetTargetCellValue = (targets, identifierUnique) => ({
  headerId: 'targets',
  headerLabel: 'Targets',
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
  className: 'targets-cell table-cell-2',
  type: 'icons'
})

export const createFeatureVectorsRowData = (featureVector, pageTab, project, showExpandButton) => {
  return {
    data: {
      ...featureVector
    },
    content: [
      {
        id: `key.${featureVector.ui.identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: featureVector.name,
        className: 'table-cell-name',
        getLink: tab =>
          validateArguments(featureVector.name, featureVector.tag, tab)
            ? generateLinkToDetailsPanel(
                project,
                FEATURE_STORE_PAGE,
                FEATURE_VECTORS_TAB,
                featureVector.name,
                featureVector.tag,
                tab,
                featureVector.uid
              )
            : '',
        showTag: true,
        showStatus: true,
        expandedCellContent: {
          className: 'table-cell-name',
          value: featureVector.tag || truncateUid(featureVector.uid),
          tooltip: featureVector.tag || featureVector.uid,
          showTag: true,
          showStatus: true
        },
        showExpandButton
      },
      {
        id: `description.${featureVector.ui.identifierUnique}`,
        headerId: 'description',
        headerLabel: 'Description',
        value: featureVector.description,
        className: 'table-cell-3'
      },
      {
        id: `labels.${featureVector.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(featureVector.labels),
        className: 'table-cell-4',
        type: 'labels'
      },
      {
        id: `version.${featureVector.ui.identifierUnique}`,
        headerId: 'tag',
        value: featureVector.tag,
        className: 'table-cell-2',
        type: 'hidden'
      },
      {
        id: `entity.${featureVector.ui.identifierUnique}`,
        headerId: 'entities',
        headerLabel: 'Entities',
        value:
          featureVector.index_keys?.length > 0
            ? parseEntitiesData([{ name: featureVector.index_keys?.join(', ') }])
            : [],
        className: 'table-cell-2'
      },
      {
        id: `updated.${featureVector.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: featureVector.updated ? formatDatetime(featureVector.updated, 'N/A') : 'N/A',
        className: 'table-cell-2',
        showTag: true,
        showStatus: true
      },
      {
        id: `uid.${featureVector.ui.identifierUnique}`,
        headerId: 'featurevectoruid',
        value: featureVector.uid,
        className: 'table-cell-2',
        type: 'hidden'
      }
    ]
  }
}

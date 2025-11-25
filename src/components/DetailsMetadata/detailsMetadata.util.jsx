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

import FeatureValidator from '../../elements/FeatureValidator/FeatureValidator'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import Primary from 'igz-controls/images/ic-key.svg?react'
import Partition from 'igz-controls/images/partition.svg?react'
import TimestampKey from 'igz-controls/images/ic-calendar.svg?react'
import LabelColumn from 'igz-controls/images/ic_target-with-dart.svg?react'

import { parseChipsData } from '../../utils/convertChipsData'

export const generateMetadata = (selectedItem, primaryKey) => {
  return selectedItem.schema
    ? generateArtifactDefaultMetadata(selectedItem, primaryKey)
    : selectedItem.entities
      ? generateArtifactMetadataFromEntities(selectedItem)
      : selectedItem.features
        ? generateArtifactMetadataFromFeatures(selectedItem)
        : selectedItem.inputs || selectedItem.outputs
          ? generateArtifactMetadataFromInputsAndOutputs(selectedItem)
          : []
}

export const generateArtifactDefaultMetadata = (selectedItem, primaryKey) =>
  selectedItem.schema.fields.map(field => {
    return {
      primaryKeyIcon: {
        value: (
          <Tooltip template={<TextTooltipTemplate text="Primary key" />}>
            <Primary />
          </Tooltip>
        ),
        type: 'icon',
        hidden: !primaryKey.includes(field.name)
      },
      name: {
        value: field.name,
        type: 'text'
      },
      type: {
        value: field.type,
        type: 'text'
      },
      count: {
        value: selectedItem?.stats?.[field.name]?.count ?? '',
        type: 'text'
      },
      mean: {
        value: selectedItem?.stats?.[field.name]?.mean ?? '',
        type: 'text'
      },
      std: {
        value: selectedItem?.stats?.[field.name]?.std?.toFixed(8) ?? '',
        type: 'text'
      },
      min: {
        value: selectedItem?.stats?.[field.name]?.min ?? '',
        type: 'text'
      },
      '25%': {
        value: selectedItem?.stats?.[field.name]?.['25%'] ?? '',
        type: 'text'
      },
      '50%': {
        value: selectedItem?.stats?.[field.name]?.['50%'] ?? '',
        type: 'text'
      },
      '75%': {
        value: selectedItem?.stats?.[field.name]?.['75%'] ?? '',
        type: 'text'
      },
      max: {
        value: selectedItem?.stats?.[field.name]?.max ?? '',
        type: 'text'
      }
    }
  })

export const generateArtifactMetadataFromEntities = selectedItem => {
  return selectedItem.entities
    .map(item => ({ ...item, entity: 'entity' }))
    .concat(selectedItem.features)
    .map(item => {
      return {
        entityIcon: {
          value: (
            <Tooltip template={<TextTooltipTemplate text="Entity" />}>
              <Primary />
            </Tooltip>
          ),
          type: 'icon',
          hidden: !item.entity
        },
        partitionIcon: {
          value: (
            <Tooltip template={<TextTooltipTemplate text="Partition" />}>
              <Partition />
            </Tooltip>
          ),
          type: 'icon',
          hidden: !selectedItem.partition_keys?.includes(item.name)
        },
        timestampKeyIcon: {
          value: (
            <Tooltip template={<TextTooltipTemplate text="Timestamp key" />}>
              <TimestampKey />
            </Tooltip>
          ),
          type: 'icon',
          hidden:
            selectedItem.timestamp_key !== item.name && selectedItem.timestamp_field !== item.name
        },
        labelColumnIcon: {
          value: (
            <Tooltip template={<TextTooltipTemplate text="Label column" />}>
              <LabelColumn />
            </Tooltip>
          ),
          type: 'icon',
          hidden: selectedItem.label_column !== item.name
        },
        name: {
          value: item.name,
          type: 'text'
        },
        type: {
          value: item.value_type,
          type: 'text'
        },
        description: {
          value: item.description,
          type: 'text'
        },
        labels: {
          value: parseChipsData(item.labels),
          type: 'chip',
          className: 'table-body__labels'
        },
        validators: {
          value: <FeatureValidator validator={item.validator} />,
          type: 'html'
        }
      }
    })
}

export const generateArtifactMetadataFromFeatures = selectedItem =>
  selectedItem.features.map(item => {
    return {
      timestampKeyIcon: {
        value: (
          <Tooltip template={<TextTooltipTemplate text="Timestamp key" />}>
            <TimestampKey />
          </Tooltip>
        ),
        type: 'icon',
        hidden:
          selectedItem.timestamp_key !== item.name && selectedItem.timestamp_field !== item.name
      },
      labelColumnIcon: {
        value: (
          <Tooltip template={<TextTooltipTemplate text="Label column" />}>
            <LabelColumn />
          </Tooltip>
        ),
        type: 'icon',
        hidden: selectedItem.label_column !== item.name
      },
      name: {
        value: item.name,
        type: 'text'
      },
      type: {
        value: item.value_type,
        type: 'text'
      },
      description: {
        value: item.description,
        type: 'text'
      },
      labels: {
        value: parseChipsData(item.labels),
        type: 'chip',
        className: 'table-body__labels'
      },
      validators: {
        value: item.validator && <FeatureValidator validator={item.validator} />,
        type: 'html',
        hidden: !item.validator
      }
    }
  })

export const generateArtifactMetadataFromInputsAndOutputs = selectedItem =>
  (selectedItem.outputs ?? [])
    .map(item => ({ ...item, output: 'output' }))
    .concat(selectedItem.inputs ?? [])
    .map(item => {
      return {
        timestampKeyIcon: {
          value: (
            <Tooltip template={<TextTooltipTemplate text="Timestamp key" />}>
              <TimestampKey />
            </Tooltip>
          ),
          type: 'icon',
          hidden:
            selectedItem.timestamp_key !== item.name && selectedItem.timestamp_field !== item.name
        },
        labelColumnIcon: {
          value: (
            <Tooltip template={<TextTooltipTemplate text="Output" />}>
              <LabelColumn />
            </Tooltip>
          ),
          type: 'icon',
          hidden: !item.output
        },
        name: {
          value: item.name,
          type: 'text'
        },
        type: {
          value: item.value_type,
          type: 'text'
        },
        description: {
          value: item.description,
          type: 'text'
        },
        labels: {
          value: parseChipsData(item.labels),
          type: 'chip',
          className: 'table-body__labels'
        },
        validators: {
          value: item.validator && <FeatureValidator validator={item.validator} />,
          type: 'html',
          hidden: !item.validator
        }
      }
    })

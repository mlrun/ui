import React from 'react'

import FeatureValidator from '../../elements/FeatureValidator/FeatureValidator'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { ReactComponent as Primary } from '../../images/ic-key.svg'
import { ReactComponent as Partition } from '../../images/partition.svg'
import { ReactComponent as TimestampKey } from '../../images/ic-calendar.svg'
import { ReactComponent as LabelColumn } from '../../images/ic_target-with-dart.svg'

import { parseKeyValues } from '../../utils'

export const generateMetadata = (selectedItem, primaryKey) => {
  return selectedItem.schema
    ? selectedItem.schema.fields.map(field => {
        return {
          primaryKeyIcon: {
            value: (
              <Tooltip template={<TextTooltipTemplate text="Primary key" />}>
                <Primary />
              </Tooltip>
            ),
            type: 'icon icon-key',
            visible: primaryKey.includes(field.name)
          },
          name: {
            value: field.name,
            type: 'text',
            visible: true
          },
          type: {
            value: field.type,
            type: 'text',
            visible: true
          },
          count: {
            value: selectedItem?.stats?.[field.name]?.count ?? '',
            type: 'text',
            visible: true
          },
          mean: {
            value: selectedItem?.stats?.[field.name]?.mean ?? '',
            type: 'text',
            visible: true
          },
          std: {
            value: selectedItem?.stats?.[field.name]?.std?.toFixed(8) ?? '',
            type: 'text',
            visible: true
          },
          min: {
            value: selectedItem?.stats?.[field.name]?.min ?? '',
            type: 'text',
            visible: true
          },
          '25%': {
            value: selectedItem?.stats?.[field.name]?.['25%'] ?? '',
            type: 'text',
            visible: true
          },
          '50%': {
            value: selectedItem?.stats?.[field.name]?.['50%'] ?? '',
            type: 'text',
            visible: true
          },
          '75%': {
            value: selectedItem?.stats?.[field.name]?.['75%'] ?? '',
            type: 'text',
            visible: true
          },
          max: {
            value: selectedItem?.stats?.[field.name]?.max ?? '',
            type: 'text',
            visible: true
          }
        }
      })
    : selectedItem.entities
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
              type: 'icon icon-key',
              visible: !!item.entity
            },
            partitionIcon: {
              value: (
                <Tooltip template={<TextTooltipTemplate text="Partition" />}>
                  <Partition />
                </Tooltip>
              ),
              type: 'icon icon-partition',
              visible: !!selectedItem.partition_keys.includes(item.name)
            },
            timestampKeyIcon: {
              value: (
                <Tooltip
                  template={<TextTooltipTemplate text="Timestamp key" />}
                >
                  <TimestampKey />
                </Tooltip>
              ),
              type: 'icon icon-timestamp-key',
              visible: selectedItem.timestamp_key === item.name
            },
            labelColumnIcon: {
              value: (
                <Tooltip template={<TextTooltipTemplate text="Label column" />}>
                  <LabelColumn />
                </Tooltip>
              ),
              type: 'icon icon-label-column',
              visible: selectedItem.label_column === item.name
            },
            name: {
              value: item.name,
              type: 'text',
              visible: true
            },
            type: {
              value: item.value_type,
              type: 'text',
              visible: true
            },
            description: {
              value: item.description,
              type: 'text',
              visible: true
            },
            labels: {
              value: parseKeyValues(item.labels),
              type: 'chip',
              visible: true,
              className: 'table-body__labels'
            },
            validators: {
              value: <FeatureValidator validator={item.validator} />,
              type: 'html',
              visible: true
            }
          }
        })
}

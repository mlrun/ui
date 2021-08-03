import React from 'react'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Primary } from '../../images/ic-key.svg'
import { ReactComponent as LabelColumn } from '../../images/ic_target-with-dart.svg'

export const generateStatistics = selectedItem => {
  const content = selectedItem.entities
    ? selectedItem.entities
        .map(item => ({ ...item, entity: 'entity' }))
        .concat(selectedItem.features)
    : selectedItem.features

  return content.map(item => {
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
        value: item.name ?? '',
        type: 'text'
      },
      count: {
        value: selectedItem?.stats?.[item.name]?.count ?? '',
        type: 'text'
      },
      mean: {
        value: selectedItem?.stats?.[item.name]?.mean ?? '',
        type: 'text'
      },
      std: {
        value: selectedItem?.stats?.[item.name]?.std?.toFixed(8) ?? '',
        type: 'text'
      },
      min: {
        value: selectedItem?.stats?.[item.name]?.min ?? '',
        type: 'text'
      },
      max: {
        value: selectedItem?.stats?.[item.name]?.max ?? '',
        type: 'text'
      },
      unique: {
        value: selectedItem?.stats?.[item.name]?.unique ?? '',
        type: 'text'
      },
      top: {
        value: selectedItem?.stats?.[item.name]?.top ?? '',
        type: 'text'
      },
      freq: {
        value: selectedItem?.stats?.[item.name]?.freq ?? '',
        type: 'text'
      },
      histogram: {
        value: selectedItem?.stats?.[item.name]?.hist ?? [[], []],
        type: 'chart'
      }
    }
  })
}

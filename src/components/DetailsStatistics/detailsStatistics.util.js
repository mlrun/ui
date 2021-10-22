import React from 'react'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Primary } from '../../images/ic-key.svg'
import { ReactComponent as LabelColumn } from '../../images/ic_target-with-dart.svg'

export const generateStatistics = selectedItem => {
  return Object.entries(selectedItem?.stats ?? {}).map(([name, metrics]) => {
    return {
      entityIcon: {
        value: (
          <Tooltip template={<TextTooltipTemplate text="Entity" />}>
            <Primary />
          </Tooltip>
        ),
        type: 'icon',
        hidden: !selectedItem.entities?.some(entity => entity.name === name)
      },
      labelColumnIcon: {
        value: (
          <Tooltip template={<TextTooltipTemplate text="Label column" />}>
            <LabelColumn />
          </Tooltip>
        ),
        type: 'icon',
        hidden: selectedItem.label_column !== name
      },
      name: {
        value: name ?? '',
        type: 'text'
      },
      count: {
        value: metrics?.count ?? '',
        type: 'text'
      },
      mean: {
        value: metrics?.mean ?? '',
        type: 'text'
      },
      std: {
        value: metrics?.std?.toFixed(8) ?? '',
        type: 'text'
      },
      min: {
        value: metrics?.min ?? '',
        type: 'text'
      },
      max: {
        value: metrics?.max ?? '',
        type: 'text'
      },
      unique: {
        value: metrics?.unique ?? '',
        type: 'text'
      },
      top: {
        value: metrics?.top ?? '',
        type: 'text'
      },
      freq: {
        value: metrics?.freq ?? '',
        type: 'text'
      },
      histogram: {
        value: metrics?.hist ?? [[], []],
        type: 'chart'
      }
    }
  })
}

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

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { roundFloats } from 'igz-controls/utils/common.util'

import Primary from 'igz-controls/images/ic-key.svg?react'
import LabelColumn from 'igz-controls/images/ic_target-with-dart.svg?react'

export const DETAILS_STATISTICS_TABLE_ID = 'DETAILS_STATISTICS_TABLE_ID'
export const DETAILS_STATISTICS_TABLE_BODY_ID = 'DETAILS_STATISTICS_TABLE_BODY_ID'

export const generateStatistics = selectedItem => {
  return Object.entries((selectedItem?.stats || selectedItem.feature_stats) ?? {}).map(
    ([name, metrics]) => {
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
          value: roundFloats(metrics.std ?? metrics.stddev, 8),
          type: 'text'
        },
        min: {
          value: metrics?.min ?? '',
          type: 'text'
        },
        '25%': {
          value: metrics?.['25%'] ?? '',
          type: 'text'
        },
        median: {
          value: metrics?.['50%'] ?? '',
          type: 'text'
        },
        '75%': {
          value: metrics?.['75%'] ?? '',
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
    }
  )
}

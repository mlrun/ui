import { roundFloats } from '../../utils/roundFloats'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { ReactComponent as LabelColumn } from 'igz-controls/images/ic_target-with-dart.svg'

export const generateFeaturesAnalysis = (modelEndpoint = {}) => {
  const currentStats = modelEndpoint?.status?.current_stats ?? {}
  const driftMeasures = modelEndpoint?.status?.drift_measures ?? {}
  const featureStats = modelEndpoint?.status?.feature_stats ?? {}
  const labelNames = modelEndpoint?.spec?.label_names ?? []

  const tableHeaders = [
    {
      label: '',
      className: 'features-analysis__table-cell_icon'
    },
    {
      label: 'Feature',
      className: 'features-analysis__table-cell_big'
    },
    {
      label: 'Mean',
      className:
        'features-analysis__table-cell_split features-analysis__table-cell_big',
      contentArray: [
        { label: 'Expected', className: 'features-analysis__table-cell_small' },
        { label: 'Actual', className: 'features-analysis__table-cell_small' }
      ]
    },
    {
      label: 'Std',
      className:
        'features-analysis__table-cell_split features-analysis__table-cell_big',
      contentArray: [
        { label: 'Expected', className: 'features-analysis__table-cell_small' },
        { label: 'Actual', className: 'features-analysis__table-cell_small' }
      ]
    },
    {
      label: 'Min',
      className:
        'features-analysis__table-cell_split features-analysis__table-cell_big',
      contentArray: [
        { label: 'Expected', className: 'features-analysis__table-cell_small' },
        { label: 'Actual', className: 'features-analysis__table-cell_small' }
      ]
    },
    {
      label: 'Max',
      className:
        'features-analysis__table-cell_split features-analysis__table-cell_big',
      contentArray: [
        { label: 'Expected', className: 'features-analysis__table-cell_small' },
        { label: 'Actual', className: 'features-analysis__table-cell_small' }
      ]
    },
    { label: 'TVD', className: 'features-analysis__table-cell_small' },
    { label: 'Hellinger', className: 'features-analysis__table-cell_medium' },
    { label: 'KLD', className: 'features-analysis__table-cell_small' },
    {
      label: 'Histogram',
      className:
        'features-analysis__table-cell_split features-analysis__table-cell_huge',
      contentArray: [
        { label: 'Expected', className: 'features-analysis__table-cell_small' },
        { label: 'Actual', className: 'features-analysis__table-cell_small' }
      ]
    }
  ]

  const tableBody = Object.entries(featureStats).map(([key, value]) => {
    return {
      labelColumn: {
        value: labelNames.includes(key) && (
            <Tooltip template={<TextTooltipTemplate text="Label column" />}>
              <LabelColumn />
            </Tooltip>
        ),
        type: 'icon',
        className: 'features-analysis__table-cell_icon'
      },
      feature: {
        value: key,
        type: 'text',
        className: 'features-analysis__table-cell_big'
      },
      mean: {
        className: 'features-analysis__table-cell_big',
        contentArray: [
          {
            value: roundFloats(value?.mean, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          },
          {
            value: roundFloats(currentStats[key]?.mean, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          }
        ]
      },
      std: {
        className: 'features-analysis__table-cell_big',
        contentArray: [
          {
            value: roundFloats(value?.std, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          },
          {
            value: roundFloats(currentStats[key]?.std, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          }
        ]
      },
      min: {
        className: 'features-analysis__table-cell_big',
        contentArray: [
          {
            value: roundFloats(value?.min, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          },
          {
            value: roundFloats(currentStats[key]?.min, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          }
        ]
      },
      max: {
        className: 'features-analysis__table-cell_big',
        contentArray: [
          {
            value: roundFloats(value?.max, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          },
          {
            value: roundFloats(currentStats[key]?.max, 2) ?? '-',
            type: 'text',
            className: 'features-analysis__table-cell_small'
          }
        ]
      },
      tvd: {
        value: roundFloats(driftMeasures[key]?.tvd, 2) ?? '-',
        type: 'text',
        className: 'features-analysis__table-cell_small'
      },
      hellinger: {
        value: roundFloats(driftMeasures[key]?.hellinger, 2) ?? '-',
        type: 'text',
        className: 'features-analysis__table-cell_medium'
      },
      kld: {
        value: roundFloats(driftMeasures[key]?.kld, 2) ?? '-',
        type: 'text',
        className: 'features-analysis__table-cell_small'
      },
      histogram: {
        className: 'features-analysis__table-cell_huge',
        contentArray: [
          {
            value: value?.hist ?? [[], []],
            type: 'chart',
            className:
              'features-analysis__table-cell_medium features-analysis__table-cell-chart'
          },
          {
            value: currentStats[key]?.hist ?? [[], []],
            type: 'chart',
            className:
              'features-analysis__table-cell_medium features-analysis__table-cell-chart'
          }
        ]
      }
    }
  })

  return {
    header: tableHeaders,
    body: tableBody
  }
}

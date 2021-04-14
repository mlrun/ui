import { roundFloats } from '../../utils/roundFloats'

export const generateDriftAnalysis = detailsStore => {
  const measures = detailsStore.modelEndpoint.status.drift_measures ?? {}

  const tableHeaders = [
    { value: 'Metric', className: 'drift-analysis__table-cell_big' },
    { value: 'TVD', className: 'drift-analysis__table-cell_medium' },
    { value: 'Hellinger', className: 'drift-analysis__table-cell_medium' },
    { value: 'KLD', className: 'drift-analysis__table-cell_medium' }
  ]

  const tableBody = [
    [
      {
        value: 'Sum',
        className: 'drift-analysis__table-cell_big'
      },
      {
        value: roundFloats(measures.tvd_sum, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.hellinger_sum, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.kld_sum, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      }
    ],
    [
      {
        value: 'Mean',
        className: 'drift-analysis__table-cell_big'
      },
      {
        value: roundFloats(measures.tvd_mean, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.hellinger_mean, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.kld_mean, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      }
    ]
  ]

  return {
    header: tableHeaders,
    body: tableBody
  }
}

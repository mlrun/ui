import { CONSUMER_GROUP_PAGE } from '../../constants'

export const generatePageData = () => {
  return {
    page: CONSUMER_GROUP_PAGE,
    tableHeaders: [
      {
        header: 'Shard/Partition name',
        class: 'table-cell-1'
      },
      {
        header: 'Lag (message behind)',
        class: 'table-cell-1'
      },
      {
        header: 'Last sequence',
        class: 'table-cell-1'
      },
      {
        header: 'Committed offset',
        class: 'table-cell-1'
      }
    ]
  }
}

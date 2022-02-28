import { CONSUMER_GROUPS_PAGE } from '../../constants'

export const generatePageData = () => {
  return {
    page: CONSUMER_GROUPS_PAGE,
    tableHeaders: [
      {
        header: 'Consumer group name',
        class: 'table-cell-2'
      },
      {
        header: 'Stream',
        class: 'table-cell-2'
      },
      {
        header: 'Real time functions',
        class: 'table-cell-2'
      },
      {
        header: '',
        class: 'action_cell'
      }
    ]
  }
}

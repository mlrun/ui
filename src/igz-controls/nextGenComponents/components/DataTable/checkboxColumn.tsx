import type { ColumnDef, RowData } from '@tanstack/react-table'

import { Checkbox } from '../ui/checkbox'
import { DATATABLE_TEXT } from '../../constants'

import type { DataTableFeatures } from './dataTableFeatures'

export const createCheckboxColumn = <TData extends RowData>(): ColumnDef<
  DataTableFeatures,
  TData
> => ({
  id: DATATABLE_TEXT.CHECKBOX_COLUMN_ID,
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label={DATATABLE_TEXT.SELECT_ALL}
      data-testid="data-table-select-all-checkbox"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
      aria-label={DATATABLE_TEXT.SELECT_ROW}
      data-testid={`data-table-row-checkbox-${row.id}`}
    />
  ),
  enableSorting: false,
  enableHiding: false
})

export default createCheckboxColumn

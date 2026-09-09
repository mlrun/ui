'use no memo'

import { useTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { RowData, TableOptions } from '@tanstack/react-table'

import { dataTableFeatures, type DataTableFeatures } from './dataTableFeatures'

export const useDataTable = <TData extends RowData>(
  options: Omit<TableOptions<DataTableFeatures, TData>, 'features'>
) => useTable({ ...options, features: dataTableFeatures })

export { useVirtualizer }

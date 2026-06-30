import type { Column } from '@tanstack/react-table'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import { DATATABLE_TEXT } from '@igz-controls/constants'

export const getColumnWidthCalculator = <TData>(columns: Column<TData, unknown>[]) => {
  const dataColumns = columns.filter(col => col.id !== DATATABLE_TEXT.CHECKBOX_COLUMN_ID)
  const totalSize = dataColumns.reduce((sum, col) => sum + col.getSize(), 0)
  return (size: number) => `${(size / totalSize) * 100}%`
}

export const getColumnSize = (
  isCheckbox: boolean,
  isFirstData: boolean,
  size: number,
  getColumnWidth: (size: number) => string
) => {
  if (isCheckbox) return { width: '48px' }
  if (!isFirstData) return { width: getColumnWidth(size) }
  return undefined
}

export const getVirtualPadding = (
  virtualRows: VirtualItem[],
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
) => {
  const top = virtualRows.length > 0 ? virtualRows[0].start : 0
  const bottom =
    virtualRows.length > 0 ? rowVirtualizer.getTotalSize() - virtualRows.at(-1)!.end : 0
  return { top, bottom }
}

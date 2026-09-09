'use no memo'

import {
  flexRender,
  type ColumnDef,
  type OnChangeFn,
  type RowData,
  type RowSelectionState,
  type SortingState
} from '@tanstack/react-table'
import { ComponentType, ReactNode, useRef, useMemo } from 'react'

import SortArrow from '../../../images/sort-arrow.svg?react'
import DetailsPanel from '../DetailsPanel'
import EllipsisTooltip from '../EllipsisTooltip'
import PaginationControls, { PaginationConfig } from '../PaginationControls'
import { RowActions, ActionMenuItem } from '../RowActions'
import {
  DATATABLE_TEXT,
  ESTIMATED_ROW_HEIGHT,
  NO_ROWS_MESSAGES,
  SORT_DIRECTION
} from '../../constants'
import { useClickOutside } from '../../hooks/useClickOutside'
import { cn } from '../../lib/utils'

import createCheckboxColumn from './checkboxColumn'
import { type DataTableFeatures } from './dataTableFeatures'
import { getColumnSize, getColumnWidthCalculator, getVirtualPadding } from './DataTable.utils'
import { useDataTable, useVirtualizer } from './useDataTable'

export type DetailsPanelConfig<TData extends RowData> = {
  content: ComponentType<TData>
  titleAccessorKey?: keyof TData
  titleAccessorFn?: (row: TData) => string | ReactNode
  selectedRow?: TData
  onRowSelect?: (row: TData) => void
  onRowClose?: () => void
}

export type CheckboxSelectionConfig = {
  rowSelection: RowSelectionState
  onRowSelectionChange: (state: RowSelectionState) => void
}

export type DataTableProps<TData extends RowData> = {
  className?: string
  data: TData[]
  columns: ColumnDef<DataTableFeatures, TData>[]
  initialSorting?: SortingState
  pagination?: PaginationConfig
  rowActions?: (row: TData) => ActionMenuItem[]
  detailsPanel?: DetailsPanelConfig<TData>
  checkboxSelection?: CheckboxSelectionConfig
}

const DataTable = <TData extends RowData>({
  className,
  data,
  columns,
  initialSorting = [],
  pagination,
  rowActions,
  detailsPanel,
  checkboxSelection
}: Readonly<DataTableProps<TData>>) => {
  const { selectedRow, onRowSelect, onRowClose } = detailsPanel ?? {}
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useClickOutside(selectedRow ? onRowClose : undefined)

  const detailsPanelSelection = useMemo((): RowSelectionState => {
    if (!selectedRow) return {}
    const index = data.indexOf(selectedRow)
    return index >= 0 ? { [String(index)]: true } : {}
  }, [selectedRow, data])

  const rowSelection: RowSelectionState = checkboxSelection
    ? checkboxSelection.rowSelection
    : detailsPanelSelection

  const allColumns = useMemo((): ColumnDef<DataTableFeatures, TData>[] => {
    return checkboxSelection ? [createCheckboxColumn<TData>(), ...columns] : columns
  }, [checkboxSelection, columns])

  const table = useDataTable<TData>({
    data,
    columns: allColumns,
    defaultColumn: {
      size: 1,
      minSize: 0
    },
    state: {
      rowSelection
    },
    onRowSelectionChange: (updaterOrValue => {
      if (!checkboxSelection) return
      const newSelection =
        typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue
      checkboxSelection.onRowSelectionChange(newSelection)
    }) satisfies OnChangeFn<RowSelectionState>,
    enableRowSelection: true,
    enableMultiRowSelection: !!checkboxSelection,
    enableSorting: true,
    enableSortingRemoval: false,
    initialState: {
      sorting: initialSorting
    }
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  const selected =
    selectedRow ?? table.getRowModel().flatRows.find(r => r.getIsSelected())?.original

  const visibleColumns = table.getVisibleLeafColumns()
  const getColumnWidth = useMemo(() => getColumnWidthCalculator(visibleColumns), [visibleColumns])

  const totalColSpan = allColumns.length + (rowActions ? 1 : 0)
  const { top: topPadding, bottom: bottomPadding } = getVirtualPadding(virtualRows, rowVirtualizer)

  return (
    <>
      <div
        data-testid="data-table-wrapper"
        ref={wrapperRef}
        className="flex flex-col relative flex-grow min-h-0"
      >
        <div
          ref={tableContainerRef}
          className={cn('overflow-auto rounded-lg border border-solid border-border', className)}
        >
          <table className="w-full border-collapse table-fixed">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr
                  key={headerGroup.id}
                  className="sticky top-0 z-10 border border-solid border-border bg-white shadow-[0_1px_0_0_#eee]"
                  data-testid="data-table-header-row"
                >
                  {headerGroup.headers.map((header, headerIndex) => {
                    const isCheckboxColumn = header.column.id === DATATABLE_TEXT.CHECKBOX_COLUMN_ID
                    const isFirstDataColumn = checkboxSelection
                      ? headerIndex === 1
                      : headerIndex === 0
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={getColumnSize(
                          isCheckboxColumn,
                          isFirstDataColumn,
                          header.column.getSize(),
                          getColumnWidth
                        )}
                        className={cn(
                          'relative px-4 py-2 text-left text-[15px] leading-6 text-[#7F7989] border-b border-[#eee] whitespace-nowrap',
                          isFirstDataColumn && 'w-[250px] pr-[10px]',
                          isCheckboxColumn && 'w-12 px-3'
                        )}
                        data-testid={`data-table-header-${typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : header.column.id}`}
                      >
                        {!header.isPlaceholder &&
                          (isCheckboxColumn ? (
                            flexRender(header.column.columnDef.header, header.getContext())
                          ) : (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              disabled={!header.column.getCanSort()}
                              className={cn(
                                'inline-flex items-center gap-2 w-full bg-transparent border-0 py-1 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b9d4ff] focus-visible:outline-offset-2 rounded disabled:cursor-default font-normal',
                                header.column.getIsSorted() && 'font-bold'
                              )}
                              data-testid={`data-table-header-button-${header.column.columnDef.header}`}
                            >
                              <EllipsisTooltip className="w-fit">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </EllipsisTooltip>

                              {header.column.getCanSort() && (
                                <span className="w-2 h-2 shrink-0 flex items-center justify-center">
                                  <SortArrow
                                    aria-hidden="true"
                                    className={cn(
                                      'w-full h-full transition-transform duration-150 ease-in-out',
                                      header.column.getIsSorted() === SORT_DIRECTION.ASC &&
                                        'rotate-180 opacity-100',
                                      header.column.getIsSorted() === SORT_DIRECTION.DESC &&
                                        'rotate-0 opacity-100',
                                      !header.column.getIsSorted() && 'opacity-40'
                                    )}
                                  />
                                </span>
                              )}
                            </button>
                          ))}
                      </th>
                    )
                  })}
                  {rowActions && (
                    <th
                      className="w-12 p-0 border-b border-[#eee]"
                      data-testid="data-table-header-actions"
                    />
                  )}
                </tr>
              ))}
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={totalColSpan}
                    className="h-40 text-center text-[15px] text-[#4B4760]"
                    data-testid="data-table-empty-state"
                  >
                    {NO_ROWS_MESSAGES}
                  </td>
                </tr>
              ) : (
                <>
                  {topPadding > 0 && (
                    <tr>
                      <td colSpan={totalColSpan} style={{ height: topPadding, padding: 0 }} />
                    </tr>
                  )}
                  {virtualRows.map(virtualRow => {
                    const row = rows[virtualRow.index]
                    return (
                      <tr
                        key={row.id}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        className={cn(
                          'group hover:bg-igz-accent-hover h-12 border-solid border-0 border-b border-border last:border-none',
                          detailsPanel && 'cursor-pointer',
                          row.getIsSelected() && 'bg-[#f2f7ff]'
                        )}
                        data-testid={`data-table-row-${row.id}`}
                      >
                        {row.getVisibleCells().map((cell, idx) => {
                          const isCheckboxColumn =
                            cell.column.id === DATATABLE_TEXT.CHECKBOX_COLUMN_ID
                          const isFirstDataColumn = checkboxSelection ? idx === 1 : idx === 0
                          const columnMeta = cell.column.columnDef.meta as
                            { skipEllipsisTooltip?: boolean; tdClassName?: string } | undefined
                          const skipEllipsisTooltip = Boolean(columnMeta?.skipEllipsisTooltip)
                          const renderedCell = flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                          const wrapCellWithEllipsis = !isCheckboxColumn && !skipEllipsisTooltip
                          const cellContent = wrapCellWithEllipsis ? (
                            <EllipsisTooltip>{renderedCell}</EllipsisTooltip>
                          ) : (
                            renderedCell
                          )
                          return (
                            <td
                              key={cell.id}
                              onClick={
                                !isCheckboxColumn && onRowSelect
                                  ? () => onRowSelect(row.original)
                                  : undefined
                              }
                              style={getColumnSize(
                                isCheckboxColumn,
                                isFirstDataColumn,
                                cell.column.getSize(),
                                getColumnWidth
                              )}
                              className={cn(
                                'relative px-4 py-2 text-left text-[#4B4760] text-[15px] font-normal',
                                skipEllipsisTooltip ? 'min-w-0' : 'truncate',
                                isFirstDataColumn && 'w-[250px] pr-[10px]',
                                isCheckboxColumn && 'w-12 px-3',
                                columnMeta?.tdClassName
                              )}
                              data-testid={`data-table-cell-${row.id}`}
                            >
                              {cellContent}
                            </td>
                          )
                        })}
                        {rowActions && (
                          <td
                            className="relative px-1"
                            data-testid={`data-table-actions-cell-${row.id}`}
                            onClick={e => e.stopPropagation()}
                          >
                            <RowActions actions={rowActions(row.original)} />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                  {bottomPadding > 0 && (
                    <tr>
                      <td colSpan={totalColSpan} style={{ height: bottomPadding, padding: 0 }} />
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {selected && detailsPanel && (
          <DetailsPanel row={selected} {...detailsPanel} onClose={() => onRowClose?.()} />
        )}
      </div>

      {pagination && <PaginationControls {...pagination} />}
    </>
  )
}

export default DataTable

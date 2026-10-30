import type {
  RowSelectionState,
  SortingState,
  ColumnSizingState,
  ColumnFiltersState
} from '@tanstack/react-table'
import { create } from 'zustand'

export type DraftValues = Record<string, string | string[]>

export type FilterPopoverState = {
  open: boolean
  draft: DraftValues
}

export const DEFAULT_FILTER_SCOPE = 'default'

const emptyPopoverState: FilterPopoverState = { open: false, draft: {} }

type TableState = {
  rowSelection: RowSelectionState
  sorting: SortingState
  columnSizing: ColumnSizingState
  globalFilter: string
  columnFilters: ColumnFiltersState

  filterPopovers: Record<string, FilterPopoverState>

  setRowSelection: (
    selection: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void
  setSorting: (sorting: SortingState | ((old: SortingState) => SortingState)) => void
  setColumnSizing: (
    sizing: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState)
  ) => void
  setGlobalFilter: (value: string | ((old: string) => string)) => void
  setColumnFilters: (
    value: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void

  getFilterPopover: (scopeId: string) => FilterPopoverState
  setFilterPopoverOpen: (scopeId: string, open: boolean) => void
  setFilterDraft: (
    scopeId: string,
    draft: DraftValues | ((old: DraftValues) => DraftValues)
  ) => void
  resetFilterDraft: (scopeId: string, initial: DraftValues) => void
}

export const selectFilterPopover =
  (scopeId: string) =>
  (state: TableState): FilterPopoverState =>
    state.filterPopovers[scopeId] ?? emptyPopoverState

export const useTableStore = create<TableState>((set, get) => ({
  rowSelection: {},
  sorting: [],
  columnSizing: {},
  globalFilter: '',
  columnFilters: [],

  filterPopovers: {},

  setRowSelection: selection =>
    set(old => ({
      rowSelection: typeof selection === 'function' ? selection(old.rowSelection) : selection
    })),

  setSorting: sorting =>
    set(old => ({
      sorting: typeof sorting === 'function' ? sorting(old.sorting) : sorting
    })),

  setColumnSizing: sizing =>
    set(old => ({
      columnSizing: typeof sizing === 'function' ? sizing(old.columnSizing) : sizing
    })),

  setGlobalFilter: value =>
    set(old => ({
      globalFilter: typeof value === 'function' ? value(old.globalFilter) : value
    })),

  setColumnFilters: value =>
    set(old => ({
      columnFilters: typeof value === 'function' ? value(old.columnFilters) : value
    })),

  getFilterPopover: (scopeId: string) => get().filterPopovers[scopeId] ?? emptyPopoverState,

  setFilterPopoverOpen: (scopeId, open) =>
    set(old => {
      const prev = old.filterPopovers[scopeId] ?? emptyPopoverState
      return {
        filterPopovers: {
          ...old.filterPopovers,
          [scopeId]: { ...prev, open }
        }
      }
    }),

  setFilterDraft: (scopeId, draft) =>
    set(old => {
      const prev = old.filterPopovers[scopeId] ?? emptyPopoverState
      const nextDraft = typeof draft === 'function' ? draft(prev.draft) : draft
      return {
        filterPopovers: {
          ...old.filterPopovers,
          [scopeId]: { ...prev, draft: nextDraft }
        }
      }
    }),

  resetFilterDraft: (scopeId, initial) =>
    set(old => {
      const prev = old.filterPopovers[scopeId] ?? emptyPopoverState
      return {
        filterPopovers: {
          ...old.filterPopovers,
          [scopeId]: { ...prev, draft: initial }
        }
      }
    })
}))

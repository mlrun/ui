import { useMemo } from 'react'

import ActiveFilter from '../../../images/activeFilter.svg?react'
import Filter from '../../../images/filter-2.svg?react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../ui/select'
import { FILTER_POPOVER_DEFAULT_TITLE, FILTER_BUTTON_CLEAR, FILTER_BUTTON_APPLY } from '../../constants'
import { useTableStore, selectFilterPopover, DEFAULT_FILTER_SCOPE } from '../../stores/tableStore'
import type { FilterFieldDef, FilterSchema, FilterValues } from '../../types/table/filter'
import { buildInitialFromSchema, hasActiveFilters, objectValues } from '../../utils/tableFilters.utils'
import MultiSelectField from '../MultiSelectField'

type Props<K extends string> = {
  schema: FilterSchema<K>
  title?: string
  scopeId?: string
  onApply?: (vals?: FilterValues<K>) => void
  onClear?: () => void
}

const FilterPopover = <K extends string>({
  schema,
  title = FILTER_POPOVER_DEFAULT_TITLE,
  scopeId = DEFAULT_FILTER_SCOPE,
  onApply,
  onClear
}: Readonly<Props<K>>) => {
  const { setFilterPopoverOpen, setFilterDraft, resetFilterDraft } = useTableStore()
  const { open: filterPopoverOpen, draft: filterDraft } = useTableStore(
    selectFilterPopover(scopeId)
  )
  const isFilterActive = useMemo(() => hasActiveFilters(schema), [schema])

  const handleOpenChange = (next: boolean) => {
    if (next) {
      const initial = buildInitialFromSchema(schema)
      resetFilterDraft(scopeId, initial)
    }
    setFilterPopoverOpen(scopeId, next)
  }

  const reset = () => {
    resetFilterDraft(scopeId, {})
    onClear?.()
    setFilterPopoverOpen(scopeId, false)
  }

  const apply = () => {
    onApply?.(filterDraft as FilterValues<K>)
    setFilterPopoverOpen(scopeId, false)
  }

  return (
    <Popover open={filterPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="rounded"
          size="icon"
          aria-label={title}
          data-testid="filter-popover-button"
        >
          {isFilterActive ? <ActiveFilter className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={6}
        avoidCollisions={true}
        collisionPadding={8}
        className="flex flex-col w-[300px] max-h-[400px] rounded-md border bg-background p-0 shadow-md z-40"
      >
        <div className="p-4">
          <h3 className="font-medium m-0 text-xl" data-testid="filter-popover-title">
            {title}
          </h3>
        </div>

        <ScrollArea className="px-4 overflow-y-auto">
          <div className="space-y-4 pb-2">
            {objectValues(schema as Record<string, FilterFieldDef<K>>).map(filterField => {
              const value = filterDraft[filterField.key]

              return (
                <div
                  key={filterField.key}
                  className="min-w-0"
                  data-testid={`filter-popover-field-${filterField.key}`}
                >
                  <div
                    className="mb-1 text-[#7F7989] text-xs font-normal leading-none"
                    data-testid={`filter-popover-field-label-${filterField.key}`}
                  >
                    {filterField.label}
                  </div>

                  {filterField.kind === 'text' && (
                    <Input
                      placeholder={filterField.placeholder}
                      value={(value as string | undefined) ?? ''}
                      disabled={filterField.disabled}
                      className="h-10 w-full px-4 text-[15px] font-normal placeholder-[#C4C2C8]"
                      onChange={e =>
                        setFilterDraft(scopeId, prev => ({
                          ...prev,
                          [filterField.key]: e.target.value
                        }))
                      }
                      data-testid={`filter-popover-input-${filterField.label}`}
                    />
                  )}

                  {filterField.kind === 'select' && (
                    <Select
                      value={(value as string | undefined) ?? ''}
                      onValueChange={value =>
                        setFilterDraft(scopeId, prev => ({
                          ...prev,
                          [filterField.key]: value
                        }))
                      }
                      disabled={filterField.disabled}
                    >
                      <SelectTrigger
                        className="h-10 w-full min-w-0 px-4 data-[placeholder]:text-[#C4C2C8] rounded-md border border-black/20 text-[15px]"
                        data-testid={`filter-popover-select-${filterField.key}`}
                      >
                        <SelectValue placeholder={filterField.placeholder} />
                      </SelectTrigger>
                      <SelectContent className="text-sm">
                        {(filterField.options ?? []).map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-sm data-[highlighted]:bg-igz-accent-hover"
                            data-testid={`filter-popover-select-option-${filterField.key}-${option.value}`}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filterField.kind === 'multi-select' && (
                    <MultiSelectField
                      filterField={filterField}
                      value={value}
                      setFilterDraft={draft => setFilterDraft(scopeId, draft)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 p-3">
          <Button
            variant="secondary"
            className="h-9 w-[100px] px-3 text-[14px]"
            onClick={reset}
            data-testid="filter-popover-clear-button"
          >
            {FILTER_BUTTON_CLEAR}
          </Button>
          <Button
            className="h-9 w-[100px] px-3 text-[14px]"
            onClick={apply}
            data-testid="filter-popover-apply-button"
          >
            {FILTER_BUTTON_APPLY}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopover

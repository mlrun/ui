import type { DraftValues } from '@igz-controls/stores/tableStore'
import type { FilterFieldDef, FilterSchema } from '@igz-controls/types/table/filter'

const objectValues = <T extends Record<string, unknown>>(obj: T) => {
  return Object.values(obj) as Array<T[keyof T]>
}

const buildInitialFromSchema = <K extends string>(schema: FilterSchema<K>): DraftValues => {
  const fields = objectValues(schema) as FilterFieldDef<K>[]
  return fields.reduce<DraftValues>((acc, f) => {
    acc[f.key] = f.defaultValue ?? (f.kind === 'multi-select' ? [] : '')
    return acc
  }, {})
}

const isActiveValue = (val: string | string[] | undefined): boolean => {
  if (val === undefined || val === '' || val === 'all') return false
  if (Array.isArray(val)) return val.length > 0 && !(val.length === 1 && val[0] === 'all')
  return true
}

const hasActiveFilters = <K extends string>(schema: FilterSchema<K>): boolean => {
  const fields = objectValues(schema) as FilterFieldDef<K>[]
  return fields.some(field => isActiveValue(field.defaultValue))
}

export { objectValues, buildInitialFromSchema, hasActiveFilters }

export type FieldKind = 'text' | 'select' | 'multi-select' | 'number' | 'date'

export type Option = {
  readonly label: string
  readonly value: string
  meta?: Record<string, unknown>
}

export type FilterFieldDef<K extends string = string> = {
  key: K
  label: string
  kind: FieldKind
  placeholder?: string
  options?: Option[]
  defaultValue?: string | string[]
  disabled?: boolean
  required?: boolean
  resolveValue?: (next: string[], prev: string[]) => string[]
  computeDisabled?: (optValue: string, currentValues: string[]) => boolean
}

export type FilterSchema<K extends string> = Record<K, FilterFieldDef<K>>

export type FilterValues<K extends string> = Partial<Record<K, string | string[]>>

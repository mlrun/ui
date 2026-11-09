export const isMaskComplete = (value: string, placeholderChar = '_'): boolean =>
  value.length > 0 && !value.includes(placeholderChar)

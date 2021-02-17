export const parseKeyValues = (object = {}) =>
  object == null
    ? []
    : Object.entries(object).map(([key, value]) => `${key}: ${value}`)

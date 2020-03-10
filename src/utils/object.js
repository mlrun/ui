export const parseKeyValues = (object = {}) =>
  Object.entries(object).map(([key, value]) => `${key}: ${value}`)

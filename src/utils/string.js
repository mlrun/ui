export const truncateUid = (value = '') =>
  value.length > 7 ? '...' + value.slice(-7) : value

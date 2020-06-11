export const emptyObjectValues = obj =>
  !Object.values(obj).filter(item => item.length).length

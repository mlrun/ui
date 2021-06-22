export const isEveryObjectValueEmpty = obj =>
  Object.values(obj).every(item => !item || item.length === 0)

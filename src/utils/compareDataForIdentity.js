export const compareDataForIdentity = (firstItem, secondItem) => {
  return !firstItem || !secondItem ? false : firstItem === secondItem
}

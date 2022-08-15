export const convertChipsData = chips => {
  return chips.reduce((list, label) => {
    list[label.key] = label.value

    return list
  }, {})
}

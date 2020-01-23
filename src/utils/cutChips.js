export const cutChips = (chips, maxLength, onclick) => {
  if (chips.length > maxLength) {
    let hiddenChipsNumber = `+ ${chips.length - maxLength}`
    const hiddenChips = chips.slice(maxLength).map(value => ({ value: value }))
    const sortedArr = chips.slice(0, maxLength).map(value => ({ value: value }))
    sortedArr.push({
      value: hiddenChipsNumber,
      onClick: onclick
    })
    return {
      sortedArr,
      hiddenChips
    }
  }
  return {
    sortedArr: chips.map(value => ({ value: value }))
  }
}

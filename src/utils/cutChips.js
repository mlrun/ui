export const cutChips = (chips, maxLength) => {
  if (chips.length > maxLength) {
    let hiddenChipsNumber = `+ ${chips.length - maxLength}`
    const hiddenChips = chips.slice(maxLength)
    const sortedArr = chips.slice(0, maxLength)
    sortedArr.push(hiddenChipsNumber)
    return {
      sortedArr,
      hiddenChips
    }
  }
  return {
    sortedArr: chips
  }
}

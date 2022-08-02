export const cutChips = (chips = [], maxLength, delimiter) => {
  if (chips.length > maxLength) {
    let hiddenChipsNumber = `+ ${chips.length - maxLength}`
    const hiddenChips = chips
      .slice(maxLength)
      .map(value => ({ value, delimiter }))
    const visibleChips = chips
      .slice(0, maxLength)
      .map(value => ({ value, delimiter }))
    visibleChips.push({
      value: hiddenChipsNumber,
      delimiter
    })

    return {
      visibleChips,
      hiddenChips
    }
  }
  return {
    visibleChips: chips.map(value => ({ value, delimiter }))
  }
}

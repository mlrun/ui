export const cutChips = (chips = [], maxLength) => {
  if (chips.length > maxLength) {
    let hiddenChipsNumber = `+ ${chips.length - maxLength}`
    const hiddenChips = chips.slice(maxLength).map(value => ({ value }))
    const visibleChips = chips.slice(0, maxLength).map(value => ({ value }))
    visibleChips.push({
      value: hiddenChipsNumber
    })
    return {
      visibleChips,
      hiddenChips
    }
  }
  return {
    visibleChips: chips.map(value => ({ value }))
  }
}

export const expandRow = (e, item, expandedItems) => {
  const parentRow = e.target.closest('.parent-row')

  if (parentRow.classList.contains('parent-row-expanded')) {
    const newArray = expandedItems.filter(
      expanded => expanded.name.value !== item.name.value
    )

    parentRow.classList.remove('parent-row-expanded')

    return newArray
  } else {
    parentRow.classList.remove('active')
    parentRow.classList.add('parent-row-expanded')

    return [...expandedItems, item]
  }
}

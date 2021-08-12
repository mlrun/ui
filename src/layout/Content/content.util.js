export const generateGroupedItems = (
  content,
  selectedRowData,
  getIdentifier
) => {
  const groupedItems = {}

  content.forEach(contentItem => {
    const identifier = getIdentifier(contentItem)

    if (selectedRowData?.[identifier]?.content) {
      groupedItems[identifier] = selectedRowData[identifier]?.content
    } else {
      groupedItems[identifier] ??= []
      groupedItems[identifier].push(contentItem)
    }
  })

  return groupedItems
}

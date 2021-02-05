export const generateGroupedItems = (content, selectedRowData) => {
  const groupedItems = {}

  content.forEach(contentItem => {
    if (selectedRowData?.[contentItem.name]?.content) {
      groupedItems[contentItem.name] =
        selectedRowData[contentItem.name]?.content
    } else if (
      selectedRowData?.[`${contentItem.name}-${contentItem.metadata?.name}`]
        ?.content
    ) {
      groupedItems[`${contentItem.name}-${contentItem.metadata.name}`] =
        selectedRowData[
          `${contentItem.name}-${contentItem.metadata.name}`
        ]?.content
    } else if (contentItem.metadata) {
      groupedItems[`${contentItem.name}-${contentItem.metadata.name}`]
        ? groupedItems[`${contentItem.name}-${contentItem.metadata.name}`].push(
            contentItem
          )
        : (groupedItems[`${contentItem.name}-${contentItem.metadata.name}`] = [
            contentItem
          ])
    } else {
      groupedItems[contentItem.name]
        ? groupedItems[contentItem.name].push(contentItem)
        : (groupedItems[contentItem.name] = [contentItem])
    }
  })

  return groupedItems
}

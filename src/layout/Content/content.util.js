export const generateGroupedItems = (
  content,
  selectedRowData,
  getIdentifier,
  pageTab
) => {
  const groupedItems = {}

  content.forEach(contentItem => {
    const identifier = getIdentifier(contentItem, false, pageTab)

    if (selectedRowData?.[identifier]?.content) {
      groupedItems[identifier] = selectedRowData[identifier]?.content
    } else {
      groupedItems[identifier] ??= []
      groupedItems[identifier].push(contentItem)
    }
  })

  return groupedItems
}

export const generateContentActionsMenu = (actionsMenu, predefinedActions) => {
  return typeof actionsMenu === 'function'
    ? item => [...predefinedActions, ...(actionsMenu(item) ?? [])]
    : [...predefinedActions, ...(actionsMenu ?? [])]
}

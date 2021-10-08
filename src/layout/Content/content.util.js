import { MODEL_ENDPOINTS_TAB } from '../../constants'

export const generateGroupedItems = (
  content,
  selectedRowData,
  getIdentifier,
  match
) => {
  const groupedItems = {}

  content.forEach(contentItem => {
    const identifier =
      match.params.pageTab !== MODEL_ENDPOINTS_TAB
        ? getIdentifier(contentItem)
        : contentItem?.spec?.function_uri

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

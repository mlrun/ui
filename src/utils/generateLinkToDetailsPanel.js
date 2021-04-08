export const generateLinkToDetailsPanel = (
  project,
  screen,
  tab,
  key,
  version,
  detailsTab
) =>
  `/projects/${project}/${screen.toLowerCase()}${tab ? `/${tab}` : ''}/${key}${
    version ? `/${version}` : ''
  }/${detailsTab.toLowerCase()}`

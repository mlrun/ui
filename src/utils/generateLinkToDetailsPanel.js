export const generateLinkToDetailsPanel = (
  project,
  screen,
  tab,
  key,
  version,
  detailsTab,
  uid
) =>
  `/projects/${project}/${screen.toLowerCase()}${tab ? `/${tab}` : ''}/${key}${
    version ? `/${version}` : uid ? `/${uid}` : ''
  }/${detailsTab.toLowerCase()}`

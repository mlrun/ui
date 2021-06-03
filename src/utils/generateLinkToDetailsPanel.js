export const generateLinkToDetailsPanel = (
  project,
  screen,
  tab,
  key,
  version,
  detailsTab,
  uid,
  iter
) =>
  `/projects/${project}/${screen.toLowerCase()}${tab ? `/${tab}` : ''}/${key}${
    version ? `/${version}` : uid ? `/${uid}` : ''
  }${iter ? `/${iter}` : ''}/${detailsTab.toLowerCase()}`

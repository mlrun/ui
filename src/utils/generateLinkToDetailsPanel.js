export const generateLinkToDetailsPanel = (
  project,
  screen,
  tab,
  key,
  version,
  detailsTab,
  uid,
  iter,
  itemName
) =>
  `/projects/${project}/${screen.toLowerCase()}${tab ? `/${tab}` : ''}${
    itemName ? `/${itemName}` : ''
  }/${key}${version ? `/${version}` : uid ? `/${uid}` : ''}${
    isNaN(parseInt(iter)) ? '' : `/${iter}`
  }/${detailsTab.toLowerCase()}`

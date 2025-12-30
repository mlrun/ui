export const toTestId = (title, suffix = '') => {
  const formattedTitle = title.replace(/\s+/g, '-').toLowerCase()
  return suffix ? formattedTitle + '-' + suffix : formattedTitle
}

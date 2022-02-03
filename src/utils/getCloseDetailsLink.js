export const getCloseDetailsLink = (match, paramName) => {
  return match.url
    .split('/')
    .splice(0, match.path.split('/').indexOf(`:${paramName}`) + 1)
    .join('/')
}

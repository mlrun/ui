export const getCloseDetailsLink = (location, paramName) => {
  return location.pathname
    .split('/')
    .splice(0, location.pathname.split('/').indexOf(paramName) + 1)
    .join('/')
}

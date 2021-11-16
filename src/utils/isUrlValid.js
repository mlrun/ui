export const isUrlValid = (match, tabs, history) => {
  if (!tabs.includes(match.params.pageTab)) {
    const newUrlArray = match.url.split('/')
    newUrlArray[newUrlArray.length - 1] = tabs[0]
    const newUrl = newUrlArray.join('/')

    history.replace(newUrl)
  }
}

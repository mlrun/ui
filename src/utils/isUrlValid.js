export const isUrlValid = (match, tabs, history) => {
  if (!tabs.includes(match.params.pageTab)) {
    // Change invalid "tab" part of the link to a valid one
    history.replace([...match.url.split('/').slice(0, -1), tabs[0]].join('/'))
  }
}

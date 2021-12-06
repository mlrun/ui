import { capitalize } from 'lodash'

export const resultsTable = array => {
  let headers = (array.iterationStats ? array.iterationStats[0] ?? [] : []).map(
    item => {
      return capitalize(String(item).replace(/^.+\./, ''))
    }
  )
  const changedHeaders = [headers[1], headers[0]]
  headers = changedHeaders.concat(headers.slice(2))
  const tableContent = (array.iterationStats ?? [])
    .slice(1)
    .map(contentItem => {
      return [contentItem[1], contentItem[0]].concat(contentItem.slice(2))
    })

  return {
    headers,
    tableContent
  }
}

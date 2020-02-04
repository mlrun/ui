import { capitalize } from 'lodash'

export const resultsTable = array => {
  let headers = (array.iterationStats[0] || []).map(item => {
    let head = capitalize(String(item).replace(/^.+\./, ''))
    return head
  })
  const changedHeaders = [headers[1], headers[0]]
  headers = changedHeaders.concat(headers.slice(2))
  let items = array.iterationStats.slice(1)
  items = items.map(item => {
    const changedItems = [item[1], item[0]]
    return changedItems.concat(item.slice(2))
  })

  return {
    headers: headers,
    items: items
  }
}

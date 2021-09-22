import { DETAILS_OVERVIEW_TAB } from '../constants'

export const isDetailsTabExists = (page, match, tabsList, history) => {
  if (!tabsList.find(el => el.id === match.params.tab && !el.hidden)) {
    const newUrlArray = match.url.split('/')
    newUrlArray[newUrlArray.length - 1] = DETAILS_OVERVIEW_TAB
    const newUrl = newUrlArray.join('/')

    history.replace(newUrl)
  }
}

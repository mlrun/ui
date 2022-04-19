import { DETAILS_OVERVIEW_TAB } from '../constants'

export const isDetailsTabExists = (page, params, tabsList, navigate, location) => {
  if (!tabsList.find(el => el.id === params.tab && !el.hidden)) {
    const newUrlArray = location.pathname.split('/')
    newUrlArray[newUrlArray.length - 1] = DETAILS_OVERVIEW_TAB
    const newUrl = newUrlArray.join('/')

    navigate(newUrl, { replace: true })
  }
}

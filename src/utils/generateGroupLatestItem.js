import {
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  FUNCTIONS_PAGE,
  JOBS_PAGE
} from '../constants'

export const generateGroupLatestItem = (page, tableContent, pageTab) =>
  tableContent?.map(group =>
    Array.isArray(group) && [FUNCTIONS_PAGE, JOBS_PAGE].includes(page)
      ? group.reduce((prev, curr) => {
          const prevDate = new Date(prev.updated?.value)
          const currDate = new Date(curr.updated?.value)

          // if either dates is invalid - return the other one
          // if both are valid - return the later one
          return isNaN(prevDate)
            ? curr
            : isNaN(currDate)
            ? prev
            : prevDate.getTime() > currDate.getTime()
            ? prev
            : curr
        })
      : Array.isArray(group) &&
        [FEATURE_STORE_PAGE].includes(page) &&
        ![FEATURES_TAB].includes(pageTab)
      ? group.find(groupItem => groupItem.version?.value === 'latest') ??
        group[0]
      : group[0]
  )

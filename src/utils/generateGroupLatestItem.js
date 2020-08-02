import { FUNCTIONS_PAGE, JOBS_PAGE } from '../constants'

export const generateGroupLatestItem = (page, tableContent) =>
  tableContent?.map(group =>
    Array.isArray(group) && [FUNCTIONS_PAGE, JOBS_PAGE].includes(page)
      ? group.reduce((prev, curr) => {
          const prevDate = new Date(prev.updated.value)
          const currDate = new Date(curr.updated.value)

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
      : group
  )

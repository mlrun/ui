import { JOBS_PAGE } from '../constants'

export const generateGroupLatestItem = (page, tableContent) => {
  return tableContent?.map(group => {
    if (Array.isArray(group)) {
      return page === JOBS_PAGE
        ? group.reduce((prev, curr) => {
            return new Date(prev.updated.value).getTime() >
              new Date(curr.updated.value).getTime()
              ? prev
              : curr
          })
        : group.find((func, i, arr) => {
            if (arr.length === 1) return func
            return func.tag.value === 'latest'
          })
    } else return group
  })
}

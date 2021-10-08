import {
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MODEL_ENDPOINTS_TAB
} from '../constants'

export const generateGroupLatestItem = (page, tableContent, pageTab) =>
  tableContent?.map(group =>
    Array.isArray(group) &&
    ([FUNCTIONS_PAGE, JOBS_PAGE].includes(page) ||
      pageTab === MODEL_ENDPOINTS_TAB)
      ? getLatestItem(group, pageTab)
      : Array.isArray(group) &&
        [FEATURE_STORE_PAGE].includes(page) &&
        ![FEATURES_TAB].includes(pageTab)
      ? group.find(groupItem => groupItem.version?.value === 'latest') ??
        group[0]
      : group[0]
  )

const getLatestItem = (group, pageTab) => {
  const latestItem = group.reduce((prev, curr) => {
    const datePath = pageTab === MODEL_ENDPOINTS_TAB ? 'lastRequest' : 'updated'
    const prevDate = new Date(prev[datePath]?.value)
    const currDate = new Date(curr[datePath]?.value)

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

  if (pageTab === MODEL_ENDPOINTS_TAB) {
    if (
      group.find(element => element.driftStatus.status === 'DRIFT_DETECTED')
    ) {
      latestItem.key.rowExpanded.state = {
        className: 'state-error',
        value: 'error',
        label: 'Drift detected'
      }
    } else if (
      group.find(element => element.driftStatus.status === 'POSSIBLE_DRIFT')
    ) {
      latestItem.key.rowExpanded.state = {
        className: 'state-warn',
        value: 'warn',
        label: 'Possible drift'
      }
    } else {
      latestItem.key.rowExpanded.state = {
        className: 'state-created',
        value: 'created',
        label: 'No drift'
      }
    }
  }

  return latestItem
}

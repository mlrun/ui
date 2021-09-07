import { DETAILS_OVERVIEW_TAB } from '../constants'

export const isDetailsTabExists = (page, params, tabsList, history) => {
  if (!tabsList.find(el => el.id === params.tab && !el.hidden)) {
    history.replace(
      `/projects/${params.projectName}/${page.toLowerCase()}/${
        params.pageTab ? `${params.pageTab}/` : ''
      }${params.jobId ??
        params.hash ??
        `${params.name}/${params.tag}${
          params.iter ? `/${params.iter}` : ''
        }`}/${DETAILS_OVERVIEW_TAB}`
    )
  }
}

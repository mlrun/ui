export const isDetailsTabExists = (page, params, tabsList, history) => {
  if (!tabsList.find(el => el === params.tab)) {
    history.push(
      `/projects/${params.projectName}/${page.toLowerCase()}/${
        params.pageTab
      }/${params.jobId ??
        params.jobId ??
        `${params.name}/${params.tag}`}/overview`
    )
  }
}

import { TAG_FILTER_LATEST } from '../constants'

export const handleArtifactTreeFilterChange = (
  fetchData,
  filters,
  setFilter,
  setContent
) => {
  setContent([])
  fetchData({
    ...filters,
    tag: (filters.tag || TAG_FILTER_LATEST).toLowerCase()
  })
  setFilter({
    name: filters.name,
    labels: filters.labels,
    tag: (filters.tag || TAG_FILTER_LATEST).toLowerCase()
  })
}

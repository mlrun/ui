export const handleArtifactTreeFilterChange = (
  fetchData,
  filters,
  setFilter,
  setContent
) => {
  setContent([])
  fetchData({
    ...filters,
    tag: (filters.tag || 'latest').toLowerCase()
  })
  setFilter({
    name: filters.name,
    labels: filters.labels,
    tag: (filters.tag || 'latest').toLowerCase()
  })
}

export const handleArtifactTreeFilterChange = (
  fetchData,
  filter,
  item,
  project,
  setFilter
) => {
  fetchData({
    tag: (item || 'latest').toLowerCase(),
    project: project,
    labels: filter.labels,
    name: filter.name
  })
  setFilter({
    ...filter,
    tag: item.toLowerCase()
  })
}

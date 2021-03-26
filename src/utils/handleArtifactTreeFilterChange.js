export const handleArtifactTreeFilterChange = (
  fetchData,
  filter,
  item,
  project,
  setFilter,
  setContent
) => {
  setContent([])
  fetchData({
    tag: item.toLowerCase(),
    project: project,
    labels: filter.labels,
    name: filter.name
  })
  setFilter({
    ...filter,
    tag: item.toLowerCase()
  })
}

export const handleArtifactTreeFilterChange = (
  fetchData,
  filter,
  item,
  project,
  setFilter
) => {
  const tagValue = item.toLowerCase() !== 'latest' ? item.toLowerCase() : ''

  fetchData({
    tag: tagValue,
    project: project,
    labels: filter.labels,
    name: filter.name
  })
  setFilter({
    ...filter,
    tag: tagValue || 'latest'
  })
}

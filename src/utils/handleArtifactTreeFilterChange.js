export const handleArtifactTreeFilterChange = (
  fetchData,
  item,
  setFilter,
  setContent
) => {
  setContent([])
  fetchData({
    ...item,
    tag: (item.tag || 'latest').toLowerCase()
  })
  setFilter({
    name: item.name,
    labels: item.labels,
    tag: (item.tag || 'latest').toLowerCase()
  })
}

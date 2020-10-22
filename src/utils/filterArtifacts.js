export const filterArtifacts = artifacts =>
  Object.values(
    artifacts.reduce((prev, curr) => {
      if (!prev[curr.db_key]) prev[curr.db_key] = { key: curr.db_key, data: [] }

      if ('link_iteration' in curr) {
        prev[curr.db_key] = Object.assign(prev[curr.db_key], {
          link_iteration: curr
        })
      } else {
        prev[curr.db_key].data.push(curr)
      }
      return prev
    }, {})
  )

export const searchArtifactItem = (artifacts, name, tag, iter) =>
  artifacts.find(item =>
    iter
      ? item.db_key === name &&
        (item.tag === tag || item.tree === tag) &&
        Number(iter) === item.iter
      : item.db_key === name && (item.tag === tag || item.tree === tag)
  )

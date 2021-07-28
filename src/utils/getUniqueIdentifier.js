export const getArtifactIdentifier = artifact => {
  let identifier = `${artifact?.db_key || artifact?.spec?.model || ''}`

  if (artifact?.tag) identifier += ` ${artifact.tag}`
  if (artifact?.tree) identifier += ` ${artifact.tree}`
  if (!isNaN(artifact?.iter)) identifier += ` ${artifact.iter}`
  if (artifact?.uid) identifier += ` ${artifact.uid}`
  if (artifact?.metadata?.uid) identifier += ` ${artifact.metadata.uid}`

  return identifier
}

export const getFeatureIdentifier = feature => {
  let identifier = `${feature?.name || ''}`

  if (feature?.tag) identifier += ` ${feature.tag}`
  if (feature.metadata?.tag) identifier += ` ${feature.metadata.tag}`
  if (feature?.uid) identifier += ` ${feature.uid}`
  if (feature.metadata?.uid) identifier += ` ${feature.metadata.uid}`

  return identifier
}

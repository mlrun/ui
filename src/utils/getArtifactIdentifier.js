const getArtifactIdentifier = artifact => {
  let identifier = `${artifact.db_key ||
    artifact.spec?.model ||
    artifact?.name ||
    ''}`

  if (artifact.tag) identifier += ` ${artifact.tag}`
  if (artifact.metadata?.tag) identifier += ` ${artifact.metadata.tag}`
  if (artifact.tree) identifier += ` ${artifact.tree}`
  if (!isNaN(parseInt(artifact.iter))) identifier += ` ${artifact.iter}`
  if (artifact.uid) identifier += ` ${artifact.uid}`
  if (artifact.metadata?.uid) identifier += ` ${artifact.metadata.uid}`
  if (artifact.metadata?.name) identifier += ` ${artifact.metadata.name}`

  return identifier
}

export default getArtifactIdentifier

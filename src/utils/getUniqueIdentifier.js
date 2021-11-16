import {
  DATASETS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB
} from '../constants'

export const getArtifactIdentifier = (artifact, unique) => {
  let identifier = `${artifact?.db_key || artifact?.spec?.model || ''}`

  if (unique) {
    if (artifact?.tag) identifier += `.${artifact.tag}`
    if (artifact?.tree) identifier += `.${artifact.tree}`
    if (!isNaN(artifact?.iter)) identifier += `.${artifact.iter}`
    if (artifact?.uid) identifier += `.${artifact.uid}`
    if (artifact?.metadata?.uid) identifier += `.${artifact.metadata.uid}`
  }

  return identifier
}

export const getFunctionIdentifier = (func, unique) => {
  let identifier = `${func?.name || ''}`

  if (unique) {
    if (func?.hash) identifier += `.${func.hash}`
    if (func?.tag) identifier += `.${func.tag}`
  }

  return identifier
}

export const getJobIdentifier = (job, unique) => {
  let identifier = `${job?.name || ''}`

  if (unique && job?.uid) identifier += `.${job.uid}`

  return identifier
}

export const getFeatureIdentifier = (feature, unique) => {
  let identifier = `${feature?.name || ''}`

  if (unique && feature.metadata?.tag) identifier += `.${feature.metadata.tag}`
  if (feature.metadata?.name) identifier += `.${feature.metadata.name}`
  if (feature.ui?.type) identifier += `.${feature.ui.type}`

  return identifier
}

export const getFeatureSetIdentifier = (featureSet, unique) => {
  let identifier = `${featureSet?.name || ''}`

  if (unique && featureSet?.tag) identifier += `.${featureSet.tag}`
  if (unique && featureSet?.uid) identifier += `.${featureSet.uid}`

  return identifier
}

export const getFeatureVectorIdentifier = (featureVector, unique) => {
  let identifier = `${featureVector?.name || ''}`

  if (unique && featureVector?.tag) identifier += `.${featureVector.tag}`
  if (unique && featureVector?.uid) identifier += `.${featureVector.uid}`

  return identifier
}

export const getIdentifierMethod = tab => {
  switch (tab) {
    case FEATURES_TAB:
      return getFeatureIdentifier
    case FEATURE_SETS_TAB:
      return getFeatureSetIdentifier
    case FEATURE_VECTORS_TAB:
      return getFeatureVectorIdentifier
    case DATASETS_TAB:
      return getArtifactIdentifier
    default:
      return getFeatureIdentifier
  }
}

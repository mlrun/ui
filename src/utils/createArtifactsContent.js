import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import {
  ARTIFACTS_FEATURE_SETS_PAGE,
  ARTIFACTS_FEATURE_STORE,
  ARTIFACTS_MODELS_PAGE
} from '../constants'
import { convertBytes } from './convertBytes'

const createArtifactsContent = (artifacts, pageKind, featureStoreTab) =>
  artifacts.map(artifact => {
    return {
      key: {
        value:
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE
            ? artifact.name
            : artifact.db_key,
        class: 'artifacts_medium'
      },
      kind: {
        value: artifact.kind,
        class: 'artifacts_extra-small',
        type:
          pageKind === ARTIFACTS_FEATURE_STORE ||
          pageKind === ARTIFACTS_MODELS_PAGE ||
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE
            ? 'hidden'
            : ''
      },
      labels: {
        value: parseKeyValues(artifact.labels),
        class: 'artifacts_big',
        type: 'labels'
      },
      producer: {
        value: artifact.producer,
        class: 'artifacts_small',
        type:
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE
            ? 'hidden'
            : 'producer'
      },
      owner: {
        value: artifact.producer?.owner,
        class: 'artifacts_small',
        type:
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE ? 'hidden' : 'owner'
      },
      version: {
        value: artifact.tag,
        class: 'artifacts_small',
        type: featureStoreTab !== ARTIFACTS_FEATURE_SETS_PAGE ? 'hidden' : ''
      },
      updated: {
        value: formatDatetime(artifact.updated, 'N/A'),
        class: 'artifacts_small'
      },
      size: {
        value: convertBytes(artifact.size || 0),
        class: 'artifacts_small',
        type:
          pageKind === ARTIFACTS_MODELS_PAGE ||
          !pageKind ||
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE
            ? 'hidden'
            : ''
      },
      buttonPopout: {
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type:
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE
            ? 'hidden'
            : 'buttonPopout'
      },
      buttonDownload: {
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type:
          featureStoreTab === ARTIFACTS_FEATURE_SETS_PAGE
            ? 'hidden'
            : 'buttonDownload'
      }
    }
  })

export default createArtifactsContent

import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { ARTIFACTS_FEATURE_STORE, ARTIFACTS_MODELS_PAGE } from '../constants'
import { convertBytes } from './convertBytes'

const createArtifactsContent = (artifacts, pageKind) =>
  artifacts.map(artifact => {
    return {
      key: {
        value: artifact.db_key,
        class: 'artifacts_medium'
      },
      kind: {
        value: artifact.kind,
        class: 'artifacts_extra-small',
        type:
          pageKind === ARTIFACTS_FEATURE_STORE ||
          pageKind === ARTIFACTS_MODELS_PAGE
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
        type: 'producer'
      },
      owner: {
        value: artifact.producer.owner,
        class: 'artifacts_small',
        type: 'owner'
      },
      updated: {
        value: formatDatetime(new Date(artifact.updated), 'N/A'),
        class: 'artifacts_small'
      },
      size: {
        value: convertBytes(artifact.size || 0),
        class: 'artifacts_small',
        type: pageKind === ARTIFACTS_MODELS_PAGE || !pageKind ? 'hidden' : ''
      },
      buttonPopout: {
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonPopout'
      },
      buttonDownload: {
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonDownload'
      }
    }
  })

export default createArtifactsContent

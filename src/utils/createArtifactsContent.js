import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'

const createArtifactsContent = artifacts =>
  artifacts.map(artifact => {
    return {
      key: {
        value: artifact.db_key,
        class: 'artifacts_medium'
      },
      king: {
        value: artifact.kind,
        class: 'artifacts_extra-small'
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
        value: formatDatetime(new Date(artifact.updated)),
        class: 'artifacts_small'
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

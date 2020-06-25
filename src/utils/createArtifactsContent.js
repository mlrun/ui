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
        class: 'artifacts_kind'
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
        class: 'artifacts_owner',
        type: 'owner'
      },
      hash: {
        value: artifact.hash,
        class: 'artifacts_small',
        type: 'hash'
      },
      updated: {
        value: formatDatetime(new Date(artifact.updated)),
        class: 'artifacts_date'
      },
      buttonPopout: {
        value: '',
        class: 'artifacts_popout',
        type: 'buttonPopout'
      },
      buttonDownload: {
        value: '',
        class: 'artifacts_download',
        type: 'buttonDownload'
      }
    }
  })

export default createArtifactsContent

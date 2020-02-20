import { parseKeyValues } from './object'
import { truncateUid } from './string'
import { formatDatetime } from './datetime'

const createArtifactsContent = artifacts =>
  artifacts.map(artifact => {
    return {
      key: {
        value: artifact.key,
        size: 'artifacts_medium'
      },
      target_path: {
        value: artifact.target_path,
        size: 'artifacts_big',
        type: 'path'
      },
      king: {
        value: artifact.king,
        size: 'artifacts_small'
      },
      labels: {
        value: parseKeyValues(artifact.labels),
        size: 'artifacts_big',
        type: 'labels'
      },
      producer: {
        value: artifact.producer,
        size: 'artifacts_small',
        type: 'producer'
      },
      hash: {
        value: truncateUid(artifact.hash),
        size: 'artifacts_small'
      },
      updated: {
        value: formatDatetime(new Date(artifact.updated)),
        size: 'artifacts_date'
      },
      buttonPopout: {
        value: '',
        size: 'artifacts_small',
        type: 'buttonPopout'
      },
      buttonDownload: {
        value: '',
        size: 'artifacts_small',
        type: 'buttonDownload'
      }
    }
  })

export default createArtifactsContent

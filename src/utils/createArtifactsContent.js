import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'

const createArtifactsContent = artifacts =>
  artifacts.map(artifact => {
    return {
      key: {
        value: artifact.db_key,
        size: 'artifacts_medium'
      },
      target_path: {
        value: artifact.target_path,
        size: 'artifacts_big',
        type: 'path'
      },
      king: {
        value: artifact.kind,
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
      owner: {
        value: artifact.producer.owner,
        size: 'artifacts_small',
        type: 'owner'
      },
      hash: {
        value: artifact.hash,
        size: 'artifacts_small',
        type: 'hash'
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

import { map } from 'lodash'

export const parseV3ioStreams = consumerGroups => {
  return map(consumerGroups, (consumerGroupData, functionStreamName) => {
    const [functionName, streamName] = functionStreamName.split('@')
    let streamPath = consumerGroupData.streamPath

    if (!streamPath.startsWith('/')) {
      streamPath = `/${streamPath}`
    }

    return {
      ...consumerGroupData,
      streamPath: consumerGroupData.containerName + streamPath,
      functionName,
      streamName,
      ui: {
        originalContent: {
          [functionStreamName]: consumerGroupData
        }
      }
    }
  })
}

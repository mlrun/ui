import { map } from 'lodash'

export const parseV3ioStreams = consumerGroups => {
  return map(consumerGroups, (consumerGroupData, functionStreamName) => {
    const [functionName, streamName] = functionStreamName.split('@')

    return {
      ...consumerGroupData,
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

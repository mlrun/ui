import { get, map } from 'lodash'

export const parseV3ioStreamShardLags = (shardLags, requestBody) => {
  const preparedShardLags = get(shardLags, [
    `${requestBody.containerName}${requestBody.streamPath}`,
    requestBody.consumerGroup
  ])

  return map(preparedShardLags, (shardLagData, shardLagId) => {
    return {
      ...shardLagData,
      shardLagId,
      ui: {
        originalContent: {
          [shardLagId]: shardLagData
        }
      }
    }
  })
}

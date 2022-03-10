import { getV3ioStreamShardLagIdentifier } from './getUniqueIdentifier'

const createConsumerGroupsContent = content => {
  return content.map(contentItem => {
    if (contentItem) {
      const identifier = getV3ioStreamShardLagIdentifier(contentItem)

      return {
        shardLagId: {
          id: `shardLagId.${identifier}`,
          value: contentItem.shardLagId,
          class: 'table-cell-1',
          identifier: identifier,
          identifierUnique: identifier
        },
        lagMsgBehind: {
          id: `lagMsgBehind.${identifier}`,
          value: contentItem.lag,
          class: 'table-cell-1'
        },
        lastSequence: {
          id: `lastSequence.${identifier}`,
          value: contentItem.current,
          class: 'table-cell-1'
        },
        committedOffset: {
          id: `committedOffset.${identifier}`,
          value: contentItem.committed,
          class: 'table-cell-1'
        }
      }
    }

    return {}
  })
}

export default createConsumerGroupsContent

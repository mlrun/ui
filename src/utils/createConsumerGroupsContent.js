import { getV3ioStreamIdentifier } from './getUniqueIdentifier'

const createConsumerGroupsContent = (content, params) => {
  return content.map(contentItem => {
    if (contentItem) {
      const identifier = getV3ioStreamIdentifier(contentItem)

      return {
        consumerGroup: {
          id: `consumerGroup.${identifier}`,
          value: contentItem?.consumerGroup,
          class: 'table-cell-1 text-bold',
          identifier: identifier,
          identifierUnique: identifier,
          getLink: () => {
            return `/projects/${params.projectName}/monitor/consumer-groups/${contentItem.consumerGroup}`
          }
        },
        streamPath: {
          id: `streamPath.${identifier}`,
          value: contentItem?.streamPath,
          class: 'table-cell-1'
        },
        realTimeFunction: {
          id: `realTimeFunction.${identifier}`,
          value: contentItem.functionName,
          getLink: () => {
            return `${window.mlrunConfig.nuclioUiUrl}/projects/${params.projectName}/functions/${contentItem.functionName}`
          },
          linkIsExternal: true,
          class: 'table-cell-1'
        }
      }
    }

    return {}
  })
}

export default createConsumerGroupsContent

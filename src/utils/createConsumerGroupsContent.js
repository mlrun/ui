/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { generateNuclioLink } from './parseUri'
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
            return `/projects/${params.projectName}/monitor/consumer-groups/${contentItem.functionName}/${contentItem.streamName}`
          }
        },
        streamPath: {
          id: `streamPath.${identifier}`,
          value: contentItem?.containerName + contentItem?.streamPath,
          class: 'table-cell-1'
        },
        realTimeFunction: {
          id: `realTimeFunction.${identifier}`,
          value: contentItem.functionName,
          getLink: () => {
            return generateNuclioLink(
              `/projects/${params.projectName}/functions/${contentItem.functionName}`
            )
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

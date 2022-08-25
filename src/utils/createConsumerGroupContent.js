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

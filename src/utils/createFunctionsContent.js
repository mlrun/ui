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
import { formatDatetime } from './datetime'
import { getFunctionImage } from '../components/FunctionsPage/functions.util'

const createFunctionsContent = (functions, projectName, showExpandButton) =>
  functions.map(func => {
    return {
      data: {
        ...func
      },
      content: [
        {
          id: `name.${func.ui.identifierUnique}`,
          headerId: 'name',
          headerLabel: 'Name',
          value: func.name,
          className: 'table-cell-name',
          getLink: (hash, tab) => {
            return `/projects/${projectName}/functions/${hash}${`/${tab}`}`
          },
          expandedCellContent: {
            value: formatDatetime(func.updated, 'N/A'),
            className: 'table-cell-name',
            type: 'date',
            showTag: true,
            showStatus: true
          },
          showTag: true,
          showStatus: true,
          showExpandButton
        },
        {
          id: `kind.${func.ui.identifierUnique}`,
          headerId: 'kind',
          headerLabel: 'Kind',
          value: func.type,
          className: 'table-cell-small',
          type: 'type'
        },
        {
          id: `hash.${func.ui.identifierUnique}`,
          headerId: 'hash',
          headerLabel: 'Hash',
          value: func.hash,
          className: 'table-cell-1',
          type: 'hash'
        },
        {
          id: `updated.${func.ui.identifierUnique}`,
          headerId: 'updated',
          headerLabel: 'Updated',
          value: formatDatetime(func.updated, 'N/A'),
          className: 'table-cell-2',
          type: 'date',
          showTag: true,
          showStatus: true
        },
        {
          id: `command.${func.ui.identifierUnique}`,
          headerId: 'command',
          headerLabel: 'Code Entry Point',
          value: func.command,
          className: 'table-cell-2'
        },
        {
          id: `defaultHandler.${func.ui.identifierUnique}`,
          headerId: 'defaultHandler',
          headerLabel: 'Default handler',
          value: func.default_handler,
          className: 'table-cell-2'
        },
        {
          id: `image.${func.ui.identifierUnique}`,
          headerId: 'image',
          headerLabel: 'Image',
          value: getFunctionImage(func),
          className: 'table-cell-1'
        },
        {
          id: `description.${func.ui.identifierUnique}`,
          headerId: 'description',
          headerLabel: 'Description',
          value: func.description,
          className: 'table-cell-2'
        },
        {
          id: `tag.${func.ui.identifierUnique}`,
          headerId: 'tag',
          value: func.tag,
          type: 'hidden'
        }
      ]
    }
  })

export default createFunctionsContent

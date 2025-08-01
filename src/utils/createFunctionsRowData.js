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
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import { getFunctionImage } from '../components/FunctionsPage/functions.util'
import { ALL_VERSIONS_PATH } from '../constants'
import { typesOfJob } from './jobs.util'

const createFunctionsRowData = (func, projectName, isAllVersions, showExpandButton, oldVersion) => {
  return {
    data: {
      ...func
    },
    content: [
      {
        id: `name.${func.ui.identifierUnique}`,
        headerId: isAllVersions ? 'hash' : 'name',
        headerLabel: isAllVersions ? 'Hash' : 'Name',
        value: isAllVersions ? func.hash : func.name,
        className: 'table-cell-name',
        getLink: tab => {
          if (oldVersion) {
            return `/projects/${projectName}/functions/${func.name}${func.tag ? `/${func.tag}` : `@${func.hash}`}${`/${tab}`}${window.location.search}` // todo [functionsWithPagination] remove in 1.9.0
          }

          return `/projects/${projectName}/functions/${func.name}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/${func.tag ? `:${func.tag}` : ''}@${func.hash}${`/${tab}`}${window.location.search}`
        },
        expandedCellContent: {
          // todo [functionsWithPagination] remove this and showExpandButton in 1.9.0
          value: formatDatetime(func.updated, 'N/A'),
          className: 'table-cell-name',
          type: 'date',
          showTag: true,
          showStatus: true
        },
        showTag: true,
        showSelectedUid: true,
        showUpdatedDate: true,
        showStatus: true,
        showExpandButton
      },
      {
        id: `kind.${func.ui.identifierUnique}`,
        headerId: 'kind',
        headerLabel: 'Kind',
        value: func.type,
        className: 'table-cell-small',
        type: 'type',
        types: typesOfJob
      },
      {
        id: `hash.${func.ui.identifierUnique}`,
        headerId: 'hash',
        headerLabel: 'Hash',
        value: func.hash,
        className: 'table-cell-1',
        type: 'hash',
        hidden: isAllVersions
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
}

export default createFunctionsRowData

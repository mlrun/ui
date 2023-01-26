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
import { FUNCTIONS_PAGE, MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../constants'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

const createFunctionsContent = (functions, pageTab, projectName, showExpandButton) =>
  functions.map(func => {
    return pageTab === REAL_TIME_PIPELINES_TAB
      ? {
          data: {
            ...func
          },
          content: [
            {
              id: `name.${func.ui.identifierUnique}`,
              headerId: 'name',
              headerLabel: 'Name',
              value: func.name,
              class: 'table-cell-medium',
              getLink: hash => {
                return `/projects/${projectName}/${MODELS_PAGE.toLowerCase()}/${REAL_TIME_PIPELINES_TAB}/pipeline/${hash}`
              },
              showTag: true,
              showStatus: true,
              expandedCellContent: {
                value: formatDatetime(func.updated, 'N/A'),
                class: 'table-cell-medium',
                type: 'date',
                showTag: true,
                showStatus: true
              },
              showExpandButton
            },
            {
              id: `kind.${func.ui.identifierUnique}`,
              headerId: 'type',
              headerLabel: 'Type',
              value: func.graph?.kind === 'router' ? 'Router' : 'Flow',
              class: 'table-cell-medium',
              type: 'type'
            },
            {
              id: `function.${func.ui.identifierUnique}`,
              headerId: 'function',
              headerLabel: 'Function',
              value: func.name,
              class: 'functions_big',
              getLink: tab =>
                generateLinkToDetailsPanel(func.project, FUNCTIONS_PAGE, null, func.hash, null, tab)
            },
            {
              id: `updated.${func.ui.identifierUnique}`,
              headerId: 'updated',
              value: formatDatetime(func.updated, 'N/A'),
              class: 'table-cell-medium',
              type: 'date',
              showTag: true,
              showStatus: true,
              hidden: true
            }
          ]
        }
      : {
          data: {
            ...func
          },
          content: [
            {
              id: `name.${func.ui.identifierUnique}`,
              headerId: 'name',
              headerLabel: 'Name',
              value: func.name,
              class: 'table-cell-medium',
              getLink: (hash, tab) => {
                return `/projects/${projectName}/functions/${hash}${`/${tab}`}`
              },
              expandedCellContent: {
                value: formatDatetime(func.updated, 'N/A'),
                class: 'table-cell-medium',
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
              class: 'functions_small',
              type: 'type'
            },
            {
              id: `hash.${func.ui.identifierUnique}`,
              headerId: 'hash',
              headerLabel: 'Hash',
              value: func.hash,
              class: 'functions_small',
              type: 'hash'
            },
            {
              id: `updated.${func.ui.identifierUnique}`,
              headerId: 'updated',
              headerLabel: 'Updated',
              value: formatDatetime(func.updated, 'N/A'),
              class: 'functions_small',
              type: 'date',
              showTag: true,
              showStatus: true
            },
            {
              id: `command.${func.ui.identifierUnique}`,
              headerId: 'command',
              headerLabel: 'Command',
              value: func.command,
              class: 'functions_big'
            },
            {
              id: `image.${func.ui.identifierUnique}`,
              headerId: 'image',
              headerLabel: 'Image',
              value: func.image,
              class: 'functions_big'
            },
            {
              id: `description.${func.ui.identifierUnique}`,
              headerId: 'description',
              headerLabel: 'Description',
              value: func.description,
              class: 'functions_small'
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

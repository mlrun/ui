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
import { getFunctionIdentifier } from './getUniqueIdentifier'
import { FUNCTIONS_PAGE, REAL_TIME_PIPELINES_TAB } from '../constants'
import { page } from '../components/Models/models.util'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

const createFunctionsContent = (functions, isSelectedItem, params) =>
  functions.map(func => {
    const identifierUnique = getFunctionIdentifier(func, true)

    return params.pageTab === REAL_TIME_PIPELINES_TAB
      ? {
          name: {
            id: `name.${identifierUnique}`,
            value: func.name,
            class: 'functions_medium',
            identifier: getFunctionIdentifier(func),
            identifierUnique: getFunctionIdentifier(func, true),
            getLink: hash => {
              return `/projects/${params.projectName}/${page.toLowerCase()}/${
                params.pageTab
              }/pipeline/${hash}`
            },
            showTag: true,
            showStatus: true
          },
          kind: {
            id: `kind.${identifierUnique}`,
            value: func.graph?.kind === 'router' ? 'Router' : 'Flow',
            class: 'functions_medium',
            type: 'type'
          },
          function: {
            id: `function.${identifierUnique}`,
            value: func.name,
            class: 'functions_big',
            getLink: tab =>
              generateLinkToDetailsPanel(
                func.project,
                FUNCTIONS_PAGE,
                null,
                func.hash,
                null,
                tab
              )
          },
          updated: {
            id: `updated.${identifierUnique}`,
            value: formatDatetime(new Date(func.updated), 'N/A'),
            class: 'functions_medium',
            type: 'date',
            showTag: true,
            showStatus: true,
            hidden: true
          }
        }
      : {
          name: {
            id: `name.${identifierUnique}`,
            value: func.name,
            class: 'functions_medium',
            showTag: true,
            showStatus: true,
            identifier: getFunctionIdentifier(func),
            identifierUnique: identifierUnique
          },
          kind: {
            id: `kind.${identifierUnique}`,
            value: func.type,
            class: 'functions_small',
            type: 'type',
            hidden: isSelectedItem
          },
          hash: {
            id: `hash.${identifierUnique}`,
            value: func.hash,
            class: 'functions_small',
            type: 'hash',
            hidden: isSelectedItem
          },
          updated: {
            id: `updated.${identifierUnique}`,
            value: formatDatetime(new Date(func.updated), 'N/A'),
            class: 'functions_small',
            type: 'date',
            showTag: true,
            showStatus: true,
            hidden: isSelectedItem
          },
          command: {
            id: `command.${identifierUnique}`,
            value: func.command,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          image: {
            id: `image.${identifierUnique}`,
            value: func.image,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          description: {
            id: `description.${identifierUnique}`,
            value: func.description,
            class: 'functions_small',
            hidden: isSelectedItem
          },
          tag: {
            id: `tag.${identifierUnique}`,
            value: func.tag,
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
  })

export default createFunctionsContent

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
import FunctionPopUp from '../elements/DetailsPopUp/FunctionPopUp/FunctionPopUp'

import { formatDatetime } from './datetime'
import { openPopUp } from 'igz-controls/utils/common.util'
import { MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../constants'

const createRealTimePipelinesContent = (pipelines, projectName) =>
  pipelines.map(pipeline => {
    return {
      data: {
        ...pipeline
      },
      content: [
        {
          id: `name.${pipeline.ui.identifierUnique}`,
          headerId: 'name',
          headerLabel: 'Name',
          value: pipeline.name,
          className: 'table-cell-name',
          getLink: () => {
            return `/projects/${projectName}/${MODELS_PAGE.toLowerCase()}/${REAL_TIME_PIPELINES_TAB}/pipeline/${pipeline.hash}${window.location.search}`
          },
          showTag: true,
          showStatus: true,
          expandedCellContent: {
            value: formatDatetime(pipeline.updated, 'N/A'),
            className: 'table-cell-name',
            type: 'date',
            showTag: true,
            showStatus: true
          }
        },
        {
          id: `kind.${pipeline.ui.identifierUnique}`,
          headerId: 'type',
          headerLabel: 'Type',
          value: pipeline.graph?.kind === 'router' ? 'Router' : 'Flow',
          className: 'table-cell-small',
          type: 'type'
        },
        {
          id: `function.${pipeline.ui.identifierUnique}`,
          headerId: 'function',
          headerLabel: 'Function',
          value: pipeline.name,
          className: 'table-cell-2',
          handleClick: () =>
            openPopUp(FunctionPopUp, {
              funcUri: `${pipeline.project}/${pipeline.name}@${pipeline.hash}`
            })
        },
        {
          id: `updated.${pipeline.ui.identifierUnique}`,
          headerId: 'updated',
          value: formatDatetime(pipeline.updated, 'N/A'),
          className: 'table-cell-2',
          type: 'date',
          showTag: true,
          showStatus: true,
          hidden: true
        }
      ]
    }
  })

export default createRealTimePipelinesContent

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
import { DETAILS_MODEL_ENDPOINTS_TAB, MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../constants'
import { typesOfJob } from './jobs.util'
import { generateNuclioLink } from './parseUri'

const createRealTimePipelinesContent = (pipelines, projectName) =>
  pipelines.map(pipeline => {
    const nuclioFunctionName =
      pipeline.nuclio_name || `${projectName}-${pipeline.name.toLowerCase()}`.slice(0, 63)

    return {
      data: {
        ...pipeline
      },
      content: [
        {
          id: `servingPipeline.${pipeline.ui.identifierUnique}`,
          headerId: 'servingPipeline',
          headerLabel: 'Serving pipeline',
          value: pipeline.name,
          className: 'table-cell-name',
          getLink: tab =>
            `/projects/${projectName}/${MODELS_PAGE.toLowerCase()}/${REAL_TIME_PIPELINES_TAB}/${pipeline.hash}/${tab}${window.location.search}`
        },
        {
          id: `rootFunction.${pipeline.ui.identifierUnique}`,
          headerId: 'rootFunction',
          headerLabel: 'Root function',
          value: pipeline.name,
          className: 'table-cell-2',
          showStatus: true,
          showTag: true,
          linkIsExternal: true,
          getLink: () =>
            generateNuclioLink(`/projects/${projectName}/functions/${nuclioFunctionName}`)
        },
        {
          id: `topology.${pipeline.ui.identifierUnique}`,
          headerId: 'topology',
          headerLabel: 'Topology',
          value: pipeline.graph?.kind === 'router' ? 'Router' : 'Flow',
          className: 'table-cell-small',
          type: 'type',
          types: typesOfJob
        },
        {
          id: `modelEndpoints.${pipeline.ui.identifierUnique}`,
          headerId: 'modelEndpoints',
          headerLabel: 'Model endpoints',
          value: pipeline.modelEndpointsCount || 'N/A',
          className: 'table-cell-1',
          type: 'number',
          ...(pipeline.modelEndpointsCount
            ? {
                linkTab: DETAILS_MODEL_ENDPOINTS_TAB,
                className: 'table-cell-1 link-blue',
                getLink: tab =>
                  `/projects/${projectName}/${MODELS_PAGE.toLowerCase()}/${REAL_TIME_PIPELINES_TAB}/${pipeline.hash}/${tab}${window.location.search}`
              }
            : {})
        },
        {
          id: `replicas.${pipeline.ui.identifierUnique}`,
          headerId: 'replicas',
          headerLabel: 'Replicas',
          value:
            pipeline.max_replicas && pipeline.min_replicas
              ? `${pipeline.min_replicas} / ${pipeline.max_replicas}`
              : 'N/A',
          className: 'table-cell-1',
          type: 'number',
          tip: 'Min / Max replicas'
        },
        {
          id: `updated.${pipeline.ui.identifierUnique}`,
          headerId: 'updated',
          headerLabel: 'Updated',
          value: formatDatetime(pipeline.updated, 'N/A'),
          className: 'table-cell-2',
          type: 'date'
        }
      ]
    }
  })

export default createRealTimePipelinesContent

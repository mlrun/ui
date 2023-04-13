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
import React from 'react'
import { isNumber } from 'lodash'

import {
  ARTIFACTS_PAGE,
  DATASETS,
  DATASETS_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB,
  BUTTON_COPY_URI_CELL_TYPE,
  ARTIFACTS
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { convertBytes } from './convertBytes'
import { generateUri } from './resources'
import { generateLinkPath, parseUri } from '../utils'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

import { ReactComponent as SeverityOk } from 'igz-controls/images/severity-ok.svg'
import { ReactComponent as SeverityWarning } from 'igz-controls/images/severity-warning.svg'
import { ReactComponent as SeverityError } from 'igz-controls/images/severity-error.svg'

export const createArtifactsContent = (artifacts, page, pageTab, project) => {
  return (artifacts.filter(artifact => !artifact.link_iteration) ?? []).map(artifact => {
    if (page === ARTIFACTS_PAGE) {
      return createArtifactsRowData(artifact)
    } else if (page === MODELS_PAGE) {
      if (pageTab === MODELS_TAB) {
        return createModelsRowData(artifact, project)
      } else if (pageTab === MODEL_ENDPOINTS_TAB) {
        return createModelEndpointsRowData(artifact, project)
      }
    } else if (page === FILES_PAGE) {
      return createFilesRowData(artifact, project)
    }

    return createDatasetsRowData(artifact, project)
  })
}

const createArtifactsRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'table-cell-name',
      link: 'overview'
    },
    kind: {
      value: artifact.kind,
      class: 'table-cell-small'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'table-cell-1',
      type: 'labels'
    },
    producer: {
      value: artifact.producer,
      class: 'table-cell-1',
      type: 'producer'
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'table-cell-1',
      type: 'owner'
    },
    updated: {
      value: formatDatetime(artifact.updated, 'N/A'),
      class: 'table-cell-1'
    },
    buttonPopout: {
      value: '',
      class: 'table-cell-icon',
      type: 'buttonPopout'
    },
    buttonDownload: {
      value: '',
      class: 'table-cell-icon',
      type: 'buttonDownload'
    }
  }
}

export const createModelsRowData = (artifact, project, showExpandButton) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`

  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: artifact.db_key,
        class: 'table-cell-name',
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            MODELS_TAB,
            MODELS_TAB,
            artifact.db_key,
            artifact.tag,
            tab,
            artifact.tree,
            artifact.iter
          ),
        expandedCellContent: {
          class: 'table-cell-name',
          showTag: true,
          tooltip: artifact.tag ? `${artifact.tag}${iter}` : `${artifact.tree}${iter}`,
          type: 'date',
          value: formatDatetime(artifact.updated, 'N/A')
        },
        rowExpanded: {
          getLink: false
        },
        showTag: true,
        showExpandButton
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseKeyValues(artifact.labels),
        class: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `producer.${artifact.ui.identifierUnique}`,
        headerId: 'producer',
        headerLabel: 'Producer',
        value: artifact.producer,
        class: 'table-cell-1',
        type: 'producer'
      },
      {
        id: `owner.${artifact.ui.identifierUnique}`,
        headerId: 'owner',
        headerLabel: 'Owner',
        value: artifact.producer?.owner,
        class: 'table-cell-1',
        type: 'owner'
      },
      {
        id: `updated.${artifact.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        class: 'table-cell-1'
      },
      {
        id: `metrics.${artifact.ui.identifierUnique}`,
        headerId: 'metrics',
        headerLabel: 'Metrics',
        value: parseKeyValues(artifact.metrics),
        class: 'table-cell-1',
        type: 'metrics'
      },
      {
        id: `frameWorkAndAlgorithm.${artifact.ui.identifierUnique}`,
        headerId: 'frameWorkAndAlgorithm',
        headerLabel: (
          <span>
            <span>Framework &</span>
            <br />
            <span>Algorithm</span>
          </span>
        ),
        value:
          artifact.framework || artifact.algorithm ? (
            <span>
              <span>{artifact.framework}</span>
              <br />
              <span>{artifact.algorithm}</span>
            </span>
          ) : (
            ''
          ),
        class: 'table-cell-1'
      },
      {
        id: `version.${artifact.ui.identifierUnique}`,
        headerId: 'tag',
        value: artifact.tag,
        class: 'table-cell-1',
        type: 'hidden'
      },
      {
        id: `buttonPopout.${artifact.ui.identifierUnique}`,
        headerId: 'popupt',
        value: '',
        class: 'table-cell-icon',
        type: 'buttonPopout'
      },
      {
        id: `buttonDownload.${artifact.ui.identifierUnique}`,
        headerId: 'download',
        value: '',
        class: 'table-cell-icon',
        type: 'buttonDownload'
      },
      {
        id: `buttonCopy.${artifact.ui.identifierUnique}`,
        headerId: 'copy',
        value: '',
        class: 'table-cell-icon',
        type: BUTTON_COPY_URI_CELL_TYPE,
        actionHandler: item => generateUri(item, MODELS_TAB)
      }
    ]
  }
}

export const createFilesRowData = (artifact, project, showExpandButton) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`

  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: artifact.db_key,
        class: 'table-cell-name',
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            FILES_PAGE,
            null,
            artifact.db_key,
            artifact.tag,
            tab,
            artifact.tree,
            artifact.iter
          ),
        expandedCellContent: {
          class: 'table-cell-name',
          showTag: true,
          tooltip: artifact.tag ? `${artifact.tag}${iter}` : `${artifact.tree}${iter}`,
          type: 'date',
          value: formatDatetime(artifact.updated, 'N/A')
        },
        rowExpanded: {
          getLink: false
        },
        showTag: true,
        showExpandButton
      },
      {
        id: `version.${artifact.ui.identifierUnique}`,
        headerId: 'tag',
        value: artifact.tag,
        class: 'table-cell-1',
        type: 'hidden'
      },
      {
        id: `kind.${artifact.ui.identifierUnique}`,
        headerId: 'type',
        headerLabel: 'Type',
        value: artifact.kind,
        class: 'table-cell-small'
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseKeyValues(artifact.labels),
        class: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `producer.${artifact.ui.identifierUnique}`,
        headerId: 'producer',
        headerLabel: 'Producer',
        value: artifact.producer || {},
        class: 'table-cell-1',
        type: 'producer'
      },
      {
        id: `owner.${artifact.ui.identifierUnique}`,
        headerId: 'owner',
        headerLabel: 'Owner',
        value: artifact.producer?.owner,
        class: 'table-cell-1',
        type: 'owner'
      },
      {
        id: `updated.${artifact.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        class: 'table-cell-1'
      },
      {
        id: `size.${artifact.ui.identifierUnique}`,
        headerId: 'size',
        headerLabel: 'Size',
        value: isNumber(artifact.size) && artifact.size >= 0 ? convertBytes(artifact.size) : 'N/A',
        class: 'table-cell-1'
      },
      {
        id: `buttonPopout.${artifact.ui.identifierUnique}`,
        headerId: 'popout',
        value: '',
        class: 'table-cell-icon',
        type: 'buttonPopout'
      },
      {
        id: `buttonDownload.${artifact.ui.identifierUnique}`,
        headerId: 'download',
        value: '',
        class: 'table-cell-icon',
        type: 'buttonDownload'
      },
      {
        id: `buttonCopy.${artifact.ui.identifierUnique}`,
        headerId: 'copy',
        value: '',
        class: 'table-cell-icon',
        type: BUTTON_COPY_URI_CELL_TYPE,
        actionHandler: item => generateUri(item, ARTIFACTS)
      }
    ]
  }
}

const driftStatusIcons = {
  NO_DRIFT: {
    value: <SeverityOk />,
    tooltip: 'No drift'
  },
  POSSIBLE_DRIFT: {
    value: <SeverityWarning />,
    tooltip: 'Possible drift'
  },
  DRIFT_DETECTED: {
    value: <SeverityError />,
    tooltip: 'Drift detected'
  }
}

export const createModelEndpointsRowData = (artifact, project) => {
  const { name, tag = '-' } =
    (artifact.spec?.model ?? '').match(/^(?<name>.*?)(:(?<tag>.*))?$/)?.groups ?? {}
  const functionUri = artifact.spec?.function_uri
    ? `store://functions/${artifact.spec.function_uri}`
    : ''
  const { key: functionName } = parseUri(functionUri)
  const averageLatency = artifact.status?.metrics?.real_time?.latency_avg_1h?.[0]?.[1]

  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: name,
        class: 'table-cell-name',
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            MODELS_TAB,
            MODEL_ENDPOINTS_TAB,
            name,
            artifact.metadata?.uid,
            tab
          ),
        showStatus: true,
        tooltip: artifact.spec?.model_uri ? `${name} - ${artifact.spec?.model_uri}` : name
      },
      {
        id: `functionName.${artifact.ui.identifierUnique}`,
        headerId: 'function',
        headerLabel: 'Function',
        value: functionName,
        class: 'table-cell-1',
        link: `${generateLinkPath(functionUri)}/overview`,
        tooltip: functionUri
      },
      {
        id: `state.${artifact.ui.identifierUnique}`,
        headerId: 'state',
        value: artifact.status?.state,
        class: 'table-cell-small',
        type: 'hidden'
      },
      {
        id: `version.${artifact.ui.identifierUnique}`,
        headerId: 'version',
        headerLabel: 'Version',
        value: artifact?.status?.children ? 'Router' : tag,
        class: 'table-cell-small'
      },
      {
        id: `modelClass.${artifact.ui.identifierUnique}`,
        headerId: 'class',
        headerLabel: 'Class',
        value: artifact.spec?.model_class,
        class: 'table-cell-1'
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseKeyValues(artifact.metadata?.labels),
        class: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `firstRequest.${artifact.ui.identifierUnique}`,
        headerId: 'uptime',
        headerLabel: 'Uptime',
        value: formatDatetime(artifact.status?.first_request, '-'),
        class: 'table-cell-1'
      },
      {
        id: `lastRequest.${artifact.ui.identifierUnique}`,
        headerId: 'lastprediction',
        headerLabel: 'Last prediction',
        value: formatDatetime(artifact.status?.last_request, '-'),
        class: 'table-cell-1'
      },
      {
        id: `averageLatency.${artifact.ui.identifierUnique}`,
        headerId: 'averagelatency',
        headerLabel: 'Average latency',
        value: averageLatency ? `${(averageLatency / 1000).toFixed(2)}ms` : '-',
        class: 'table-cell-1'
      },
      {
        id: `errorCount.${artifact.ui.identifierUnique}`,
        headerId: 'errorcount',
        headerLabel: 'Error count',
        value: artifact.status?.error_count ?? '-',
        class: 'table-cell-1'
      },
      {
        id: `driftStatus.${artifact.ui.identifierUnique}`,
        headerId: 'drift',
        headerLabel: 'Drift',
        value: driftStatusIcons[artifact.status?.drift_status]?.value,
        class: 'table-cell-small',
        tooltip: driftStatusIcons[artifact.status?.drift_status]?.tooltip
      }
    ]
  }
}

export const createDatasetsRowData = (artifact, project, showExpandButton) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`

  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: artifact.db_key,
        class: 'table-cell-name',
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            DATASETS_PAGE,
            null,
            artifact.db_key,
            artifact.tag,
            tab,
            artifact.tree,
            artifact.iter
          ),
        expandedCellContent: {
          class: 'table-cell-name',
          showTag: true,
          tooltip: artifact.tag ? `${artifact.tag}${iter}` : `${artifact.tree}${iter}`,
          type: 'date',
          value: formatDatetime(artifact.updated, 'N/A')
        },
        rowExpanded: {
          getLink: false
        },
        showTag: true,
        showExpandButton
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseKeyValues(artifact.labels),
        class: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `producer.${artifact.ui.identifierUnique}`,
        headerId: 'producer',
        headerLabel: 'Producer',
        value: artifact.producer,
        class: 'table-cell-1',
        type: 'producer'
      },
      {
        id: `owner.${artifact.ui.identifierUnique}`,
        headerId: 'owner',
        headerLabel: 'Owner',
        value: artifact.producer?.owner,
        class: 'table-cell-1',
        type: 'owner'
      },
      {
        id: `updated.${artifact.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        class: 'table-cell-1'
      },
      {
        id: `size.${artifact.ui.identifierUnique}`,
        headerId: 'size',
        headerLabel: 'Size',
        value: isNumber(artifact.size) && artifact.size >= 0 ? convertBytes(artifact.size) : 'N/A',
        class: 'table-cell-1'
      },
      {
        id: `version.${artifact.ui.identifierUnique}`,
        headerId: 'tag',
        value: artifact.tag,
        class: 'table-cell-1',
        type: 'hidden'
      },
      {
        id: `buttonPopout.${artifact.ui.identifierUnique}`,
        headerId: 'popout',
        value: '',
        class: 'table-cell-icon',
        type: 'buttonPopout'
      },
      {
        id: `buttonDownload.${artifact.ui.identifierUnique}`,
        headerId: 'download',
        value: '',
        class: 'table-cell-icon',
        type: 'buttonDownload'
      },
      {
        id: `buttonCopy.${artifact.ui.identifierUnique}`,
        headerId: 'copy',
        value: '',
        class: 'table-cell-icon',
        type: BUTTON_COPY_URI_CELL_TYPE,
        actionHandler: item => generateUri(item, DATASETS)
      }
    ]
  }
}

export default createArtifactsContent

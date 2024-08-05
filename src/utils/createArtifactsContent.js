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
  DATASETS_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import prettyBytes from 'pretty-bytes'
import { parseUri } from './parseUri'
import { generateFunctionDetailsLink } from './generateFunctionDetailsLink'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { validateArguments } from './validateArguments'
// import { roundFloats } from './roundFloats'
import TableProducerCell from '../elements/TableProducerCell/TableProducerCell'

import { ReactComponent as SeverityOk } from 'igz-controls/images/severity-ok.svg'
import { ReactComponent as SeverityWarning } from 'igz-controls/images/severity-warning.svg'
import { ReactComponent as SeverityError } from 'igz-controls/images/severity-error.svg'

export const createArtifactsContent = (artifacts, page, pageTab, project, frontendSpec) => {
  return (artifacts.filter(artifact => !artifact.link_iteration) ?? []).map(artifact => {
    if (page === ARTIFACTS_PAGE) {
      return createArtifactsRowData(artifact)
    } else if (page === MODELS_PAGE) {
      if (pageTab === MODELS_TAB) {
        return createModelsRowData(artifact, project, frontendSpec)
      } else if (pageTab === MODEL_ENDPOINTS_TAB) {
        return createModelEndpointsRowData(artifact, project)
      }
    } else if (page === FILES_PAGE) {
      return createFilesRowData(artifact, project, frontendSpec)
    }

    return createDatasetsRowData(artifact, project, frontendSpec)
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

const getIter = artifact => (isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`)

export const getIsTargetPathValid = (artifact, frontendSpec) =>
  frontendSpec?.allowed_artifact_path_prefixes_list
    ? frontendSpec.allowed_artifact_path_prefixes_list.some(prefix => {
        return artifact.target_path?.startsWith?.(prefix)
      })
    : false

export const createModelsRowData = (
  artifact,
  project,
  frontendSpec,
  metricsCounter,
  showExpandButton
) => {
  const iter = getIter(artifact)
  //temporarily commented till ML-5606 will be done
  // const currentMetricsCount = Object.keys(artifact?.metrics ?? {}).length ?? 0
  const content = [
    {
      id: `key.${artifact.ui.identifierUnique}`,
      headerId: 'name',
      headerLabel: 'Name',
      value: artifact.db_key,
      className: 'table-cell-name',
      getLink: tab =>
        validateArguments(artifact.db_key, tab, artifact.tree)
          ? generateLinkToDetailsPanel(
              project,
              MODELS_TAB,
              MODELS_TAB,
              artifact.db_key,
              artifact.tag,
              tab,
              artifact.tree,
              artifact.iter
            )
          : '',
      expandedCellContent: {
        headerId: 'name',
        className: 'table-cell-name',
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
      className: 'table-cell-1',
      type: 'labels'
    },
    {
      id: `producer.${artifact.ui.identifierUnique}`,
      headerId: 'producer',
      headerLabel: 'Producer',
      value: artifact.producer?.name || '',
      template: (
        <TableProducerCell
          bodyCellClassName="table-cell-1"
          id="producer"
          producer={artifact.producer}
        />
      ),
      className: 'table-cell-1',
      type: 'producer'
    },
    {
      id: `owner.${artifact.ui.identifierUnique}`,
      headerId: 'owner',
      headerLabel: 'Owner',
      value: artifact.producer?.owner,
      className: 'table-cell-1',
      type: 'owner'
    },
    {
      id: `updated.${artifact.ui.identifierUnique}`,
      headerId: 'updated',
      headerLabel: 'Updated',
      value: formatDatetime(artifact.updated, 'N/A'),
      className: 'table-cell-1'
    },
    {
      id: `metrics.${artifact.ui.identifierUnique}`,
      headerId: 'metrics',
      headerLabel: 'Metrics',
      value: parseKeyValues(artifact.metrics),
      className: 'table-cell-1',
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
      className: 'table-cell-2'
    },
    {
      id: `version.${artifact.ui.identifierUnique}`,
      headerId: 'tag',
      value: artifact.tag,
      className: 'table-cell-1',
      type: 'hidden'
    }
  ]

  //temporarily commented till ML-5606 will be done
  // if (!isNil(artifact.metrics) && !isEmpty(artifact.metrics)) {
  //   Object.entries(artifact.metrics).forEach(([key, value], index) => {
  //     const bodyCellClassName = classnames(
  //       'metrics-cell',
  //       index === 0 && 'metrics-cell_with-border'
  //     )
  //
  //     content.push({
  //       id: `${key}.${artifact.ui.identifierUnique}`,
  //       headerIsHidden: true,
  //       value: roundFloats(value, 4),
  //       className: 'table-cell-1',
  //       bodyCellClassName
  //     })
  //   })
  // }

  // if (currentMetricsCount < metricsCounter) {
  //   const missingObjects = metricsCounter - currentMetricsCount
  //
  //   for (let i = 0; i < missingObjects; i++) {
  //     content.push({
  //       id: `${i}.${artifact.ui.identifierUnique}`,
  //       headerIsHidden: true,
  //       value: '',
  //       className: 'table-cell-1'
  //     })
  //   }
  // }

  return {
    data: {
      ...artifact
    },
    content
  }
}

export const createFilesRowData = (artifact, project, frontendSpec, showExpandButton) => {
  const iter = getIter(artifact)

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
        className: 'table-cell-name',
        getLink: tab =>
          validateArguments(artifact.db_key, tab, artifact.tree)
            ? generateLinkToDetailsPanel(
                project,
                FILES_PAGE,
                null,
                artifact.db_key,
                artifact.tag,
                tab,
                artifact.tree,
                artifact.iter
              )
            : '',
        expandedCellContent: {
          headerId: 'name',
          className: 'table-cell-name',
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
        className: 'table-cell-1',
        type: 'hidden'
      },
      {
        id: `kind.${artifact.ui.identifierUnique}`,
        headerId: 'type',
        headerLabel: 'Type',
        value: artifact.kind,
        className: 'table-cell-small'
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseKeyValues(artifact.labels),
        className: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `producer.${artifact.ui.identifierUnique}`,
        headerId: 'producer',
        headerLabel: 'Producer',
        value: artifact.producer?.name || '',
        template: (
          <TableProducerCell
            bodyCellClassName="table-cell-1"
            id="producer"
            producer={artifact.producer}
          />
        ),
        className: 'table-cell-1',
        type: 'producer'
      },
      {
        id: `owner.${artifact.ui.identifierUnique}`,
        headerId: 'owner',
        headerLabel: 'Owner',
        value: artifact.producer?.owner,
        className: 'table-cell-1',
        type: 'owner'
      },
      {
        id: `updated.${artifact.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        className: 'table-cell-2'
      },
      {
        id: `size.${artifact.ui.identifierUnique}`,
        headerId: 'size',
        headerLabel: 'Size',
        value: isNumber(artifact.size) && artifact.size >= 0 ? prettyBytes(artifact.size) : 'N/A',
        className: 'table-cell-1'
      }
    ]
  }
}

const getDriftStatusData = driftStatus => {
  switch (String(driftStatus)) {
    case '0':
    case 'NO_DRIFT':
      return {
        value: (
          <span data-testid="no-drift">
            <SeverityOk />
          </span>
        ),
        tooltip: 'No drift',
        testId: 'no-drift'
      }
    case '1':
    case 'POSSIBLE_DRIFT':
      return {
        value: (
          <span data-testid="possible-drift">
            <SeverityWarning />
          </span>
        ),
        tooltip: 'Possible drift'
      }
    case '2':
    case 'DRIFT_DETECTED':
      return {
        value: (
          <span data-testid="drift-detected">
            <SeverityError />
          </span>
        ),
        tooltip: 'Drift detected'
      }
    case '-1':
    default:
      return {
        value: <span data-testid="no-status-drift">N/A</span>,
        tooltip: 'N/A'
      }
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

  const isEndpointTypeRouter = artifact?.status?.endpoint_type === 2

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
        className: 'table-cell-name',
        getLink: tab =>
          validateArguments(artifact.metadata?.uid, name)
            ? generateLinkToDetailsPanel(
                project,
                MODELS_TAB,
                MODEL_ENDPOINTS_TAB,
                name,
                artifact.metadata?.uid,
                tab
              )
            : '',
        showStatus: true,
        tooltip: artifact.spec?.model_uri ? `${name} - ${artifact.spec?.model_uri}` : name
      },
      {
        id: `functionName.${artifact.ui.identifierUnique}`,
        headerId: 'function',
        headerLabel: 'Function',
        value: functionName,
        className: 'table-cell-1',
        getLink: () => generateFunctionDetailsLink(artifact.spec?.function_uri),
        tooltip: functionUri
      },
      {
        id: `state.${artifact.ui.identifierUnique}`,
        headerId: 'state',
        value: artifact.status?.state,
        className: 'table-cell-small',
        type: 'hidden'
      },
      {
        id: `version.${artifact.ui.identifierUnique}`,
        headerId: 'version',
        headerLabel: 'Version',
        value: isEndpointTypeRouter ? '' : artifact?.status?.children?.length > 0 ? 'Router' : tag,
        className: 'table-cell-small'
      },
      {
        id: `modelClass.${artifact.ui.identifierUnique}`,
        headerId: 'class',
        headerLabel: 'Class',
        value: artifact.spec?.model_class,
        className: 'table-cell-1'
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseKeyValues(artifact.metadata?.labels),
        className: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `firstRequest.${artifact.ui.identifierUnique}`,
        headerId: 'uptime',
        headerLabel: 'Uptime',
        value: formatDatetime(artifact.status?.first_request, '-'),
        className: 'table-cell-1'
      },
      {
        id: `lastRequest.${artifact.ui.identifierUnique}`,
        headerId: 'lastprediction',
        headerLabel: 'Last prediction',
        value: formatDatetime(artifact.status?.last_request, '-'),
        className: 'table-cell-1'
      },
      {
        id: `averageLatency.${artifact.ui.identifierUnique}`,
        headerId: 'averagelatency',
        headerLabel: 'Average latency',
        value: averageLatency ? `${(averageLatency / 1000).toFixed(2)}ms` : '-',
        className: 'table-cell-1'
      },
      {
        id: `errorCount.${artifact.ui.identifierUnique}`,
        headerId: 'errorcount',
        headerLabel: 'Error count',
        value: artifact.status?.error_count ?? '-',
        className: 'table-cell-1'
      },
      {
        id: `driftStatus.${artifact.ui.identifierUnique}`,
        headerId: 'drift',
        headerLabel: 'Drift Status',
        value: getDriftStatusData(artifact.status?.drift_status).value,
        className: 'table-cell-small',
        tooltip: getDriftStatusData(artifact.status?.drift_status).tooltip
      }
    ]
  }
}

export const createDatasetsRowData = (artifact, project, frontendSpec, showExpandButton) => {
  const iter = getIter(artifact)

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
        className: 'table-cell-name',
        getLink: tab =>
          validateArguments(artifact.db_key, tab, artifact.tree)
            ? generateLinkToDetailsPanel(
                project,
                DATASETS_PAGE,
                null,
                artifact.db_key,
                artifact.tag,
                tab,
                artifact.tree,
                artifact.iter
              )
            : '',
        expandedCellContent: {
          headerId: 'name',
          className: 'table-cell-name',
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
        className: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `producer.${artifact.ui.identifierUnique}`,
        headerId: 'producer',
        headerLabel: 'Producer',
        value: artifact.producer?.name || '',
        template: (
          <TableProducerCell
            bodyCellClassName="table-cell-1"
            id="producer"
            producer={artifact.producer}
          />
        ),
        className: 'table-cell-1',
        type: 'producer'
      },
      {
        id: `owner.${artifact.ui.identifierUnique}`,
        headerId: 'owner',
        headerLabel: 'Owner',
        value: artifact.producer?.owner,
        className: 'table-cell-1',
        type: 'owner'
      },
      {
        id: `updated.${artifact.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        className: 'table-cell-1'
      },
      {
        id: `size.${artifact.ui.identifierUnique}`,
        headerId: 'size',
        headerLabel: 'Size',
        value: isNumber(artifact.size) && artifact.size >= 0 ? prettyBytes(artifact.size) : 'N/A',
        className: 'table-cell-1'
      },
      {
        id: `version.${artifact.ui.identifierUnique}`,
        headerId: 'tag',
        value: artifact.tag,
        className: 'table-cell-1',
        type: 'hidden'
      }
    ]
  }
}

export default createArtifactsContent

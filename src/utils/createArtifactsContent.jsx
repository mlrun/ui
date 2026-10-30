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
import { isNumber } from 'lodash-es'

import TableProducerCell from '../elements/TableProducerCell/TableProducerCell'
import FunctionPopUp from '../elements/DetailsPopUp/FunctionPopUp/FunctionPopUp'

import {
  ARTIFACTS_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB,
  ALL_VERSIONS_PATH
} from '../constants'
import prettyBytes from 'pretty-bytes'
import { parseUri } from './parseUri'
import { generateLinkToDetailsPanel } from './link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import { validateArguments } from './validateArguments'
import { parseChipsData } from './convertChipsData'
// import { roundFloats } from 'igz-controls/utils/common.util'

import SeverityOk from 'igz-controls/images/severity-ok.svg?react'
import SeverityWarning from 'igz-controls/images/severity-low.svg?react'
import SeverityError from 'igz-controls/images/severity-error.svg?react'
import TableModelCell from '../elements/TableModelCell/TableModelCell'
import ModelEndpointPopUp from '../elements/DetailsPopUp/ModelEndpointPopUp/ModelEndpointPopUp'

export const createArtifactsContent = (artifacts, page, pageTab, project, isAllVersions) => {
  return (artifacts.filter(artifact => !artifact.link_iteration) ?? []).map(artifact => {
    if (page === ARTIFACTS_PAGE) {
      return createArtifactsRowData(artifact)
    } else if (page === MODELS_PAGE) {
      if (pageTab === MODELS_TAB) {
        return createModelsRowData(artifact, project, isAllVersions, null)
      } else if (pageTab === MODEL_ENDPOINTS_TAB) {
        return createModelEndpointsRowData(artifact, project)
      }
    } else if (page === FILES_PAGE) {
      return createFilesRowData(artifact, project, isAllVersions)
    }

    return createDatasetsRowData(artifact, project, isAllVersions)
  })
}

export const getDefaultFirstHeader = isAllVersions => [
  {
    headerId: isAllVersions ? 'uid' : 'name',
    headerLabel: isAllVersions ? 'UID' : 'Name',
    className: 'table-cell-name'
  }
]

const getArtifactsDetailsLink = (artifact, artifactPathFragment, tab, project, isAllVersions) =>
  validateArguments(artifact.db_key, tab, artifact.uid)
    ? `/projects/${project}/${artifactPathFragment}/${artifact.db_key}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/${artifact.tag ? `:${artifact.tag}` : ''}@${artifact.uid}${`/${tab}`}${window.location.search}`
    : ''

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
      value: parseChipsData(artifact.labels),
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

export const getIsTargetPathValid = (artifact, frontendSpec) =>
  frontendSpec?.allowed_artifact_path_prefixes_list
    ? frontendSpec.allowed_artifact_path_prefixes_list.some(prefix => {
        return artifact.target_path?.startsWith?.(prefix)
      })
    : false

/* eslint-disable-next-line no-unused-vars */
export const createModelsRowData = (artifact, project, isAllVersions, metricsCounter) => {
  //temporarily commented till ML-5606 will be done
  // const currentMetricsCount = Object.keys(artifact?.metrics ?? {}).length ?? 0
  const content = [
    {
      id: `key.${artifact.ui.identifierUnique}`,
      headerId: isAllVersions ? 'uid' : 'name',
      headerLabel: isAllVersions ? 'UID' : 'Name',
      value: isAllVersions ? artifact.uid : artifact.db_key,
      className: 'table-cell-name',
      getLink: tab =>
        getArtifactsDetailsLink(artifact, 'models/models', tab, project, isAllVersions),
      showTag: true,
      showSelectedUid: true,
      showUpdatedDate: true
    },
    {
      id: `labels.${artifact.ui.identifierUnique}`,
      headerId: 'labels',
      headerLabel: 'Labels',
      value: parseChipsData(artifact.labels),
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
      value: parseChipsData(artifact.metrics),
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
          <span>algorithm</span>
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

export const createFilesRowData = (artifact, project, isAllVersions) => {
  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: isAllVersions ? 'uid' : 'name',
        headerLabel: isAllVersions ? 'UID' : 'Name',
        value: isAllVersions ? artifact.uid : artifact.db_key,
        className: 'table-cell-name',
        getLink: tab => getArtifactsDetailsLink(artifact, 'files', tab, project, isAllVersions),
        showTag: true,
        showSelectedUid: true,
        showUpdatedDate: true
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
        value: parseChipsData(artifact.labels),
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

export const createDocumentsRowData = (artifact, project, isAllVersions) => {
  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: isAllVersions ? 'uid' : 'name',
        headerLabel: isAllVersions ? 'UID' : 'Name',
        value: isAllVersions ? artifact.uid : artifact.db_key,
        className: 'table-cell-name',
        getLink: tab => getArtifactsDetailsLink(artifact, 'documents', tab, project, isAllVersions),
        showTag: true,
        showSelectedUid: true,
        showUpdatedDate: true
      },
      {
        id: `updated.${artifact.ui.identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        className: 'table-cell-1'
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(artifact.labels),
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
      }
    ]
  }
}

export const getDriftStatusData = driftStatus => {
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
          <span className="table-severity-warning-icon" data-testid="possible-drift">
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

export const createModelEndpointsRowData = (
  artifact,
  project,
  isDetails = false,
  frontendSpec,
  handleMonitoring,
  toggleConvertedYaml
) => {
  const {
    metadata,
    spec,
    status,
    ui: { identifierUnique },
    name
  } = artifact
  const functionUri = spec?.function_uri ? `store://functions/${spec.function_uri}` : ''
  const { key: functionName } = parseUri(functionUri)
  const driftStatusData = getDriftStatusData(status?.result_status)

  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: name,
        className: 'table-cell-name',
        showStatus: true,
        tooltip: spec?.model_uri ? `${name} - ${spec?.model_uri}` : name,
        additionalInfo: spec?.function_name && `${spec.function_name}:${spec.function_tag}`,
        ...(isDetails
          ? {
              handleClick: () =>
                validateArguments(metadata?.uid, name)
                  ? openPopUp(ModelEndpointPopUp, {
                      modelEndpointUid: metadata?.uid,
                      modelEndpointName: name,
                      frontendSpec,
                      handleMonitoring,
                      toggleConvertedYaml
                    })
                  : null
            }
          : {
              getLink: tab =>
                validateArguments(metadata?.uid, name)
                  ? generateLinkToDetailsPanel(
                      project,
                      MODELS_TAB,
                      MODEL_ENDPOINTS_TAB,
                      name,
                      metadata?.uid,
                      tab
                    )
                  : ''
            })
      },
      {
        id: `functionName.${identifierUnique}`,
        headerId: 'function',
        headerLabel: 'Function',
        value: functionName,
        className: 'table-cell-1',
        handleClick: () =>
          openPopUp(FunctionPopUp, {
            funcUri: spec?.function_uri
          }),
        type: 'link',
        tooltip: functionUri
      },
      {
        id: `state.${identifierUnique}`,
        headerId: 'state',
        value: status?.state,
        className: 'table-cell-small',
        type: 'hidden'
      },
      {
        id: `functionTag.${identifierUnique}`,
        headerId: 'functionTag',
        headerLabel: 'Function tag',
        value: spec?.function_tag,
        className: 'table-cell-small'
      },
      {
        id: `modelClass.${identifierUnique}`,
        headerId: 'class',
        headerLabel: 'Class',
        value: spec?.model_class,
        className: 'table-cell-1'
      },
      {
        id: `labels.${identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(metadata?.labels),
        className: 'table-cell-1',
        type: 'labels'
      },
      {
        id: `firstRequest.${identifierUnique}`,
        headerId: 'uptime',
        headerLabel: 'First prediction',
        value: formatDatetime(status?.first_request, '-'),
        className: 'table-cell-1'
      },
      {
        id: `lastRequest.${identifierUnique}`,
        headerId: 'lastprediction',
        headerLabel: 'Last prediction',
        value: formatDatetime(status?.last_request, '-'),
        className: 'table-cell-1'
      },
      {
        id: `errorCount.${identifierUnique}`,
        headerId: 'errorcount',
        headerLabel: 'Error count',
        value: status?.error_count ?? '-',
        className: 'table-cell-1'
      },
      {
        id: `driftStatus.${identifierUnique}`,
        headerId: 'drift',
        headerLabel: 'Drift Status',
        value: driftStatusData.value,
        className: 'table-cell-small',
        tooltip: driftStatusData.tooltip
      }
    ]
  }
}

export const createDatasetsRowData = (artifact, project, isAllVersions) => {
  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: isAllVersions ? 'uid' : 'name',
        headerLabel: isAllVersions ? 'UID' : 'Name',
        value: isAllVersions ? artifact.uid : artifact.db_key,
        className: 'table-cell-name',
        getLink: tab => getArtifactsDetailsLink(artifact, 'datasets', tab, project, isAllVersions),
        showTag: true,
        showSelectedUid: true,
        showUpdatedDate: true
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(artifact.labels),
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

export const createLLMPromptsRowData = (artifact, project, isAllVersions) => {
  return {
    data: {
      ...artifact
    },
    content: [
      {
        id: `key.${artifact.ui.identifierUnique}`,
        headerId: isAllVersions ? 'uid' : 'name',
        headerLabel: isAllVersions ? 'UID' : 'Name',
        value: isAllVersions ? artifact.uid : artifact.db_key,
        className: 'table-cell-name',
        getLink: tab =>
          getArtifactsDetailsLink(artifact, 'llm-prompts', tab, project, isAllVersions),
        showTag: true,
        showSelectedUid: true,
        showUpdatedDate: true
      },
      {
        id: `model.${artifact.ui.identifierUnique}`,
        headerId: 'modelName',
        headerLabel: 'Model name',
        value: artifact.parent_uri || '',
        template: (
          <TableModelCell
            bodyCellClassName="table-cell-1"
            id="modelName"
            modelUri={artifact.parent_uri}
          />
        ),
        className: 'table-cell-1',
        type: 'modelName'
      },
      {
        id: `labels.${artifact.ui.identifierUnique}`,
        headerId: 'labels',
        headerLabel: 'Labels',
        value: parseChipsData(artifact.labels),
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

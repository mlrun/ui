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

import {
  ARTIFACTS_PAGE,
  DATASETS,
  DATASETS_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { convertBytes } from './convertBytes'
import { copyToClipboard } from './copyToClipboard'
import { generateUri } from './resources'
import { generateLinkPath, parseUri, truncateUid } from '../utils'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getArtifactIdentifier } from './getUniqueIdentifier'

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
      class: 'artifacts_medium',
      link: 'overview'
    },
    kind: {
      value: artifact.kind,
      class: 'artifacts_extra-small'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    producer: {
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer'
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner'
    },
    updated: {
      value: artifact.updated ? formatDatetime(new Date(artifact.updated), 'N/A') : 'N/A',
      class: 'artifacts_small'
    },
    buttonPopout: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout'
    },
    buttonDownload: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload'
    }
  }
}

export const createModelsRowData = (artifact, project, showExpandButton) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`
  const identifierUnique = getArtifactIdentifier(artifact, true)

  return {
    data: {
      ...artifact,
      ui: {
        ...artifact.ui,
        identifier: getArtifactIdentifier(artifact),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Name',
        value: artifact.db_key,
        class: 'artifacts_medium',
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
          class: 'artifacts_medium',
          value: artifact.tag ? `${artifact.tag}${iter}` : `${truncateUid(artifact.tree)}${iter}`,
          tooltip: artifact.tag ? `${artifact.tag}${iter}` : `${artifact.tree}${iter}`
        },
        rowExpanded: {
          getLink: false
        },
        showExpandButton
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(artifact.labels),
        class: 'artifacts_extra-small',
        type: 'labels'
      },
      {
        id: `producer.${identifierUnique}`,
        header: 'Producer',
        value: artifact.producer,
        class: 'artifacts_small',
        type: 'producer'
      },
      {
        id: `owner.${identifierUnique}`,
        header: 'Owner',
        value: artifact.producer?.owner,
        class: 'artifacts_small',
        type: 'owner'
      },
      {
        id: `updated.${identifierUnique}`,
        header: 'Updated',
        value: artifact.updated ? formatDatetime(new Date(artifact.updated), 'N/A') : 'N/A',
        class: 'artifacts_small'
      },
      {
        id: `metrics.${identifierUnique}`,
        header: 'Metrics',
        value: parseKeyValues(artifact.metrics),
        class: 'artifacts_big',
        type: 'metrics'
      },
      {
        id: `frameWorkAndAlgorithm.${identifierUnique}`,
        header: (
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
        class: 'artifacts_small'
      },
      {
        id: `version.${identifierUnique}`,
        value: artifact.tag,
        class: 'artifacts_small',
        type: 'hidden'
      },
      {
        id: `buttonPopout.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonPopout'
      },
      {
        id: `buttonDownload.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonDownload'
      },
      {
        id: `buttonCopy.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonCopyURI',
        actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab))
      }
    ]
  }
}

export const createFilesRowData = (artifact, project, showExpandButton) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`
  const identifierUnique = getArtifactIdentifier(artifact, true)

  return {
    data: {
      ...artifact,
      ui: {
        ...artifact.ui,
        identifier: getArtifactIdentifier(artifact),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Name',
        value: artifact.db_key,
        class: 'artifacts_medium',
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
          class: 'artifacts_medium',
          value: artifact.tag ? `${artifact.tag}${iter}` : `${truncateUid(artifact.tree)}${iter}`,
          tooltip: artifact.tag ? `${artifact.tag}${iter}` : `${artifact.tree}${iter}`
        },
        rowExpanded: {
          getLink: false
        },
        showExpandButton
      },
      {
        id: `version.${identifierUnique}`,
        value: artifact.tag,
        class: 'artifacts_small',
        type: 'hidden'
      },
      {
        id: `kind.${identifierUnique}`,
        header: 'Type',
        value: artifact.kind,
        class: 'artifacts_extra-small'
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(artifact.labels),
        class: 'artifacts_big',
        type: 'labels'
      },
      {
        id: `producer.${identifierUnique}`,
        header: 'Producer',
        value: artifact.producer || {},
        class: 'artifacts_small',
        type: 'producer'
      },
      {
        id: `owner.${identifierUnique}`,
        header: 'Owner',
        value: artifact.producer?.owner,
        class: 'artifacts_small',
        type: 'owner'
      },
      {
        id: `updated.${identifierUnique}`,
        header: 'Updated',
        value: artifact.updated ? formatDatetime(new Date(artifact.updated), 'N/A') : 'N/A',
        class: 'artifacts_small'
      },
      {
        id: `size.${identifierUnique}`,
        header: 'Size',
        value: artifact.size ? convertBytes(artifact.size) : 'N/A',
        class: 'artifacts_small'
      },
      {
        id: `buttonPopout.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonPopout'
      },
      {
        id: `buttonDownload.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonDownload'
      },
      {
        id: `buttonCopy.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonCopyURI',
        actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab ?? 'artifacts'))
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
  const averageLatency = artifact.status?.metrics?.latency_avg_1h?.values?.[0]?.[1]
  const identifierUnique = getArtifactIdentifier(artifact, true)

  return {
    data: {
      ...artifact,
      ui: {
        ...artifact.ui,
        identifier: getArtifactIdentifier(artifact),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Name',
        value: name,
        class: 'artifacts_medium',
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
        id: `functionName.${identifierUnique}`,
        header: 'Function',
        value: functionName,
        class: 'artifacts_small',
        link: `${generateLinkPath(functionUri)}/overview`,
        tooltip: functionUri
      },
      {
        id: `state.${identifierUnique}`,
        value: artifact.status?.state,
        class: 'artifacts_extra-small',
        type: 'hidden'
      },
      {
        id: `version.${identifierUnique}`,
        header: 'Version',
        value: artifact?.status?.children ? 'Router' : tag,
        class: 'artifacts_extra-small'
      },
      {
        id: `modelClass.${identifierUnique}`,
        header: 'Class',
        value: artifact.spec?.model_class,
        class: 'artifacts_small'
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(artifact.metadata?.labels),
        class: 'artifacts_big',
        type: 'labels'
      },
      {
        id: `firstRequest.${identifierUnique}`,
        header: 'Uptime',
        value: formatDatetime(new Date(artifact.status?.first_request), '-'),
        class: 'artifacts_small'
      },
      {
        id: `lastRequest.${identifierUnique}`,
        header: 'Last prediction',
        value: formatDatetime(new Date(artifact.status?.last_request), '-'),
        class: 'artifacts_small'
      },
      {
        id: `averageLatency.${identifierUnique}`,
        header: 'Average latency',
        value: averageLatency ? `${(averageLatency / 1000).toFixed(2)}ms` : '-',
        class: 'artifacts_small'
      },
      {
        id: `errorCount.${identifierUnique}`,
        header: 'Error count',
        value: artifact.status?.error_count ?? '-',
        class: 'artifacts_small'
      },
      {
        id: `driftStatus.${identifierUnique}`,
        header: 'Drift',
        value: driftStatusIcons[artifact.status?.drift_status]?.value,
        class: 'artifacts_extra-small',
        tooltip: driftStatusIcons[artifact.status?.drift_status]?.tooltip
      }
    ]
  }
}

export const createDatasetsRowData = (artifact, project, showExpandButton) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`
  const identifierUnique = getArtifactIdentifier(artifact, true)

  return {
    data: {
      ...artifact,
      ui: {
        ...artifact.ui,
        identifier: getArtifactIdentifier(artifact),
        identifierUnique: identifierUnique
      }
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        header: 'Name',
        value: artifact.db_key,
        class: 'artifacts_medium',
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
          class: 'artifacts_medium',
          value: artifact.tag ? `${artifact.tag}${iter}` : `${truncateUid(artifact.tree)}${iter}`,
          tooltip: artifact.tag ? `${artifact.tag}${iter}` : `${artifact.tree}${iter}`
        },
        rowExpanded: {
          getLink: false
        },
        showExpandButton
      },
      {
        id: `labels.${identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(artifact.labels),
        class: 'artifacts_big',
        type: 'labels'
      },
      {
        id: `producer.${identifierUnique}`,
        header: 'Producer',
        value: artifact.producer,
        class: 'artifacts_small',
        type: 'producer'
      },
      {
        id: `owner.${identifierUnique}`,
        header: 'Owner',
        value: artifact.producer?.owner,
        class: 'artifacts_small',
        type: 'owner'
      },
      {
        id: `updated.${identifierUnique}`,
        header: 'Updated',
        value: artifact.updated ? formatDatetime(new Date(artifact.updated), 'N/A') : 'N/A',
        class: 'artifacts_small'
      },
      {
        id: `size.${identifierUnique}`,
        header: 'Size',
        value: convertBytes(artifact.size || 0),
        class: 'artifacts_small'
      },
      {
        id: `version.${identifierUnique}`,
        value: artifact.tag,
        class: 'artifacts_small',
        type: 'hidden'
      },
      {
        id: `buttonPopout.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonPopout'
      },
      {
        id: `buttonDownload.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonDownload'
      },
      {
        id: `buttonCopy.${identifierUnique}`,
        value: '',
        class: 'artifacts_extra-small artifacts__icon',
        type: 'buttonCopyURI',
        actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab ?? DATASETS))
      }
    ]
  }
}

export default createArtifactsContent

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
import { Link } from 'react-router-dom'
import prettyBytes from 'pretty-bytes'

import CopyToClipboard from '../../common/CopyToClipboard/CopyToClipboard'
import Download from '../../common/Download/Download'
import { DATASETS_TAB, MODELS_TAB, TAG_FILTER_LATEST } from '../../constants'
import { RoundedIcon, TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import { formatDatetime, parseKeyValues } from '../../utils'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'
import { parseArtifacts } from '../../utils/parseArtifacts'

import { ReactComponent as DetailsIcon } from 'igz-controls/images/view-details.svg'

export const getJobAccordingIteration = selectedJob => {
  return {
    artifacts: selectedJob.status?.artifacts || [],
    startTime: new Date(selectedJob.status?.start_time),
    labels: parseKeyValues(selectedJob.metadata?.labels || {})
  }
}

export const generateArtifactsPreviewContent = selectedJob => {
  const parsedArtifacts = parseArtifacts(selectedJob.artifacts)

  if (!parsedArtifacts) return []

  return parsedArtifacts.map(artifact => {
    let generatedPreviewData = {
      preview: []
    }

    if (artifact.extra_data) {
      generatedPreviewData = generateArtifactPreviewData(artifact.extra_data)
    }

    artifact.preview = artifact.schema ? artifact.preview : generatedPreviewData.preview
    artifact.header = artifact.schema ? artifact.header : null

    artifact.ui = {
      ...artifact.ui,
      date: formatDatetime(selectedJob.startTime),
      size: artifact.size ? prettyBytes(artifact.size) : 'N/A',
      user: selectedJob?.labels
        ?.find(item => item.match(/v3io_user|owner/g))
        ?.replace(/(v3io_user|owner): /, '')
    }

    return artifact
  })
}

export const generateArtifactsTabContent = (artifacts, params, iteration, showArtifact) => {
  return artifacts.map((artifact, index) => {
    const artifactScreenLinks = {
      model: `/projects/${params.projectName}/models/${MODELS_TAB}/${
        artifact.db_key || artifact.key
      }/${artifact.tag ? artifact.tag : artifact.tree ?? TAG_FILTER_LATEST}${
        iteration ? `/${iteration}` : ''
      }/overview`,
      dataset: `/projects/${params.projectName}/${DATASETS_TAB}/${artifact.db_key || artifact.key}/${
        artifact.tag ? artifact.tag : artifact.tree ?? TAG_FILTER_LATEST
      }${iteration ? `/${iteration}` : ''}/overview`
    }

    return [
      {
        headerId: 'name',
        headerLabel: 'Name',
        template: (
          <Tooltip template={<TextTooltipTemplate text={artifact.db_key || artifact.key} />}>
            <span className="link" onClick={() => showArtifact(artifact?.ui?.identifierUnique)}>
              {artifact.db_key || artifact.key}
            </span>
          </Tooltip>
        ),
        value: artifact.db_key || artifact.key,
        className: 'table-cell-3',
        artifact
      },
      {
        headerId: 'path',
        headerLabel: 'Path',
        value: artifact.target_path,
        className: 'table-cell-6'
      },
      {
        headerId: 'size',
        headerLabel: 'Size',
        value: artifact.ui.size
      },
      {
        headerId: 'updated',
        headerLabel: 'Updated',
        value: artifact.ui.date,
        className: 'table-cell-2'
      },
      {
        headerId: 'actions',
        headerLabel: '',
        className: 'actions-cell',
        template: (
          <>
            <CopyToClipboard textToCopy={artifact.target_path} tooltipText="Copy path" />
            <RoundedIcon tooltipText="Show Details" id="show-details">
              <Link
                target="_blank"
                to={
                  artifactScreenLinks[artifact.kind] ??
                  `/projects/${params.projectName}/files/${artifact.db_key || artifact.key}/${
                    artifact.tag ? artifact.tag : artifact.tree ?? TAG_FILTER_LATEST
                  }${iteration ? `/${iteration}` : ''}/overview`
                }
              >
                <DetailsIcon />
              </Link>
            </RoundedIcon>
            <Download
              className="icon-download"
              onlyIcon
              path={artifact.target_path}
              user={artifact.ui.user}
            />
          </>
        )
      }
    ]
  })
}

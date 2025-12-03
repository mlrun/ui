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
import prettyBytes from 'pretty-bytes'

import { RoundedIcon, TextTooltipTemplate, Tooltip, CopyToClipboard } from 'igz-controls/components'
import Download from '../../common/Download/Download'
import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'

import { openPopUp } from 'igz-controls/utils/common.util'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import { parseArtifacts } from '../../utils/parseArtifacts'
import { parseChipsData } from '../../utils/convertChipsData'

import DetailsIcon from 'igz-controls/images/view-details.svg?react'

export const getJobAccordingIteration = selectedJob => {
  return {
    artifacts: parseArtifacts(selectedJob?.status?.artifacts || []),
    startTime: new Date(selectedJob?.status?.start_time),
    labels: parseChipsData(selectedJob?.metadata?.labels || {})
  }
}

export const generateArtifactsPreviewContent = (selectedJob, artifacts) => {
  return artifacts.map(artifact => {
    const generatedArtifact = { ...artifact }
    let generatedPreviewData = {
      preview: []
    }

    if (generatedArtifact.extra_data) {
      generatedPreviewData.preview = generatedArtifact.extra_data
    }

    generatedArtifact.preview = generatedArtifact.schema
      ? generatedArtifact.preview
      : generatedPreviewData.preview
    generatedArtifact.header = generatedArtifact.schema ? generatedArtifact.header : null

    generatedArtifact.ui = {
      ...artifact.ui,
      date: formatDatetime(selectedJob.startTime),
      size: artifact.size ? prettyBytes(artifact.size) : 'N/A',
      user: selectedJob?.labels
        ?.find(item => item.key.match(/v3io_user|owner/))
        ?.key.replace(/(v3io_user|owner): /, '')
    }

    return generatedArtifact
  })
}

export const generateArtifactsTabContent = (
  artifacts,
  params,
  iteration,
  showArtifact,
  isDetailsPopUp = false
) => {
  const handleOpenArtifactPopUp = artifact => {
    const artifactData = {
      kind: artifact.kind,
      project: artifact.project || params.projectName,
      key: artifact.db_key || artifact.key,
      iteration,
      uid: artifact.tree,
      tag: artifact.tag
    }

    openPopUp(ArtifactPopUp, {
      artifactData
    })
  }

  return artifacts.map(artifact => {
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
            {!isDetailsPopUp && (
              <RoundedIcon
                tooltipText="Show Details"
                id="show-details"
                onClick={() => handleOpenArtifactPopUp(artifact)}
              >
                <DetailsIcon />
              </RoundedIcon>
            )}
            <Download
              className="icon-download"
              fileSize={artifact.size}
              onlyIcon
              path={artifact.target_path}
              projectName={params.projectName || artifact.project}
              user={artifact.ui.user}
            />
          </>
        )
      }
    ]
  })
}

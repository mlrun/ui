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
import classNames from 'classnames'

import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'
import { TextTooltipTemplate, Tooltip, ReadOnlyChips } from 'igz-controls/components'

import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData } from '../../utils/convertChipsData'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import JobPopUp from '../../elements/DetailsPopUp/JobPopUp/JobPopUp'
import { FORCE_REFRESH, LLM_PROMPTS_PAGE, MODEL_NAME_FILTER } from '../../constants'

export const LLM_PROMPTS_DISPLAY_LIMIT = 100

export const generateLLMPromptsTabContent = (artifacts, params, isDetailsPopUp = false) => {
  const handleOpenArtifactPopUp = artifact => {
    const artifactData = {
      kind: artifact.kind,
      project: artifact.project || params.projectName,
      key: artifact.db_key || artifact.key,
      uid: artifact.tree,
      tag: artifact.tag
    }

    openPopUp(ArtifactPopUp, {
      artifactData
    })
  }
  const handleOpenJobsPopUp = producer => {
    // producer uri is in the form of: project/uid-iteration
    const [project, rest] = producer.uri.split('/')
    const [uid, iter] = rest?.split('-') ?? []

    const jobData = {
      project,
      uid,
      iter
    }

    openPopUp(JobPopUp, { jobData })
  }

  return artifacts.map(artifact => {
    const parsedChips = parseChipsData(artifact.labels)
    const producerIsActive = artifact.producer.name !== 'UI' && !isDetailsPopUp

    return [
      {
        headerId: 'name',
        headerLabel: 'LLM prompt name',
        template: (
          <div className="name-wrapper">
            <div
              className={classNames(!isDetailsPopUp && 'link', 'data-ellipsis')}
              onClick={!isDetailsPopUp ? () => handleOpenArtifactPopUp(artifact) : null}
            >
              <Tooltip template={<TextTooltipTemplate text={artifact.db_key || artifact.key} />}>
                {artifact.db_key || artifact.key}
              </Tooltip>
            </div>
            <Tooltip
              className="item-tag"
              template={<TextTooltipTemplate text={artifact.tag ?? ''} />}
            >
              <span className="link-subtext">{artifact.tag ?? ''}</span>
            </Tooltip>
          </div>
        ),
        value: artifact.db_key || artifact.key,
        className: 'table-cell-3'
      },
      {
        headerId: 'updated',
        headerLabel: 'Updated',
        value: formatDatetime(artifact.updated, 'N/A'),
        className: 'table-cell-3'
      },
      {
        headerId: 'labels',
        headerLabel: 'Labels',
        template: <ReadOnlyChips labels={parsedChips} shortChips />,
        className: 'table-cell-3'
      },
      {
        headerId: 'producer',
        headerLabel: 'Producer',
        template: (
          <Tooltip template={<TextTooltipTemplate text={artifact.producer?.name ?? ''} />}>
            <span
              className={classNames(producerIsActive && 'link')}
              onClick={producerIsActive ? () => handleOpenJobsPopUp(artifact.producer) : null}
            >
              {artifact.producer?.name ?? ''}
            </span>
          </Tooltip>
        ),
        className: 'table-cell-3'
      },
      {
        headerId: 'owner',
        headerLabel: 'Owner',
        value: artifact.producer?.owner ?? '',
        className: 'table-cell-2'
      }
    ]
  })
}

export const navigateToLLMPromptsPage = (navigate, projectName, selectedItem, handleCancel) => {
  const filters = {
    [MODEL_NAME_FILTER]: selectedItem.db_key || selectedItem.key,
    [FORCE_REFRESH]: true
  }

  navigate(`/projects/${projectName}/${LLM_PROMPTS_PAGE}?${new URLSearchParams(filters)}`, true)
  handleCancel?.()
}

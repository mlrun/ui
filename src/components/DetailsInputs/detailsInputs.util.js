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
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import CopyToClipboard from '../../common/CopyToClipboard/CopyToClipboard'
import { RoundedIcon, TextTooltipTemplate, Tooltip } from 'igz-controls/components'

import { DATASETS_TAB, FILES_TAB, MODELS_TAB, TAG_FILTER_LATEST } from '../../constants'

import { ReactComponent as DetailsIcon } from 'igz-controls/images/view-details.svg'

export const generateArtifactLink = (artifact, projectName) => {
  const artifactLinks = {
    model: `/projects/${projectName}/models/${MODELS_TAB}/${
      artifact.db_key || artifact.key
    }/${TAG_FILTER_LATEST}${artifact.iter ? `/${artifact.iter}` : ''}/overview`,
    dataset: `/projects/${projectName}/${DATASETS_TAB}/${
      artifact.db_key || artifact.key
    }/${TAG_FILTER_LATEST}${artifact.iter ? `/${artifact.iter}` : ''}/overview`,
    files: `/projects/${projectName}/${FILES_TAB}/${artifact.db_key || artifact.key}/${TAG_FILTER_LATEST}${
      artifact.iter ? `/${artifact.iter}` : ''
    }/overview`
  }

  return artifact ? artifactLinks[artifact.kind] ?? artifactLinks.files : ''
}

export const generateInputsTabContent = (artifacts, showArtifact) => {
  return artifacts.map(artifact => {
    const keyClassNames = classnames(artifact.ui.isPreviewable && 'link')

    return [
      {
        headerId: 'name',
        headerLabel: 'Name',
        className: 'table-cell-3',
        template: (
          <Tooltip template={<TextTooltipTemplate text={artifact.ui.inputName} />}>
            <span
              className={keyClassNames}
              onClick={() => artifact.ui.isPreviewable && showArtifact(artifact.uid)}
            >
              {artifact.ui.inputName}
            </span>
          </Tooltip>
        ),
        artifact
      },
      {
        headerId: 'path',
        headerLabel: 'Path',
        className: 'table-cell-8',
        value: artifact.ui.inputPath
      },
      {
        headerId: 'actions',
        headerLabel: '',
        className: 'actions-cell',
        hidden: !artifact.ui.isPreviewable,
        template: (
          <>
            <CopyToClipboard textToCopy={artifact.ui.inputPath} tooltipText="Copy path" />
            <RoundedIcon tooltipText="Show Details" id="show-details">
              <Link target="_blank" to={artifact.ui.artifactLink}>
                <DetailsIcon />
              </Link>
            </RoundedIcon>
          </>
        )
      }
    ]
  })
}

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
import classnames from 'classnames'

import CopyToClipboard from '../../common/CopyToClipboard/CopyToClipboard'
import { RoundedIcon, TextTooltipTemplate, Tooltip } from 'igz-controls/components'
import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'
import FeatureVectorPopUp from '../../elements/DetailsPopUp/FeatureVectorPopUp/FeatureVectorPopUp'

import { openPopUp } from 'igz-controls/utils/common.util'
import { parseUri } from '../../utils'
import { ReactComponent as DetailsIcon } from 'igz-controls/images/view-details.svg'
import { FEATURE_VECTORS_TAB } from '../../constants'

export const FEATURE_VECTORS_KIND = 'feature-vectors'

export const generateInputsTabContent = (
  inputs,
  showArtifact,
  isDetailsPopUp = false
) => {
  const handleOpenInputPopUp = inputPath => {
    const inputUri = parseUri(inputPath)

    if (inputUri.kind === FEATURE_VECTORS_TAB) {
      openPopUp(FeatureVectorPopUp, {
        featureVectorData: inputUri
      })
    } else {
      openPopUp(ArtifactPopUp, {
        artifactData: inputUri
      })
    }
  }

  return inputs.map(input => {
    const keyClassNames = classnames(input.ui.isPreviewable && 'link')

    return [
      {
        headerId: 'name',
        headerLabel: 'Name',
        className: 'table-cell-3',
        template: (
          <Tooltip template={<TextTooltipTemplate text={input.ui.inputName} />}>
            <span
              className={keyClassNames}
              onClick={() => input.ui.isPreviewable && showArtifact(input.uid)}
            >
              {input.ui.inputName}
            </span>
          </Tooltip>
        ),
        artifact: input.ui.isPreviewable && input
      },
      {
        headerId: 'path',
        headerLabel: 'Path',
        className: 'table-cell-8',
        value: input.ui.inputPath
      },
      {
        headerId: 'actions',
        headerLabel: '',
        className: 'actions-cell',
        template: (
          <>
            <CopyToClipboard textToCopy={input.ui.inputPath} tooltipText="Copy path" />
            {!isDetailsPopUp && (
              <RoundedIcon
                tooltipText="Show Details"
                id="show-details"
                disabled={!input.ui.isShowDetailsActive}
                onClick={() => handleOpenInputPopUp(input.ui.inputPath)}
              >
                <DetailsIcon />
              </RoundedIcon>
            )}
          </>
        )
      }
    ]
  })
}

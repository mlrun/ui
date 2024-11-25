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
import PropTypes from 'prop-types'

import FeatureVectorPopUp from '../../elements/DetailsPopUp/FeatureVectorPopUp/FeatureVectorPopUp'
import ArtifactPopUp from '../../elements/DetailsPopUp/ArtifactPopUp/ArtifactPopUp'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { openPopUp } from 'igz-controls/utils/common.util'
import { FEATURE_VECTORS_TAB } from '../../constants'

import './artifactInfoSources.scss'

const ArtifactInfoSources = ({ isDetailsPopUp = false, sources = {} }) => {
  const handleOpenSourceDetails = sourceData => {
    if (sourceData.parsedUri.kind === FEATURE_VECTORS_TAB) {
      openPopUp(FeatureVectorPopUp, {
        featureVectorData: sourceData.parsedUri
      })
    } else {
      openPopUp(ArtifactPopUp, {
        artifactData: sourceData.parsedUri
      })
    }
  }

  return (
    <div className="info-sources" data-testid="sources">
      <h3 className="item-info__header">Sources</h3>
      {Object.entries(sources).map(([key, sourceData], index) => (
        <div className="info-sources__table" key={key + sourceData.value}>
          <h5 className="info-sources__table-header">Source {index + 1}</h5>
          <div className="info-sources__table-row">
            <div className="info-sources__table-key">Name:</div>
            <div className="info-sources__table-value">
              <Tooltip template={<TextTooltipTemplate text={key} />}>{key}</Tooltip>
            </div>
          </div>
          <div className="info-sources__table-row">
            <div className="info-sources__table-key">Path:</div>
            <div className="info-sources__table-value">
              <Tooltip template={<TextTooltipTemplate text={sourceData.value} />}>
                {sourceData && !isDetailsPopUp ? (
                  <div onClick={() => handleOpenSourceDetails(sourceData)} className="link">
                    {sourceData.value}
                  </div>
                ) : (
                  sourceData.value
                )}
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

ArtifactInfoSources.propTypes = {
  sources: PropTypes.shape({}).isRequired
}

export default ArtifactInfoSources

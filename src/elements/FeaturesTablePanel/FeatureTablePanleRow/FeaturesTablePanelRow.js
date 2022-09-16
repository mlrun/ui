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
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Target } from 'igz-controls/images/ic_target-with-dart.svg'
import { ReactComponent as CrossedTarget } from 'igz-controls/images/ic_target-with-arrow-unset.svg'

import './featuresTablePanelRow.scss'

const FeaturesTablePanelRow = ({
  deleteFeature,
  feature,
  isEditEnabled,
  labelFeature,
  toggleLabelFeature
}) => {
  const featureRowClassNames = classnames(
    'feature-row',
    (labelFeature === feature.feature ||
      labelFeature === feature.originalTemplate) &&
      'selected-feature',
    labelFeature && 'selected-feature-exists'
  )
  const actionClassNames = classnames(!isEditEnabled && 'readonly')
  const actionBlockClassNames = classnames(
    'label-actions',
    isEditEnabled && 'with-hover'
  )
  const featureTemplate = (
    <span>
      <span>{feature.featureSet}</span>
      {feature.tag && <span>&nbsp;:&nbsp;{feature.tag}</span>}
      <span>&nbsp;#{feature.feature}</span>
      {feature.alias && (
        <span>
          <span>&nbsp;as&nbsp;</span>
          {feature.alias}
        </span>
      )}
    </span>
  )

  return (
    <div className={featureRowClassNames} key={feature.feature}>
      <div className="feature-row__feature-template data-ellipsis">
        <Tooltip
          className="data-ellipsis"
          template={<TextTooltipTemplate text={featureTemplate} />}
        >
          {featureTemplate}
        </Tooltip>
      </div>
      <div className="feature-row__actions">
        <div className={actionBlockClassNames}>
          <Tooltip
            hidden={labelFeature.length > 0 || !isEditEnabled}
            template={<TextTooltipTemplate text="Set as label" />}
          >
            <Target
              className={`action set-as-label ${actionClassNames}`}
              onClick={() =>
                isEditEnabled && toggleLabelFeature(feature.originalTemplate)
              }
            />
          </Tooltip>
          <Tooltip template={<TextTooltipTemplate text="Unset as label" />}>
            <CrossedTarget
              className={`action unset-as-label ${actionClassNames}`}
              onClick={() => isEditEnabled && toggleLabelFeature(labelFeature)}
            />
          </Tooltip>
        </div>
        <Tooltip
          hidden={!isEditEnabled}
          template={<TextTooltipTemplate text="Remove from vector" />}
        >
          <Delete
            className={`action remove ${actionClassNames}`}
            onClick={() => {
              if (isEditEnabled) {
                if (
                  labelFeature === feature.feature ||
                  labelFeature === feature.originalTemplate
                ) {
                  toggleLabelFeature(labelFeature)
                }

                deleteFeature(feature.originalTemplate)
              }
            }}
          />
        </Tooltip>
      </div>
    </div>
  )
}

FeaturesTablePanelRow.propTypes = {
  deleteFeature: PropTypes.func.isRequired,
  feature: PropTypes.shape({}).isRequired,
  isEditEnabled: PropTypes.bool.isRequired,
  labelFeature: PropTypes.string.isRequired,
  toggleLabelFeature: PropTypes.func.isRequired
}

export default FeaturesTablePanelRow

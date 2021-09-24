import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Delete } from '../../../images/delete.svg'
import { ReactComponent as Target } from '../../../images/ic_target-with-dart.svg'
import { ReactComponent as CrossedTarget } from '../../../images/ic_target-with-arrow-unset.svg'

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
        <div className="label-actions">
          <Tooltip
            hidden={labelFeature.length > 0}
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
        <Tooltip template={<TextTooltipTemplate text="Remove from vector" />}>
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

                deleteFeature(feature.feature)
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

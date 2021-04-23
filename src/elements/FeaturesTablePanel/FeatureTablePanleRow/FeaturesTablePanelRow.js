import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

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
  const actionClassNames = classnames(!isEditEnabled && 'readonly')

  return (
    <div className="feature-row" key={feature.feature}>
      <div className="feature-row__feature-template">
        <span className="feature-row__feature-set">{feature.featureSet}</span>
        {feature.tag && (
          <span className="feature-row__feature-set-tag">
            &nbsp;:&nbsp;{feature.tag}
          </span>
        )}
        <span className="feature-row__feature-name">
          &nbsp;#{feature.feature}
        </span>
        {feature.alias && (
          <span className="feature-row__feature-alias">
            <span className="feature-row__feature-alias-preposition">
              &nbsp;as&nbsp;
            </span>
            {feature.alias}
          </span>
        )}
      </div>
      <div className="feature-row__actions">
        {!labelFeature && (
          <div className={`action set-as-label ${actionClassNames}`}>
            <Target
              onClick={() =>
                isEditEnabled && toggleLabelFeature(feature.originalTemplate)
              }
            />
          </div>
        )}
        {labelFeature === feature.feature ||
          (labelFeature === feature.originalTemplate && (
            <div className={`action unset-as-label ${actionClassNames}`}>
              <CrossedTarget
                onClick={() =>
                  isEditEnabled && toggleLabelFeature(feature.feature)
                }
              />
            </div>
          ))}
        <div className={`action remove ${actionClassNames}`}>
          <Delete
            onClick={() => isEditEnabled && deleteFeature(feature.feature)}
          />
        </div>
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

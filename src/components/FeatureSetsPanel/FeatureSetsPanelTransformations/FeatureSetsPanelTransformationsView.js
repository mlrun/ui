import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import RadioButtons from '../../../common/RadioButtons/RadioButtons'

import { transformationsOptions } from './featureSetsPanelTransformations.util'

import './featureSetsPanelTransformations.scss'

const FeatureSetsPanelTransformationsView = ({
  setTransformationsValue,
  transformationsValue
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item transformations">
      <FeatureSetsPanelSection title="Transformations">
        <RadioButtons
          elements={transformationsOptions}
          selectedValue={transformationsValue}
          onChangeCallback={setTransformationsValue}
        />
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelTransformationsView.propTypes = {
  setTransformationsValue: PropTypes.func.isRequired,
  transformationsValue: PropTypes.string.isRequired
}

export default FeatureSetsPanelTransformationsView

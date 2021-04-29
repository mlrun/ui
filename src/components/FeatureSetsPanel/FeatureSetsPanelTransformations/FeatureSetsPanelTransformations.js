import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelTransformationsView from './FeatureSetsPanelTransformationsView'

const FeatureSetsPanelTransformations = ({
  setTransformationsValue,
  transformationsValue
}) => {
  return (
    <FeatureSetsPanelTransformationsView
      setTransformationsValue={setTransformationsValue}
      transformationsValue={transformationsValue}
    />
  )
}

FeatureSetsPanelTransformations.propTypes = {
  setTransformationsValue: PropTypes.func.isRequired,
  transformationsValue: PropTypes.string.isRequired
}

export default FeatureSetsPanelTransformations

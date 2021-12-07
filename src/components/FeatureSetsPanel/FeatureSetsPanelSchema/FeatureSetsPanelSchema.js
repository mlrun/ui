import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FeatureSetsPanelSchemaView from './FeatureSetsPanelSchemaView'

import featureStoreActions from '../../../actions/featureStore'

const FeatureSetsPanelSchema = ({
  featureStore,
  setNewFeatureSetDataSourceEntities,
  setNewFeatureSetSchemaTimestampKey,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    entities: '',
    timestamp_key: ''
  })

  const handleEntitiesOnBlur = event => {
    const entitiesArray = data.entities
      .trim()
      .split(/[, ]+/)
      .map(entity => ({
        name: entity,
        value_type: 'str'
      }))
      .filter(item => item.name)

    if (
      data.entities.length > 0 &&
      JSON.stringify(entitiesArray) !==
        JSON.stringify(featureStore.newFeatureSet.spec.entities)
    ) {
      setNewFeatureSetDataSourceEntities(entitiesArray)
      setValidation(prevState => ({
        ...prevState,
        isEntitiesValid: true
      }))
    } else if (
      data.entities.length === 0 &&
      featureStore.newFeatureSet.spec.entities.length > 0
    ) {
      setNewFeatureSetDataSourceEntities([])
    }
  }

  const handleEntitiesOnChange = entities => {
    if (!validation.isEntitiesValid && entities.length > 0) {
      setValidation(prevState => ({
        ...prevState,
        isEntitiesValid: true
      }))
    }

    setData(state => ({
      ...state,
      entities
    }))
  }

  return (
    <FeatureSetsPanelSchemaView
      data={data}
      featureStore={featureStore}
      handleEntitiesOnBlur={handleEntitiesOnBlur}
      handleEntitiesOnChange={handleEntitiesOnChange}
      setData={setData}
      setNewFeatureSetSchemaTimestampKey={setNewFeatureSetSchemaTimestampKey}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FeatureSetsPanelSchema.propTypes = {
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(FeatureSetsPanelSchema)

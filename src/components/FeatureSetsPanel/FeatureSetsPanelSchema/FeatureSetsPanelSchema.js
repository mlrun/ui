import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FeatureSetsPanelSchemaView from './FeatureSetsPanelSchemaView'

import featureStoreActions from '../../../actions/featureStore'

const FeatureSetsPanelSchema = ({
  featureStore,
  isEntitiesValid,
  setNewFeatureSetDataSourceEntities,
  setNewFeatureSetSchemaTimestampKey,
  setEntitiesValid
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
      setEntitiesValid(prevState => ({
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
    if (!isEntitiesValid && entities.length > 0) {
      setEntitiesValid(prevState => ({
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
      isEntitiesValid={isEntitiesValid}
      setData={setData}
      setEntitiesValid={setEntitiesValid}
      setNewFeatureSetSchemaTimestampKey={setNewFeatureSetSchemaTimestampKey}
    />
  )
}

FeatureSetsPanelSchema.propTypes = {
  isEntitiesValid: PropTypes.bool.isRequired,
  setEntitiesValid: PropTypes.func.isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(FeatureSetsPanelSchema)

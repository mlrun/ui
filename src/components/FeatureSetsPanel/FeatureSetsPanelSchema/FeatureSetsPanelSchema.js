import React, { useState } from 'react'
import { connect } from 'react-redux'

import FeatureSetsPanelSchemaView from './FeatureSetsPanelSchemaView'

import featureStoreActions from '../../../actions/featureStore'

const FeatureSetsPanelSchema = ({
  featureStore,
  setNewFeatureSetDataSourceEntities,
  setNewFeatureSetSchemaTimestampKey
}) => {
  const [data, setData] = useState({
    entities: '',
    timestamp_key: ''
  })

  const handleEntitiesOnBlur = () => {
    const entitiesArray = data.entities
      .split(',')
      .map(entity => ({ name: entity, value_type: 'str' }))

    if (
      data.entities.length > 0 &&
      JSON.stringify(entitiesArray) !==
        JSON.stringify(featureStore.newFeatureSet.spec.entities)
    ) {
      setNewFeatureSetDataSourceEntities(entitiesArray)
    } else if (
      data.entities.length === 0 &&
      featureStore.newFeatureSet.spec.entities.length > 0
    ) {
      setNewFeatureSetDataSourceEntities([])
    }
  }

  return (
    <FeatureSetsPanelSchemaView
      data={data}
      featureStore={featureStore}
      handleEntitiesOnBlur={handleEntitiesOnBlur}
      setData={setData}
      setNewFeatureSetSchemaTimestampKey={setNewFeatureSetSchemaTimestampKey}
    />
  )
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(FeatureSetsPanelSchema)

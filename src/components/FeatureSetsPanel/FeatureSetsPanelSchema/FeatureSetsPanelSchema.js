import React, { useState } from 'react'
import { connect } from 'react-redux'

import FeatureSetsPanelSchemaView from './FeatureSetsPanelSchemaView'

import artifactsAction from '../../../actions/artifacts'

const FeatureSetsPanelSchema = ({
  artifactsStore,
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
        JSON.stringify(artifactsStore.newFeatureSet.spec.entities)
    ) {
      setNewFeatureSetDataSourceEntities(entitiesArray)
    } else if (
      data.entities.length === 0 &&
      artifactsStore.newFeatureSet.spec.entities.length > 0
    ) {
      setNewFeatureSetDataSourceEntities([])
    }
  }

  return (
    <FeatureSetsPanelSchemaView
      data={data}
      handleEntitiesOnBlur={handleEntitiesOnBlur}
      setData={setData}
      setNewFeatureSetSchemaTimestampKey={setNewFeatureSetSchemaTimestampKey}
    />
  )
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelSchema)

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
    entities: [],
    newEntity: {
      name: '',
      value_type: 'str'
    },
    timestamp_key: ''
  })
  const [isEntityNameValid, setEntityNameValid] = useState(true)
  const [addNewItem, setAddNewItem] = useState(false)

  const handleAddNewItem = () => {
    if (data.newEntity.name.length > 0 && nameNotValid(data.newEntity.name)) {
      return setEntityNameValid(false)
    } else if (data.newEntity.name.length > 0) {
      setNewFeatureSetDataSourceEntities([
        ...artifactsStore.newFeatureSet.spec.entities,
        { ...data.newEntity }
      ])
      setData(state => ({
        ...state,
        entities: [
          ...state.entities,
          {
            data: state.newEntity
          }
        ]
      }))
    }

    setData(state => ({
      ...state,
      newEntity: { name: '', value_type: '' }
    }))
    setAddNewItem(false)
    setEntityNameValid(true)
  }

  const handleDeleteEntity = selectedEntity => {
    setNewFeatureSetDataSourceEntities(
      artifactsStore.newFeatureSet.spec.entities.filter(
        entity => entity.name !== selectedEntity.data.name
      )
    )
    setData(state => ({
      ...state,
      entities: state.entities.filter(
        entity => entity.data.name !== selectedEntity.data.name
      )
    }))
  }

  const nameNotValid = name => {
    return data.entities.some(entity => entity.data.name === name)
  }

  return (
    <FeatureSetsPanelSchemaView
      addNewItem={addNewItem}
      data={data}
      isEntityNameValid={isEntityNameValid}
      handleAddNewItem={handleAddNewItem}
      handleDeleteEntity={handleDeleteEntity}
      setAddNewItem={setAddNewItem}
      setData={setData}
      setNewFeatureSetSchemaTimestampKey={setNewFeatureSetSchemaTimestampKey}
    />
  )
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelSchema)

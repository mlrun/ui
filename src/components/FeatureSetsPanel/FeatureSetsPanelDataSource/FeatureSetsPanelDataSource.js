import React, { useState } from 'react'
import { connect } from 'react-redux'

import FeatureSetsPanelDataSourceView from './FeatureSetsPanelDataSourceView'

import artifactsAction from '../../../actions/artifacts'

const FeatureSetsPanelDataSource = ({
  artifactsStore,
  isUrlValid,
  setNewFeatureSetDataSourceAttributes,
  setNewFeatureSetDataSourceKey,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceTime,
  setNewFeatureSetDataSourceUrl,
  setNewFeatureSetSchedule,
  setUrlValid
}) => {
  const [data, setData] = useState({
    kind: 'csv',
    url: '',
    attributes: [],
    schedule: ''
  })
  const [showSchedule, setShowSchedule] = useState(false)

  const handleAddNewItem = attribute => {
    setNewFeatureSetDataSourceAttributes({
      ...artifactsStore.newFeatureSet.spec.source.attribute,
      [attribute.key]: attribute.value
    })
    setData(state => ({
      ...state,
      attributes: [...state.attributes, attribute]
    }))
  }

  const handleDeleteAttribute = (index, attribute) => {
    const storeAttributes = {
      ...artifactsStore.newFeatureSet.spec.source.attribute
    }

    delete storeAttributes[attribute.key]
    setNewFeatureSetDataSourceAttributes(storeAttributes)
    setData(state => ({
      ...state,
      attributes: state.attributes.filter(attr => attr.key !== attribute.key)
    }))
  }

  const handleEditAttribute = attribute => {
    const storeAttributes = {
      ...artifactsStore.newFeatureSet.spec.source.attribute
    }

    if (attribute.newKey) {
      delete storeAttributes[attribute.key]
      storeAttributes[attribute.newKey] = attribute.value
    } else {
      storeAttributes[attribute.key] = attribute.value
    }

    setNewFeatureSetDataSourceAttributes(storeAttributes)
    setData(state => ({
      ...state,
      attributes: state.attributes.map(attr => {
        if (attr.key === attribute.key) {
          attr.key = attribute.newKey ?? attribute.key
          attr.value = attribute.value
        }

        return attr
      })
    }))
  }

  const handleKindOnChange = kind => {
    setNewFeatureSetDataSourceKind(kind)
    setNewFeatureSetDataSourceAttributes({
      time_field: '',
      start_time: '',
      end_time: ''
    })
    setData(state => ({
      ...state,
      kind,
      attributes:
        kind === 'parquet'
          ? [
              {
                data: {
                  key: 'time_field',
                  value: ''
                }
              },
              {
                data: {
                  key: 'start_time',
                  value: ''
                }
              },
              {
                data: {
                  key: 'end_time',
                  value: ''
                }
              }
            ]
          : []
    }))
  }

  const handleUrlOnBlur = event => {
    if (event.target.value.length === 0) {
      setUrlValid(false)
    } else {
      setNewFeatureSetDataSourceUrl(event.target.value)
    }
  }

  const handleUrlOnChange = url => {
    if (!isUrlValid && url.length > 0) {
      setUrlValid(true)
    }

    setData(state => ({
      ...state,
      url
    }))
  }

  return (
    <FeatureSetsPanelDataSourceView
      data={data}
      handleAddNewItem={handleAddNewItem}
      handleDeleteAttribute={handleDeleteAttribute}
      handleEditAttribute={handleEditAttribute}
      handleKindOnChange={handleKindOnChange}
      handleUrlOnBlur={handleUrlOnBlur}
      handleUrlOnChange={handleUrlOnChange}
      isUrlValid={isUrlValid}
      setData={setData}
      setNewFeatureSetDataSourceAttributes={
        setNewFeatureSetDataSourceAttributes
      }
      setNewFeatureSetDataSourceKey={setNewFeatureSetDataSourceKey}
      setNewFeatureSetDataSourceKind={setNewFeatureSetDataSourceKind}
      setNewFeatureSetDataSourceTime={setNewFeatureSetDataSourceTime}
      setShowSchedule={setShowSchedule}
      showSchedule={showSchedule}
      setNewFeatureSetSchedule={setNewFeatureSetSchedule}
    />
  )
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelDataSource)

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
    newAttribute: {
      key: '',
      value: ''
    },
    schedule: ''
  })
  const [isAttributeNameValid, setAttributeNameValid] = useState(true)
  const [addNewItem, setAddNewItem] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const handleAddNewItem = () => {
    if (
      data.newAttribute.key.length > 0 &&
      nameNotValid(data.newAttribute.key)
    ) {
      return setAttributeNameValid(false)
    } else if (data.newAttribute.key.length > 0) {
      setNewFeatureSetDataSourceAttributes({
        ...artifactsStore.newFeatureSet.spec.source.attribute,
        [data.newAttribute.key]: data.newAttribute.value
      })
      setData(state => ({
        ...state,
        attributes: [
          ...state.attributes,
          {
            data: state.newAttribute
          }
        ]
      }))
    }

    setData(state => ({
      ...state,
      newAttribute: { key: '', value: '' }
    }))
    setAddNewItem(false)
    setAttributeNameValid(true)
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

  const nameNotValid = name => {
    return data.attributes.some(attribute => attribute.data.name === name)
  }

  return (
    <FeatureSetsPanelDataSourceView
      addNewItem={addNewItem}
      data={data}
      handleAddNewItem={handleAddNewItem}
      handleKindOnChange={handleKindOnChange}
      handleUrlOnBlur={handleUrlOnBlur}
      handleUrlOnChange={handleUrlOnChange}
      isAttributeNameValid={isAttributeNameValid}
      isUrlValid={isUrlValid}
      setAddNewItem={setAddNewItem}
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

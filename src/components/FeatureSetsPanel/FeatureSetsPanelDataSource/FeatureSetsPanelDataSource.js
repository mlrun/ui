import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
    kind: 'http',
    url: '',
    key: '',
    time: '',
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

  const nameNotValid = name => {
    return data.attributes.some(attribute => attribute.data.name === name)
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
      addNewItem={addNewItem}
      data={data}
      handleAddNewItem={handleAddNewItem}
      handleUrlOnBlur={handleUrlOnBlur}
      handleUrlOnChange={handleUrlOnChange}
      isAttributeNameValid={isAttributeNameValid}
      isUrlValid={isUrlValid}
      setAddNewItem={setAddNewItem}
      setData={setData}
      setNewFeatureSetDataSourceKey={setNewFeatureSetDataSourceKey}
      setNewFeatureSetDataSourceKind={setNewFeatureSetDataSourceKind}
      setNewFeatureSetDataSourceTime={setNewFeatureSetDataSourceTime}
      setShowSchedule={setShowSchedule}
      showSchedule={showSchedule}
      setNewFeatureSetSchedule={setNewFeatureSetSchedule}
    />
  )
}

FeatureSetsPanelDataSource.propTypes = {
  isUrlValid: PropTypes.bool.isRequired,
  setUrlValid: PropTypes.func.isRequired
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelDataSource)

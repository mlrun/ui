import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isNil } from 'lodash'

import DetailsRequestedFeaturesView from './DetailsRequestedFeaturesView'

import { handleFinishEdit } from '../Details/details.util.js'
import {
  detailsRequestedFeaturesActions,
  detailsRequestedFeaturesReducer,
  initialState
} from './detailsRequestedFeaturesReducer.js'

const DetailsRequestedFeatures = ({
  changes,
  handleEditInput,
  selectedItem,
  setChanges,
  setChangesData,
  setChangesCounter
}) => {
  const [detailsRequestedFeaturesState, detailsRequestedFeaturesDispatch] = useReducer(
    detailsRequestedFeaturesReducer,
    initialState
  )
  const [currentData, setCurrentData] = useState([])
  const [confirmDialogData, setConfirmDialogData] = useState({
    index: null,
    feature: null
  })
  const [editableItemIndex, setEditableItemIndex] = useState(null)
  const [labelFetureIsEditable, setLabelFeatureIsEditable] = useState(false)

  useEffect(() => {
    return () => {
      setEditableItemIndex(null)
      setLabelFeatureIsEditable(false)
    }
  }, [selectedItem])

  useEffect(() => {
    setCurrentData(
      !isNil(changes.data.features)
        ? changes.data.features.currentFieldValue
        : selectedItem.specFeatures
    )

    return () => {
      setConfirmDialogData({ index: null, feature: null })
      setCurrentData([])
      detailsRequestedFeaturesDispatch({
        type: detailsRequestedFeaturesActions.RESET_EDIT_MODE
      })
    }
  }, [changes.data.features, selectedItem.specFeatures])

  useEffect(() => {
    if (
      labelFetureIsEditable &&
      !isNil(editableItemIndex) &&
      !isNil(changes.data.label_feature) &&
      !isNil(changes.data.features) &&
      changes.data.features.currentFieldValue[editableItemIndex] !==
        changes.data.label_feature.currentFieldValue
    ) {
      handleEditInput(changes.data.features.currentFieldValue[editableItemIndex], 'label_feature')
    }
  }, [
    changes.data.features,
    changes.data.label_feature,
    editableItemIndex,
    handleEditInput,
    labelFetureIsEditable
  ])

  const handleAliasChange = (index, alias) => {
    const generatedFeaturesArray = generateChangedArray(index, alias)

    handleEditInput(generatedFeaturesArray, 'features')
  }

  const handleItemClick = (field, fieldType, info, index, featureTemplate) => {
    if (isNil(editableItemIndex) || editableItemIndex !== index) {
      setEditableItemIndex(index)
      detailsRequestedFeaturesDispatch({
        type: detailsRequestedFeaturesActions.SET_EDIT_MODE,
        payload: {
          field,
          fieldType
        }
      })

      const changesData = cloneDeep(changes.data)

      if (isNil(changesData.label_feature) && featureTemplate === selectedItem.label_feature) {
        setLabelFeatureIsEditable(true)

        changesData.label_feature = {
          initialFieldValue: selectedItem.label_feature,
          currentFieldValue: selectedItem.label_feature,
          previousFieldValue: selectedItem.label_feature
        }
      } else if (
        !isNil(changesData.label_feature) &&
        featureTemplate === changesData.label_feature.currentFieldValue
      ) {
        setLabelFeatureIsEditable(true)

        changesData.label_feature = {
          ...changesData.label_feature,
          currentFieldValue: changesData.label_feature.previousFieldValue
        }
      }

      if (isNil(changesData[field]?.initialFieldValue)) {
        changesData[field] = {
          initialFieldValue: selectedItem.specFeatures,
          currentFieldValue: selectedItem.specFeatures,
          previousFieldValue: selectedItem.specFeatures
        }

        setChangesData(changesData)
      } else {
        changesData[field] = {
          ...changesData[field],
          currentFieldValue: changesData[field].previousFieldValue
        }

        setChangesData(changesData)
      }
    }
  }

  const onFinishEdit = fields => {
    setEditableItemIndex(null)
    setLabelFeatureIsEditable(false)

    handleFinishEdit(
      fields,
      changes,
      detailsRequestedFeaturesActions,
      detailsRequestedFeaturesDispatch,
      detailsRequestedFeaturesState,
      setChangesData,
      setChangesCounter
    )
  }

  const handleDelete = index => {
    if (!isNil(editableItemIndex)) setEditableItemIndex(null)
    if (labelFetureIsEditable) setLabelFeatureIsEditable(false)

    const changesData = cloneDeep(changes.data)
    const editedFeatures = [...currentData]
    const [deletedFeature] = editedFeatures.splice(index, 1)

    changesData.features = {
      initialFieldValue: selectedItem.specFeatures,
      currentFieldValue: editedFeatures,
      previousFieldValue: editedFeatures
    }

    if (
      (changesData.label_feature &&
        deletedFeature === changesData.label_feature.currentFieldValue) ||
      deletedFeature === selectedItem.label_feature
    ) {
      changesData.label_feature = {
        initialFieldValue: selectedItem.label_feature,
        currentFieldValue: '',
        previousFieldValue: ''
      }
    }

    setChanges({
      data: changesData,
      counter: Object.keys(changesData).length
    })

    setConfirmDialogData({ index: null, feature: null })
  }

  const generateChangedArray = (index, changedAlias) => {
    return currentData.map((item, idx) => {
      if (idx === index) {
        if (currentData?.[index].match(/\s+as\s+(?<alias>.*)$/)) {
          item = currentData?.[index].replace(
            /\s+as\s+(?<alias>.*)$/,
            changedAlias === '' ? '' : ` as ${changedAlias}`
          )
        } else if (changedAlias !== '') {
          item = `${currentData?.[index]} as ${changedAlias}`
        }
      }

      return item
    })
  }

  return (
    <DetailsRequestedFeaturesView
      confirmDialogData={confirmDialogData}
      currentData={currentData}
      editableItemIndex={editableItemIndex}
      handleAliasChange={handleAliasChange}
      handleDelete={handleDelete}
      handleItemClick={handleItemClick}
      onFinishEdit={onFinishEdit}
      setConfirmDialogData={setConfirmDialogData}
      selectedItem={selectedItem}
      setEditableItemIndex={setEditableItemIndex}
    />
  )
}

DetailsRequestedFeatures.propTypes = {
  changes: PropTypes.object.isRequired,
  handleEditInput: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures

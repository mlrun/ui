/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isNil } from 'lodash'

import DetailsRequestedFeaturesView from './DetailsRequestedFeaturesView'

import { handleFinishEdit, countChanges } from '../Details/details.util.js'
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
  const [labelFeatureIsEditable, setLabelFeatureIsEditable] = useState(false)
  const [isAliasNameValid, setIsAliasNameValid] = useState(true)
  const [generatedFeaturesArray, setGeneratedFeaturesArray] = useState([])

  useEffect(() => {
    return () => {
      setEditableItemIndex(null)
      setLabelFeatureIsEditable(false)
      setGeneratedFeaturesArray([])
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
      labelFeatureIsEditable &&
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
    labelFeatureIsEditable
  ])

  const handleAliasChange = (index, alias) => {
    setGeneratedFeaturesArray(generateChangedArray(index, alias))
  }

  const handleItemClick = (field, fieldType, info, index, featureTemplate) => {
    if (isNil(editableItemIndex) || editableItemIndex !== index) {
      setIsAliasNameValid(true)
      setEditableItemIndex(index)
      setGeneratedFeaturesArray(currentData)
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
      } else if (!isNil(changesData.label_feature)) {
        setLabelFeatureIsEditable(featureTemplate === changesData.label_feature.currentFieldValue)

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

        setCurrentData(changesData.features.currentFieldValue)
        setChangesData(changesData)
      }
    }
  }

  const onFinishEdit = () => {
    const changesData = cloneDeep(changes)
    changesData.data.features.currentFieldValue = generatedFeaturesArray

    setEditableItemIndex(null)
    setLabelFeatureIsEditable(false)
    setCurrentData(changesData.data.features.currentFieldValue)
    handleFinishEdit(
      changesData,
      detailsRequestedFeaturesActions,
      detailsRequestedFeaturesDispatch,
      setChangesData,
      setChangesCounter,
      null,
      null,
      Object.keys(changes.data),
      detailsRequestedFeaturesState
    )
  }

  const handleDelete = index => {
    if (!isNil(editableItemIndex)) setEditableItemIndex(null)
    if (labelFeatureIsEditable) setLabelFeatureIsEditable(false)

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
      counter: countChanges(changesData)
    })

    setConfirmDialogData({ index: null, feature: null })
  }

  const handleDiscardChanges = index => {
    const changesData = cloneDeep(changes.data)

    changesData.features.currentFieldValue[index] = changesData.features.previousFieldValue[index]

    if (
      changesData.label_feature &&
      changesData.label_feature.currentFieldValue === currentData[index]
    ) {
      changesData.label_feature = {
        ...changesData.label_feature,
        currentFieldValue: changesData.label_feature.previousFieldValue
      }
    }

    if (labelFeatureIsEditable) {
      setLabelFeatureIsEditable(false)
    }
    setEditableItemIndex(null)
    setIsAliasNameValid(true)
    setCurrentData(changesData.features.currentFieldValue)
    setChangesData(changesData)
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
      handleDiscardChanges={handleDiscardChanges}
      handleDelete={handleDelete}
      handleItemClick={handleItemClick}
      isAliasNameValid={isAliasNameValid}
      onFinishEdit={onFinishEdit}
      setConfirmDialogData={setConfirmDialogData}
      setIsAliasNameValid={setIsAliasNameValid}
      selectedItem={selectedItem}
    />
  )
}

DetailsRequestedFeatures.propTypes = {
  changes: PropTypes.object.isRequired,
  handleEditInput: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures

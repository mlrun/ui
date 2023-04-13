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
import React, { useCallback, useEffect, useReducer, useState } from 'react'
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
  formState,
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
  const [confirmDialogData, setConfirmDialogData] = useState({
    index: null,
    feature: null
  })
  const [editableItemIndex, setEditableItemIndex] = useState(null)
  const [labelFeatureIsEditable, setLabelFeatureIsEditable] = useState(false)

  useEffect(() => {
    return () => {
      setEditableItemIndex(null)
      setLabelFeatureIsEditable(false)
    }
  }, [selectedItem])

  useEffect(() => {
    return () => {
      setConfirmDialogData({ index: null, feature: null })
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

  const handleItemClick = (field, fieldType, index, featureTemplate) => {
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
      } else if (!isNil(changesData.label_feature)) {
        setLabelFeatureIsEditable(featureTemplate === changesData.label_feature.currentFieldValue)

        changesData.label_feature = {
          ...changesData.label_feature,
          currentFieldValue: changesData.label_feature.previousFieldValue
        }
      }
    }
  }

  const onFinishEdit = useCallback((currentField) => {
    const changesData = cloneDeep(changes)
    setEditableItemIndex(null)
    setLabelFeatureIsEditable(false)
    handleFinishEdit(
      changesData,
      detailsRequestedFeaturesActions,
      detailsRequestedFeaturesDispatch,
      setChangesData,
      setChangesCounter,
      currentField,
      formState,
      Object.keys(changes.data),
      detailsRequestedFeaturesState
    )
  },
    [changes, detailsRequestedFeaturesState, formState, setChangesCounter, setChangesData])

  const handleDelete = index => {
    const changesData = cloneDeep(changes.data)
    const formStateFeatures = cloneDeep(formState.values.features)
    const [deletedFeature] = [...formStateFeatures].splice(index, 1)

    if (!isNil(editableItemIndex)) setEditableItemIndex(null)

    if (labelFeatureIsEditable) setLabelFeatureIsEditable(false)

    const updatedFeatures = formStateFeatures.filter(
      (feature, featureIndex) => featureIndex !== index
    )

    formState.form.change('features', updatedFeatures)

    changesData.features = {
      initialFieldValue: formState.initialValues.features,
      currentFieldValue: updatedFeatures
    }

    if (
      (changesData.label_feature &&
        deletedFeature.originalTemplate === changesData.label_feature.currentFieldValue) ||
      deletedFeature.originalTemplate === selectedItem.label_feature
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

  const handleDiscardChanges = () => {
    if (labelFeatureIsEditable) {
      setLabelFeatureIsEditable(false)
    }

    const resetValue = changes.data.features
      ? changes.data.features.currentFieldValue
      : formState.initialValues.features

    formState.form.reset({ ...formState.values, features: resetValue })
    setEditableItemIndex(null)
  }

  return (
    <DetailsRequestedFeaturesView
      confirmDialogData={confirmDialogData}
      editableItemIndex={editableItemIndex}
      formState={formState}
      handleDiscardChanges={handleDiscardChanges}
      handleDelete={handleDelete}
      handleItemClick={handleItemClick}
      onFinishEdit={onFinishEdit}
      setConfirmDialogData={setConfirmDialogData}
      selectedItem={selectedItem}
    />
  )
}

DetailsRequestedFeatures.propTypes = {
  changes: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handleEditInput: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsRequestedFeatures

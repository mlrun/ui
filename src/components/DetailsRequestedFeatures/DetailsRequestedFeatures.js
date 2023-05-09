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
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isEqual, isNil } from 'lodash'

import DetailsRequestedFeaturesView from './DetailsRequestedFeaturesView'

import { countChanges } from '../Details/details.util.js'

const DetailsRequestedFeatures = ({
  changes,
  formState,
  selectedItem,
  setChanges,
  setChangesData,
  setChangesCounter
}) => {
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
    }
  }, [changes.data.features, selectedItem.specFeatures])

  const handleItemClick = (field, fieldType, index, featureTemplate) => {
    if (isNil(editableItemIndex) || editableItemIndex !== index) {
      const changesData = cloneDeep(changes.data)

      setEditableItemIndex(index)

      if (isNil(changesData.label_feature) && featureTemplate === selectedItem.label_feature) {
        setLabelFeatureIsEditable(true)
      } else if (!isNil(changesData.label_feature)) {
        setLabelFeatureIsEditable(featureTemplate === changesData.label_feature.currentFieldValue)
      }
    }
  }

  const onFinishEdit = useCallback(() => {
    const changesData = cloneDeep(changes.data)

    setEditableItemIndex(null)
    setLabelFeatureIsEditable(false)

    if (isEqual(formState.initialValues.features, formState.values.features)) {
      delete changesData.features
    } else {
      changesData.features = {
        initialFieldValue: formState.initialValues.features,
        currentFieldValue: formState.values.features
      }

      if (labelFeatureIsEditable) {
        changesData.label_feature = {
          initialFieldValue: formState.initialValues.features[editableItemIndex],
          currentFieldValue: formState.values.features[editableItemIndex]
        }
      }
    }

    setChangesCounter(countChanges(changesData))
    setChangesData({ ...changesData })
  },
    [
      changes.data,
      editableItemIndex,
      formState,
      labelFeatureIsEditable,
      setChangesCounter,
      setChangesData
    ]
  )

  const handleDelete = index => {
    const changesData = cloneDeep(changes.data)
    const formStateFeatures = cloneDeep(formState.values.features)
    const [deletedFeature] = [...formStateFeatures].splice(index, 1)

    if (!isNil(editableItemIndex)) setEditableItemIndex(null)

    if (labelFeatureIsEditable) setLabelFeatureIsEditable(false)

    const updatedFeatures = formStateFeatures.filter(
      (feature, featureIndex) => featureIndex !== index
    )

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
        initialFieldValue: formState.initialValues.features[editableItemIndex],
        currentFieldValue: { featureSet: '', feature: '', alias: '' }
      }
    }

    formState.form.change('features', updatedFeatures)
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
  selectedItem: PropTypes.shape({}).isRequired,
  setChanges: PropTypes.func.isRequired,
  setChangesData: PropTypes.func.isRequired,
  setChangesCounter: PropTypes.func.isRequired
}

export default DetailsRequestedFeatures

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
import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { cloneDeep, isNil } from 'lodash'
import PropTypes from 'prop-types'

import FeaturesTablePanelView from './FeaturesTablePanelView'

import featureStoreActions from '../../actions/featureStore'
import { setNotification } from '../../reducers/notificationReducer'
import {
  setLabelFeature,
  setTablePanelOpen,
  updateCurrentProjectName,
  updateFeatureVector,
  updateGroupedFeatures
} from '../../reducers/tableReducer'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { showErrorNotification } from '../../utils/notifications.util'

const FeaturesTablePanel = ({
  createNewFeatureVector,
  filtersStore,
  handleCancel = null,
  onSubmit = null,
  updateFeatureVectorData
}) => {
  const [isCreateFeaturePopUpOpen, setIsCreateFeaturePopUpOpen] = useState(false)
  const tableStore = useSelector(store => store.tableStore)
  const dispatch = useDispatch()

  useEffect(() => {
    if (tableStore.features.isNewFeatureVector) {
      dispatch(
        updateCurrentProjectName(
          filtersStore.project || tableStore.features.featureVector.metadata.project
        )
      )
    }
  }, [
    dispatch,
    filtersStore.project,
    tableStore.features.featureVector.metadata.project,
    tableStore.features.isNewFeatureVector
  ])

  useEffect(() => {
    if (!tableStore.features.isNewFeatureVector && isNil(tableStore.features.labelFeature)) {
      dispatch(setLabelFeature(tableStore.features.featureVector.spec.label_feature ?? ''))
    }
  }, [
    dispatch,
    tableStore.features.featureVector.spec.label_feature,
    tableStore.features.isNewFeatureVector,
    tableStore.features.labelFeature
  ])

  const addFeatures = () => {
    let featureVector = cloneDeep(tableStore.features.featureVector)
    let addFeaturesPromise = null

    featureVector.spec.features = Object.keys(tableStore.features.groupedFeatures).reduce(
      (accum, project) => [
        ...accum,
        ...tableStore.features.groupedFeatures[project].map(feature => feature.originalTemplate)
      ],
      []
    )

    featureVector.spec.label_feature = tableStore.features.labelFeature
      ? tableStore.features.labelFeature
      : ''

    if (onSubmit) {
      onSubmit(featureVector)
    } else {
      if (tableStore.features.isNewFeatureVector) {
        addFeaturesPromise = createNewFeatureVector(featureVector)
      } else {
        addFeaturesPromise = updateFeatureVectorData(featureVector)
      }

      addFeaturesPromise
        .then(response => {
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'Features successfully added'
            })
          )
        })
        .catch(error => {
          const customErrorMsg =
            tableStore.features.isNewFeatureVector &&
            error.response.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'You are not permitted to create a feature vector'
              : tableStore.features.isNewFeatureVector
                ? 'Feature vector creation failed'
                : 'Failed to add features'

          showErrorNotification(dispatch, error, '', customErrorMsg, () => addFeatures())
        })

      dispatch(setTablePanelOpen(false))
    }
  }

  const deleteFeature = (featureTemplate, project) => {
    const filteredFeatures = [...tableStore.features.groupedFeatures[project]].filter(
      feature => feature.originalTemplate !== featureTemplate
    )

    dispatch(updateGroupedFeatures({ groupedFeatures: filteredFeatures, project }))

    if (featureTemplate === tableStore.features.labelFeature) {
      dispatch(setLabelFeature(''))
    }
  }

  const createFeatureVector = featureVectorData => {
    setIsCreateFeaturePopUpOpen(false)
    dispatch(
      updateFeatureVector({
        metadata: {
          name: featureVectorData.name,
          tag: featureVectorData.tag,
          labels: featureVectorData.labels
        },
        spec: {
          description: featureVectorData.description
        }
      })
    )
  }

  const toggleLabelFeature = featureTemplate => {
    dispatch(setLabelFeature(tableStore.features.labelFeature?.length > 0 ? '' : featureTemplate))
  }

  return (
    <FeaturesTablePanelView
      addFeatures={addFeatures}
      createFeatureVector={createFeatureVector}
      deleteFeature={deleteFeature}
      handleCancel={() => {
        handleCancel ? handleCancel() : dispatch(setTablePanelOpen(false))
      }}
      isCreateFeaturePopUpOpen={isCreateFeaturePopUpOpen}
      setIsCreateFeaturePopUpOpen={setIsCreateFeaturePopUpOpen}
      tableStore={tableStore}
      toggleLabelFeature={toggleLabelFeature}
    />
  )
}

FeaturesTablePanel.propTypes = {
  handleCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default connect(
  filtersStore => ({
    ...filtersStore
  }),
  { ...featureStoreActions }
)(FeaturesTablePanel)

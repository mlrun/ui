import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { cloneDeep, isNil } from 'lodash'
import PropTypes from 'prop-types'

import FeaturesTablePanelView from './FeaturesTablePanelView'

import featureStoreActions from '../../actions/featureStore'
import notificationActions from '../../actions/notification'
import {
  setLabelFeature,
  setTablePanelOpen,
  updateCurrentProjectName,
  updateFeatureVector,
  updateGroupedFeatures
} from '../../reducers/tableReducer'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'

const FeaturesTablePanel = ({
  createNewFeatureVector,
  filtersStore,
  handleCancel,
  onSubmit,
  setNotification,
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
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Features successfully added'
          })
        })
        .catch(error => {
          setNotification({
            status: 400,
            id: Math.random(),
            message:
              tableStore.features.isNewFeatureVector &&
              error.response.status === FORBIDDEN_ERROR_STATUS_CODE
                ? 'You are not permitted to create new feature vector.'
                : tableStore.features.isNewFeatureVector
                ? 'Feature vector creation failed.'
                : 'Failed to add features',
            retry: addFeatures
          })
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

FeaturesTablePanel.defaultProps = {
  handleCancel: null,
  onSubmit: null
}

FeaturesTablePanel.propTypes = {
  handleCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default connect(
  filtersStore => ({
    ...filtersStore
  }),
  { ...featureStoreActions, ...notificationActions }
)(FeaturesTablePanel)

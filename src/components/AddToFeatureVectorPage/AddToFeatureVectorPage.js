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
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import FeaturesTablePanel from '../../elements/FeaturesTablePanel/FeaturesTablePanel'
import AddToFeatureVectorView from './AddToFeatureVectorView'

import featureStoreActions from '../../actions/featureStore'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import { filters } from './addToFeatureVectorPage.util'
import { getFeatureIdentifier } from '../../utils/getUniqueIdentifier'
import {
  FEATURE_STORE_PAGE,
  FEATURES_TAB,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { parseFeatures } from '../../utils/parseFeatures'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { setTablePanelOpen } from '../../reducers/tableReducer'
import { createFeaturesRowData } from '../../utils/createFeatureStoreContent'
import { useYaml } from '../../hooks/yaml.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { cancelRequest } from '../../utils/cancelRequest'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const AddToFeatureVectorPage = ({
  createNewFeatureVector,
  featureStore,
  fetchFeature,
  fetchFeatures,
  filtersStore,
  fetchFeatureSetsTags,
  removeFeature,
  removeFeatures,
  setFilters,
  setNotification
}) => {
  const [content, setContent] = useState([])
  const [selectedRowData, setSelectedRowData] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const addToFeatureVectorPageRef = useRef(null)
  const params = useParams()
  const navigate = useNavigate()
  const tableStore = useSelector(store => store.tableStore)
  const dispatch = useDispatch()
  const [urlTagOption] = useGetTagOptions(fetchFeatureSetsTags, filters)

  const navigateToFeatureVectorsScreen = useCallback(() => {
    navigate(`/projects/${params.projectName}/feature-store/feature-vectors`)
  }, [navigate, params.projectName])

  const handleCancelCreateFeatureVector = useCallback(() => {
    dispatch(setTablePanelOpen(false))
    navigateToFeatureVectorsScreen()
  }, [dispatch, navigateToFeatureVectorsScreen])

  const handleCreateFeatureVector = useCallback(
    featureVector => {
      createNewFeatureVector(featureVector)
        .then(response => {
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Feature vector created successfully'
          })
          dispatch(setTablePanelOpen(false))
          navigateToFeatureVectorsScreen()
        })
        .catch(error => {
          setNotification({
            status: error.response.status || 400,
            id: Math.random(),
            message:
              error.response.status === FORBIDDEN_ERROR_STATUS_CODE
                ? 'You are not permitted to create new feature vector.'
                : 'Feature vector creation failed.',
            retry: handleCreateFeatureVector
          })

          if (error.response.status === FORBIDDEN_ERROR_STATUS_CODE) {
            dispatch(setTablePanelOpen(false))
            navigateToFeatureVectorsScreen()
          }
        })
    },
    [createNewFeatureVector, dispatch, navigateToFeatureVectorsScreen, setNotification]
  )

  const pageData = useMemo(
    () => ({
      page: FEATURE_STORE_PAGE,
      tablePanel: (
        <FeaturesTablePanel
          onSubmit={handleCreateFeatureVector}
          handleCancel={handleCancelCreateFeatureVector}
        />
      )
    }),
    [handleCancelCreateFeatureVector, handleCreateFeatureVector]
  )

  const actionsMenu = useMemo(
    () => [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [toggleConvertedYaml]
  )

  const fetchData = useCallback(
    async filters => {
      const config = {
        cancelToken: new axios.CancelToken(cancel => {
          addToFeatureVectorPageRef.current.cancel = cancel
        })
      }

      fetchFeatures(filters.project, filters, config).then(result => {
        if (result) {
          setContent(parseFeatures(result))
        }

        return result
      })
    },
    [fetchFeatures]
  )

  const handleRemoveFeature = useCallback(
    feature => {
      const newStoreSelectedRowData = {
        ...featureStore.features.selectedRowData.content
      }
      const newSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[feature.ui.identifier]
      delete newSelectedRowData[feature.ui.identifier]

      removeFeature(newStoreSelectedRowData)
      setSelectedRowData(newSelectedRowData)
    },
    [featureStore.features.selectedRowData.content, removeFeature, selectedRowData]
  )

  const handleRequestOnExpand = useCallback(
    async feature => {
      const featureIdentifier = getFeatureIdentifier(feature)

      setSelectedRowData(state => ({
        ...state,
        [featureIdentifier]: {
          loading: true
        }
      }))

      fetchFeature(feature.metadata.project, feature.name, feature.metadata.name)
        .then(result => {
          if (result?.length > 0) {
            const content = [...parseFeatures(result)].map(contentItem =>
              createFeaturesRowData(contentItem, tableStore.isTablePanelOpen)
            )
            setSelectedRowData(state => ({
              ...state,
              [featureIdentifier]: {
                content,
                error: null,
                loading: false
              }
            }))
          }
        })
        .catch(error => {
          setSelectedRowData(state => ({
            ...state,
            [featureIdentifier]: {
              ...state.selectedRowData[featureIdentifier],
              error,
              loading: false
            }
          }))
        })
    },
    [fetchFeature, tableStore.isTablePanelOpen]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    content,
    getFeatureIdentifier,
    handleRemoveFeature,
    handleRequestOnExpand,
    FEATURE_STORE_PAGE,
    FEATURES_TAB
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createFeaturesRowData(contentItem, tableStore.isTablePanelOpen, true)
        })
      : content.map(contentItem => createFeaturesRowData(contentItem, tableStore.isTablePanelOpen))
  }, [content, filtersStore.groupBy, latestItems, tableStore.isTablePanelOpen])

  useEffect(() => {
    if (urlTagOption) {
      fetchData({
        tag: urlTagOption,
        iter: '',
        project: params.projectName
      })
    }
  }, [fetchData, params.projectName, urlTagOption])

  useEffect(() => {
    return () => {
      setContent([])
      removeFeature()
      removeFeatures()
      setSelectedRowData({})
      cancelRequest(addToFeatureVectorPageRef, 'cancel')
    }
  }, [removeFeature, removeFeatures])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.groupBy, filtersStore.tag, setFilters])

  useEffect(() => {
    if (isEveryObjectValueEmpty(tableStore.features.featureVector)) {
      navigateToFeatureVectorsScreen()
      setNotification({
        status: 400,
        id: Math.random(),
        message: 'Please, create a feature vector first'
      })
    } else {
      dispatch(setTablePanelOpen(true))
    }
  }, [dispatch, navigateToFeatureVectorsScreen, setNotification, tableStore.features.featureVector])

  return (
    <AddToFeatureVectorView
      actionsMenu={actionsMenu}
      content={content}
      convertedYaml={convertedYaml}
      featureStore={featureStore}
      fetchData={fetchData}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      pageData={pageData}
      ref={addToFeatureVectorPageRef}
      selectedRowData={selectedRowData}
      tableContent={tableContent}
      tableStore={tableStore}
      toggleConvertedYaml={toggleConvertedYaml}
    />
  )
}

export default connect(
  ({ filtersStore, featureStore }) => ({
    filtersStore,
    featureStore
  }),
  {
    ...featureStoreActions,
    ...notificationActions,
    ...filtersActions,
    ...notificationActions
  }
)(AddToFeatureVectorPage)

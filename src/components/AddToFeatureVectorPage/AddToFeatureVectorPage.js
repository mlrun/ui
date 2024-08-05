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
import { useNavigate, useParams } from 'react-router-dom'

import AddToFeatureVectorView from './AddToFeatureVectorView'
import FeaturesTablePanel from '../../elements/FeaturesTablePanel/FeaturesTablePanel'

import {
  FEATURES_TAB,
  FEATURE_STORE_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  TAG_FILTER_ALL_ITEMS,
  REQUEST_CANCELED,
  LARGE_REQUEST_CANCELED,
  CANCEL_REQUEST_TIMEOUT
} from '../../constants'
import featureStoreActions from '../../actions/featureStore'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { createFeaturesRowData } from '../../utils/createFeatureStoreContent'
import { filters } from './addToFeatureVectorPage.util'
import { getFeatureIdentifier } from '../../utils/getUniqueIdentifier'
import { handleFeaturesResponse } from '../FeatureStore/Features/features.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { setTablePanelOpen } from '../../reducers/tableReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

import cssVariables from '../FeatureStore/Features/features.scss'

const AddToFeatureVectorPage = ({
  createNewFeatureVector,
  featureStore,
  fetchFeature,
  fetchFeatureSetsTags,
  fetchFeatures,
  removeFeature,
  removeFeatures
}) => {
  const [content, setContent] = useState([])
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const addToFeatureVectorPageRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())
  const params = useParams()
  const navigate = useNavigate()
  const tableStore = useSelector(store => store.tableStore)
  const filtersStore = useSelector(store => store.filtersStore)
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
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'Feature vector created successfully'
            })
          )
          dispatch(setTablePanelOpen(false))
          navigateToFeatureVectorsScreen()
        })
        .catch(error => {
          const customErrorMsg =
            error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
              ? 'You are not permitted to create a feature vector'
              : 'Feature vector creation failed'

          showErrorNotification(dispatch, error, '', customErrorMsg, () =>
            handleCreateFeatureVector(featureVector)
          )

          if (error.response.status === FORBIDDEN_ERROR_STATUS_CODE) {
            dispatch(setTablePanelOpen(false))
            navigateToFeatureVectorsScreen()
          }
        })
    },
    [createNewFeatureVector, dispatch, navigateToFeatureVectorsScreen]
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
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]
    ],
    [toggleConvertedYaml]
  )

  const fetchData = useCallback(
    async filters => {
      abortControllerRef.current = new AbortController()

      const cancelRequestTimeout = setTimeout(() => {
        abortControllerRef.current.abort(LARGE_REQUEST_CANCELED)
      }, CANCEL_REQUEST_TIMEOUT)

      const config = {
        signal: abortControllerRef.current.signal
      }

      setRequestErrorMessage('')
      fetchFeatures(filters.project, filters, config)
        .then(features => {
          return handleFeaturesResponse(
            features,
            setContent,
            abortControllerRef,
            setRequestErrorMessage
          )
        })
        .catch(error => {
          return handleFeaturesResponse(
            null,
            setContent,
            abortControllerRef,
            setRequestErrorMessage,
            error,
            dispatch
          )
        })
        .finally(() => clearTimeout(cancelRequestTimeout))
    },
    [dispatch, fetchFeatures]
  )

  const handleRefresh = filters => {
    dispatch(
      getFilterTagOptions({ fetchTags: fetchFeatureSetsTags, project: filters.project })
    )

    setContent([])
    setSelectedRowData({})

    return fetchData(filters)
  }

  const handleRemoveFeature = useCallback(
    feature => {
      const newStoreSelectedRowData = {
        ...featureStore.features.selectedRowData.content
      }
      const newSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[feature.data.ui.identifier]
      delete newSelectedRowData[feature.data.ui.identifier]

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
            const content = [...result].map(contentItem =>
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
    null,
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
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [removeFeature, removeFeatures])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS) {
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    }
  }, [dispatch, filtersStore.groupBy, filtersStore.tag])

  useEffect(() => {
    if (isEveryObjectValueEmpty(tableStore.features.featureVector)) {
      navigateToFeatureVectorsScreen()
      showErrorNotification(dispatch, {}, 'Please, create a feature vector first')
    } else {
      dispatch(setTablePanelOpen(true))
    }
  }, [dispatch, navigateToFeatureVectorsScreen, tableStore.features.featureVector])

  useEffect(() => {
    return () => {
      dispatch(setTablePanelOpen(false))
    }
  }, [dispatch])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent,
      expandedRowsData: selectedRowData
    },
    heightData: {
      headerRowHeight: cssVariables.featuresHeaderRowHeight,
      rowHeight: cssVariables.featuresRowHeight,
      rowHeightExtended: cssVariables.featuresRowHeightExtended
    }
  })

  return (
    <AddToFeatureVectorView
      actionsMenu={actionsMenu}
      content={content}
      convertedYaml={convertedYaml}
      featureStore={featureStore}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={addToFeatureVectorPageRef}
      requestErrorMessage={requestErrorMessage}
      selectedRowData={selectedRowData}
      tableContent={tableContent}
      tableStore={tableStore}
      toggleConvertedYaml={toggleConvertedYaml}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default connect(
  ({ featureStore }) => ({
    featureStore
  }),
  {
    ...featureStoreActions
  }
)(AddToFeatureVectorPage)

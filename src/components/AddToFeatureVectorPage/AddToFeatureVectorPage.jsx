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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

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
  CANCEL_REQUEST_TIMEOUT,
  PROJECT_FILTER
} from '../../constants'
import {
  createNewFeatureVector,
  fetchFeature,
  fetchFeatures,
  fetchFeatureSetsTags,
  removeFeature,
  removeFeatures
} from '../../reducers/featureStoreReducer'
import { FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { createFeaturesRowData } from '../../utils/createFeatureStoreContent'
import { getFeatureIdentifier } from '../../utils/getUniqueIdentifier'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getFiltersConfig } from './addToFeatureVectorPage.util'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { handleFeaturesResponse } from '../FeatureStore/Features/features.util'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { setTablePanelOpen } from '../../reducers/tableReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { toggleYaml } from '../../reducers/appReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'

import Yaml from 'igz-controls/images/yaml.svg?react'

const AddToFeatureVectorPage = () => {
  const [content, setContent] = useState([])
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const addToFeatureVectorPageRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())
  const params = useParams()
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const tableStore = useSelector(store => store.tableStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const featureStore = useSelector(store => store.featureStore)
  const dispatch = useDispatch()

  const featuresRowHeight = useMemo(() => getScssVariableValue('--featuresRowHeight'), [])
  const featuresRowHeightExtended = useMemo(
    () => getScssVariableValue('--featuresRowHeightExtended'),
    []
  )
  const featuresHeaderRowHeight = useMemo(
    () => getScssVariableValue('--featuresHeaderRowHeight'),
    []
  )
  const filtersConfig = useMemo(() => {
    return getFiltersConfig(params.projectName)
  }, [params.projectName])
  const addToFeatureVectorFilters = useFiltersFromSearchParams(filtersConfig)

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const navigateToFeatureVectorsScreen = useCallback(
    featureVector => {
      if (!isEmpty(featureVector)) {
        navigate(
          `/projects/${params.projectName}/feature-store/feature-vectors/${featureVector.metadata.name}/${featureVector.metadata.tag}/overview?tag=${featureVector.metadata.tag}`
        )
      } else {
        navigate(`/projects/${params.projectName}/feature-store/feature-vectors`)
      }
    },
    [navigate, params.projectName]
  )

  const handleCancelCreateFeatureVector = useCallback(() => {
    dispatch(setTablePanelOpen(false))
    navigateToFeatureVectorsScreen()
  }, [dispatch, navigateToFeatureVectorsScreen])

  const handleCreateFeatureVector = useCallback(
    featureVector => {
      dispatch(createNewFeatureVector({ data: featureVector }))
        .unwrap()
        .then(response => {
          dispatch(
            setNotification({
              status: response.status,
              id: Math.random(),
              message: 'Feature vector created successfully'
            })
          )
          dispatch(setTablePanelOpen(false))
          navigateToFeatureVectorsScreen(response?.data)
        })
        .catch(error => {
          showErrorNotification(dispatch, error, null, null, () =>
            handleCreateFeatureVector(featureVector)
          )

          if (error.response.status === FORBIDDEN_ERROR_STATUS_CODE) {
            dispatch(setTablePanelOpen(false))
            navigateToFeatureVectorsScreen()
          }
        })
    },
    [dispatch, navigateToFeatureVectorsScreen]
  )

  const pageData = useMemo(
    () => ({
      page: FEATURE_STORE_PAGE,
      tablePanel: (
        <FeaturesTablePanel
          onSubmit={handleCreateFeatureVector}
          handleCancel={handleCancelCreateFeatureVector}
          projectName={addToFeatureVectorFilters[PROJECT_FILTER]}
        />
      )
    }),
    [addToFeatureVectorFilters, handleCancelCreateFeatureVector, handleCreateFeatureVector]
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
      dispatch(fetchFeatures({ project: filters.project, filters, config }))
        .unwrap()
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
    [dispatch]
  )

  const fetchTags = useCallback(
    (project = params.projectName) => {
      return dispatch(getFilterTagOptions({ dispatch, fetchTags: fetchFeatureSetsTags, project }))
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      fetchTags(filters.project)
      setContent([])
      setSelectedRowData({})

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const collapseRowCallback = useCallback(
    feature => {
      const newStoreSelectedRowData = {
        ...featureStore.features.selectedRowData.content
      }
      const newSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[feature.data.ui.identifier]
      delete newSelectedRowData[feature.data.ui.identifier]

      dispatch(removeFeature(newStoreSelectedRowData))
      setSelectedRowData(newSelectedRowData)
    },
    [dispatch, featureStore.features.selectedRowData.content, selectedRowData]
  )

  const expandRowCallback = useCallback(
    async feature => {
      const featureIdentifier = getFeatureIdentifier(feature)

      setSelectedRowData(state => ({
        ...state,
        [featureIdentifier]: {
          loading: true
        }
      }))

      dispatch(
        fetchFeature({
          project: feature.metadata.project,
          name: feature.name,
          metadataName: feature.metadata.name,
          labels: addToFeatureVectorFilters.labels,
          entities: addToFeatureVectorFilters.entities
        })
      )
        .unwrap()
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
    [
      dispatch,
      tableStore.isTablePanelOpen,
      addToFeatureVectorFilters.labels,
      addToFeatureVectorFilters.entities
    ]
  )

  const { latestItems, toggleRow } = useGroupContent(
    content,
    getFeatureIdentifier,
    collapseRowCallback,
    expandRowCallback,
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

  useInitialTableFetch({
    fetchData,
    fetchTags,
    filters: addToFeatureVectorFilters
  })

  useEffect(() => {
    return () => {
      setContent([])
      dispatch(removeFeature())
      dispatch(removeFeatures())
      setSelectedRowData({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [dispatch])

  useEffect(() => {
    if (addToFeatureVectorFilters.tag === TAG_FILTER_ALL_ITEMS) {
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    }
  }, [dispatch, filtersStore.groupBy, addToFeatureVectorFilters.tag])

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
      headerRowHeight: featuresHeaderRowHeight,
      rowHeight: featuresRowHeight,
      rowHeightExtended: featuresRowHeightExtended
    }
  })

  return (
    <AddToFeatureVectorView
      actionsMenu={actionsMenu}
      content={content}
      featureStore={featureStore}
      fetchTags={fetchTags}
      filters={addToFeatureVectorFilters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={addToFeatureVectorPageRef}
      requestErrorMessage={requestErrorMessage}
      selectedRowData={selectedRowData}
      setSearchParams={setSearchParams}
      tableContent={tableContent}
      tableStore={tableStore}
      toggleRow={toggleRow}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default AddToFeatureVectorPage

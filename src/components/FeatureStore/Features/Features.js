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
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { mapValues, map } from 'lodash'

import AddToFeatureVectorPopUp from '../../../elements/AddToFeatureVectorPopUp/AddToFeatureVectorPopUp'
import FeaturesTablePanel from '../../../elements/FeaturesTablePanel/FeaturesTablePanel'
import FeaturesView from './FeaturesView'
import { FeatureStoreContext } from '../FeatureStore'

import {
  CANCEL_REQUEST_TIMEOUT,
  FEATURES_TAB,
  FEATURE_STORE_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  LARGE_REQUEST_CANCELED,
  REQUEST_CANCELED,
  TAG_FILTER_ALL_ITEMS
} from '../../../constants'
import { createFeaturesRowData } from '../../../utils/createFeatureStoreContent'
import { filtersConfig, handleFeaturesResponse } from './features.util'
import { getFeatureIdentifier } from '../../../utils/getUniqueIdentifier'
import { getFilterTagOptions, setFilters } from '../../../reducers/filtersReducer'
import { setTablePanelOpen } from '../../../reducers/tableReducer'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { useVirtualization } from '../../../hooks/useVirtualization.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

import cssVariables from './features.scss'
import {
  fetchEntities,
  fetchEntity,
  fetchFeature,
  fetchFeatures,
  fetchFeatureSetsTags,
  removeEntities,
  removeEntity,
  removeFeature,
  removeFeatures
} from '../../../reducers/featureStoreReducer'

const Features = () => {
  const [features, setFeatures] = useState([])
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const params = useParams()
  const [, setSearchParams] = useSearchParams()
  const featureStore = useSelector(store => store.featureStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const featuresFilters = useFiltersFromSearchParams(filtersConfig)
  const tableStore = useSelector(store => store.tableStore)
  const featureStoreRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const dispatch = useDispatch()

  const { toggleConvertedYaml } = React.useContext(FeatureStoreContext)

  const pageData = useMemo(
    () => ({ page: FEATURE_STORE_PAGE, tablePanel: <FeaturesTablePanel /> }),
    []
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

  useLayoutEffect(() => {
    setSelectedRowData(prevSelectedRowData => {
      return mapValues(prevSelectedRowData, feature => ({
        ...feature,
        content: map(feature.content, contentItem =>
          createFeaturesRowData(contentItem.data, tableStore.isTablePanelOpen, false)
        )
      }))
    })
  }, [tableStore.isTablePanelOpen, setSelectedRowData])

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      const cancelRequestTimeout = setTimeout(() => {
        abortControllerRef.current.abort(LARGE_REQUEST_CANCELED)
      }, CANCEL_REQUEST_TIMEOUT)
      const config = {
        signal: abortControllerRef.current.signal
      }

      setRequestErrorMessage('')

      const getFirstPromiseError = result => {
        return result?.find(response => response.status === 'rejected')?.reason || null
      }

      return Promise.allSettled([
        dispatch(fetchFeatures({ project: params.projectName, filters, config })).unwrap(),
        dispatch(fetchEntities({ project: params.projectName, filters, config })).unwrap()
      ])
        .then(result => {
          if (result) {
            const features = result.reduce((prevValue, nextValue) => {
              return nextValue.value ? prevValue.concat(nextValue.value) : prevValue
            }, [])

            return handleFeaturesResponse(
              features,
              setFeatures,
              abortControllerRef,
              setRequestErrorMessage,
              getFirstPromiseError(result),
              dispatch
            )
          }

          return result
        })
        .finally(() => clearTimeout(cancelRequestTimeout))
    },
    [dispatch, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        dispatch,
        fetchTags: fetchFeatureSetsTags,
        project: params.projectName,
        config: { signal: tagAbortControllerRef.current.signal }
      })
    )
  }, [dispatch, params.projectName])

  const handleRefresh = useCallback(
    filters => {
      fetchTags()
      setFeatures([])
      dispatch(removeFeature())
      dispatch(removeEntity())
      dispatch(removeFeatures())
      dispatch(removeEntities())
      setSelectedRowData({})

      return fetchData(filters)
    },
    [dispatch, fetchData, fetchTags]
  )

  const handleRefreshWithFilters = useCallback(() => {
    handleRefresh(featuresFilters)
  }, [featuresFilters, handleRefresh])

  const collapseRowCallback = useCallback(
    feature => {
      const newStoreSelectedRowData =
        feature.data.ui.type === 'feature'
          ? { ...featureStore.features.selectedRowData.content }
          : { ...featureStore.entities.selectedRowData.content }
      const newSelectedRowData = { ...selectedRowData }
      const removeData = feature.data.ui.type === 'feature' ? removeFeature : removeEntity

      delete newStoreSelectedRowData[feature.data.ui.identifier]
      delete newSelectedRowData[feature.data.ui.identifier]

      dispatch(removeData(newStoreSelectedRowData))
      setSelectedRowData(newSelectedRowData)
    },
    [
      featureStore.features.selectedRowData.content,
      featureStore.entities.selectedRowData.content,
      selectedRowData,
      dispatch
    ]
  )

  const expandRowCallback = useCallback(
    feature => {
      const featureIdentifier = getFeatureIdentifier(feature)
      const fetchData = feature.ui?.type === 'feature' ? fetchFeature : fetchEntity

      setSelectedRowData(state => ({
        ...state,
        [featureIdentifier]: {
          loading: true
        }
      }))

      dispatch(
        fetchData({
          project: feature.metadata.project,
          name: feature.name,
          metadataName: feature.metadata.name,
          labels: featuresFilters.labels
        })
      )
        .unwrap()
        .then(result => {
          if (result?.length > 0) {
            const content = [...result].map(contentItem =>
              createFeaturesRowData(contentItem, tableStore.isTablePanelOpen, false)
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
    [dispatch, featuresFilters.labels, tableStore.isTablePanelOpen]
  )

  const { latestItems, toggleRow } = useGroupContent(
    features,
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
      : features.map(contentItem =>
          createFeaturesRowData(contentItem, tableStore.isTablePanelOpen, false)
        )
  }, [features, filtersStore.groupBy, latestItems, tableStore.isTablePanelOpen])

  const getPopUpTemplate = useCallback(
    action => {
      return (
        <AddToFeatureVectorPopUp key={action} action={action} currentProject={params.projectName} />
      )
    },
    [params.projectName]
  )

  useEffect(() => {
    return () => {
      dispatch(setTablePanelOpen(false))
    }
  }, [params.projectName, dispatch])

  useInitialTableFetch({
    fetchData,
    fetchTags,
    filters: featuresFilters
  })

  useEffect(() => {
    if (featuresFilters.tag === TAG_FILTER_ALL_ITEMS) {
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    }
  }, [filtersStore.groupBy, featuresFilters.tag, dispatch])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setFeatures([])
      dispatch(removeFeature())
      dispatch(removeEntity())
      dispatch(removeFeatures())
      dispatch(removeEntities())
      setSelectedRowData({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, tagAbortControllerRef, dispatch])

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
    <FeaturesView
      actionsMenu={actionsMenu}
      featureStore={featureStore}
      features={features}
      filtersStore={filtersStore}
      filters={featuresFilters}
      getPopUpTemplate={getPopUpTemplate}
      handleRefresh={handleRefresh}
      handleRefreshWithFilters={handleRefreshWithFilters}
      pageData={pageData}
      ref={{ featureStoreRef }}
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

export default Features

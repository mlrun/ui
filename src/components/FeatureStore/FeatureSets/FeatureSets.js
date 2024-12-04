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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'
import { cloneDeep } from 'lodash'

import FeatureSetsView from './FeatureSetsView'
import { FeatureStoreContext } from '../FeatureStore'

import {
  DETAILS_OVERVIEW_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  LABELS_FILTER,
  NAME_FILTER,
  REQUEST_CANCELED,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_LATEST
} from '../../../constants'
import { checkTabIsValid, handleApplyDetailsChanges } from '../featureStore.util'
import { createFeatureSetsRowData } from '../../../utils/createFeatureStoreContent'
import {
  featureSetsActionCreator,
  generateActionsMenu,
  generatePageData,
  setFullSelectedFeatureSet
} from './featureSets.util'
import { getFeatureSetIdentifier } from '../../../utils/getUniqueIdentifier'
import { getFilterTagOptions, setFilters } from '../../../reducers/filtersReducer'
import { isDetailsTabExists } from '../../../utils/link-helper.util'
import { parseChipsData } from '../../../utils/convertChipsData'
import { parseFeatureSets } from '../../../utils/parseFeatureSets'
import { setNotification } from '../../../reducers/notificationReducer'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { useOpenPanel } from '../../../hooks/openPanel.hook'
import { useVirtualization } from '../../../hooks/useVirtualization.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'
import { filtersConfig } from './featureSets.util'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'

import cssVariables from './featureSets.scss'

const FeatureSets = ({
  fetchExpandedFeatureSet,
  fetchFeatureSets,
  fetchFeatureSetsTags,
  removeFeatureSet,
  removeFeatureSets,
  removeNewFeatureSet,
  updateFeatureStoreData
}) => {
  const [featureSets, setFeatureSets] = useState([])
  const [selectedFeatureSet, setSelectedFeatureSet] = useState({})
  const [selectedFeatureSetMin, setSelectedFeatureSetMin] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const openPanelByDefault = useOpenPanel()
  const params = useParams()
  const [, setSearchParams] = useSearchParams()
  const featureStore = useSelector(store => store.featureStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const featureStoreRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const detailsFormInitialValues = useMemo(
    () => ({
      description: selectedFeatureSet.description,
      labels: parseChipsData(selectedFeatureSet.labels, frontendSpec.internal_labels)
    }),
    [frontendSpec.internal_labels, selectedFeatureSet.description, selectedFeatureSet.labels]
  )
  const featureSetsFilters = useFiltersFromSearchParams(filtersConfig)

  const { featureSetsPanelIsOpen, setFeatureSetsPanelIsOpen, toggleConvertedYaml } =
    React.useContext(FeatureStoreContext)

  const pageData = useMemo(() => generatePageData(selectedFeatureSet), [selectedFeatureSet])

  const actionsMenu = useMemo(
    () => generateActionsMenu(dispatch, selectedFeatureSet, toggleConvertedYaml),
    [dispatch, selectedFeatureSet, toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      const config = {
        ui: {
          controller: abortControllerRef.current,
          setRequestErrorMessage
        },
        params: {
          format: 'minimal'
        }
      }

      return fetchFeatureSets(params.projectName, filters, config).then(result => {
        if (result) {
          const parsedResult = parseFeatureSets(result)

          setFeatureSets(parsedResult)

          return parsedResult
        }
      })
    },
    [fetchFeatureSets, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        fetchTags: fetchFeatureSetsTags,
        project: params.projectName,
        config: {
          signal: tagAbortControllerRef.current.signal
        }
      })
    )
  }, [dispatch, fetchFeatureSetsTags, params.projectName])

  const handleRefresh = useCallback(
    filters => {
      fetchTags()
      setFeatureSets([])
      setSelectedFeatureSet({})
      setSelectedRowData({})
      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleRefreshWithFilters = useCallback(() => {
    handleRefresh(featureSetsFilters)
  }, [featureSetsFilters, handleRefresh])

  const collapseRowCallback = useCallback(
    featureSet => {
      const newStoreSelectedRowData = {
        ...featureStore.featureSets.selectedRowData.content
      }

      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[featureSet.data.ui.identifier]
      delete newPageDataSelectedRowData[featureSet.data.ui.identifier]

      removeFeatureSet(newStoreSelectedRowData)
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [featureStore.featureSets.selectedRowData.content, selectedRowData, removeFeatureSet]
  )

  const expandRowCallback = useCallback(
    item => {
      const featureSetIdentifier = getFeatureSetIdentifier(item)

      setSelectedRowData(state => ({
        ...state,
        [featureSetIdentifier]: {
          loading: true
        }
      }))

      fetchExpandedFeatureSet(item.project, item.name, featureSetsFilters.tag)
        .then(result => {
          const content = [...parseFeatureSets(result)].map(contentItem =>
            createFeatureSetsRowData(contentItem, params.projectName, FEATURE_SETS_TAB, true)
          )
          setSelectedRowData(state => ({
            ...state,
            [featureSetIdentifier]: {
              content,
              error: null,
              loading: false
            }
          }))
        })
        .catch(error => {
          setSelectedRowData(state => ({
            ...state,
            [featureSetIdentifier]: {
              ...state.selectedRowData[featureSetIdentifier],
              error,
              loading: false
            }
          }))
        })
    },
    [fetchExpandedFeatureSet, featureSetsFilters.tag, params.projectName]
  )

  const { latestItems, toggleRow } = useGroupContent(
    featureSets,
    getFeatureSetIdentifier,
    collapseRowCallback,
    expandRowCallback,
    null,
    FEATURE_STORE_PAGE,
    FEATURE_SETS_TAB
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createFeatureSetsRowData(contentItem, params.projectName, FEATURE_SETS_TAB, true)
        })
      : featureSets.map(contentItem =>
          createFeatureSetsRowData(contentItem, params.projectName, FEATURE_SETS_TAB)
        )
  }, [featureSets, filtersStore.groupBy, latestItems, params.projectName])

  const handleSelectFeatureSet = useCallback(
    item => {
      if (params.name === item.name && params.tag === item.tag) {
        setSelectedFeatureSetMin(item)
      }
    },
    [params.name, params.tag]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        handleRefresh,
        params.projectName,
        params.name,
        FEATURE_SETS_TAB,
        selectedFeatureSet,
        setNotification,
        updateFeatureStoreData,
        featureSetsFilters,
        dispatch
      )
    },
    [
      dispatch,
      handleRefresh,
      featureSetsFilters,
      params.name,
      params.projectName,
      selectedFeatureSet,
      updateFeatureStoreData
    ]
  )

  const applyDetailsChangesCallback = (changes, selectedItem) => {
    if (!selectedItem.tag) {
      navigate(
        `/projects/${params.projectName}/${FEATURE_STORE_PAGE}/${FEATURE_SETS_TAB}/${selectedItem.name}/${TAG_LATEST}/${DETAILS_OVERVIEW_TAB}`
      )
    }
  }

  const createFeatureSetSuccess = tag => {
    const currentTag = featureSetsFilters.tag === TAG_FILTER_ALL_ITEMS ? TAG_FILTER_ALL_ITEMS : tag

    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()

    setSearchParams(
      prevSearchParams => {
        if (currentTag === filtersConfig[TAG_FILTER].initialValue) {
          prevSearchParams.delete(TAG_FILTER)
        } else {
          prevSearchParams.set(TAG_FILTER, currentTag)
        }

        prevSearchParams.delete(NAME_FILTER)
        prevSearchParams.delete(LABELS_FILTER)

        return prevSearchParams
      },
      { replace: true }
    )

    return handleRefresh({
      project: params.projectName,
      tag: currentTag
    })
  }

  const closePanel = () => {
    setFeatureSetsPanelIsOpen(false)
    removeNewFeatureSet()
  }

  useEffect(() => {
    setFullSelectedFeatureSet(
      FEATURE_SETS_TAB,
      dispatch,
      navigate,
      selectedFeatureSetMin,
      setSelectedFeatureSet,
      params.projectName
    )
  }, [dispatch, navigate, params.projectName, selectedFeatureSetMin])

  useEffect(() => {
    setSelectedRowData({})
  }, [featureSetsFilters.tag])

  useInitialTableFetch({
    fetchData,
    setExpandedRowsData: setSelectedRowData,
    createRowData: rowItem =>
      createFeatureSetsRowData(rowItem, params.projectName, FEATURE_SETS_TAB),
    fetchTags,
    filters: featureSetsFilters,
    filterModalName: FEATURE_SETS_TAB,
    filterName: FEATURE_SETS_TAB,
    filtersConfig
  })

  useEffect(() => {
    if (featureSetsFilters.tag === TAG_FILTER_ALL_ITEMS) {
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    }
  }, [filtersStore.groupBy, featureSetsFilters.tag, dispatch])

  useEffect(() => {
    const content = cloneDeep(featureStore.featureSets?.allData)

    if (params.name && content.length !== 0) {
      const selectedItem = content.find(contentItem => {
        return (
          contentItem.name === params.name &&
          (contentItem.tag === params.tag || contentItem.uid === params.tag)
        )
      })

      if (!selectedItem) {
        navigate(
          `/projects/${params.projectName}/feature-store/${FEATURE_SETS_TAB}${window.location.search}`,
          {
            replace: true
          }
        )
      } else {
        setSelectedFeatureSetMin(selectedItem)
      }
    } else {
      setSelectedFeatureSetMin({})
    }
  }, [featureStore.featureSets.allData, navigate, params.name, params.projectName, params.tag])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    checkTabIsValid(navigate, params, selectedFeatureSet, FEATURE_SETS_TAB)
  }, [navigate, params, selectedFeatureSet])

  useEffect(() => {
    if (openPanelByDefault) {
      setFeatureSetsPanelIsOpen(true)
    }
  }, [openPanelByDefault, setFeatureSetsPanelIsOpen])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setFeatureSets([])
      removeFeatureSets()
      removeFeatureSet()
      setSelectedFeatureSetMin({})
      setSelectedRowData({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [removeFeatureSet, removeFeatureSets, params.projectName, tagAbortControllerRef])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent,
      expandedRowsData: selectedRowData,
      selectedItem: selectedFeatureSet
    },
    heightData: {
      headerRowHeight: cssVariables.featureSetsHeaderRowHeight,
      rowHeight: cssVariables.featureSetsRowHeight,
      rowHeightExtended: cssVariables.featureSetsRowHeightExtended
    }
  })

  return (
    <FeatureSetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      closePanel={closePanel}
      createFeatureSetSuccess={createFeatureSetSuccess}
      detailsFormInitialValues={detailsFormInitialValues}
      featureSets={featureSets}
      featureSetsPanelIsOpen={featureSetsPanelIsOpen}
      featureStore={featureStore}
      filtersStore={filtersStore}
      filters={featureSetsFilters}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={{ featureStoreRef }}
      requestErrorMessage={requestErrorMessage}
      selectedFeatureSet={selectedFeatureSet}
      selectedRowData={selectedRowData}
      setFeatureSetsPanelIsOpen={setFeatureSetsPanelIsOpen}
      setSearchParams={setSearchParams}
      setSelectedFeatureSetMin={handleSelectFeatureSet}
      tableContent={tableContent}
      toggleRow={toggleRow}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default connect(null, {
  ...featureSetsActionCreator
})(FeatureSets)

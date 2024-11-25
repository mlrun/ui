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
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import DatasetsView from './DatasetsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  DATASETS_PAGE,
  DATASETS_TAB,
  DATASET_TYPE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  REQUEST_CANCELED
} from '../../constants'
import {
  fetchArtifactTags,
  fetchDataSets,
  removeDataSet,
  removeDataSets
} from '../../reducers/artifactsReducer'
import {
  checkForSelectedDataset,
  filtersConfig,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerDatasetTitle
} from './datasets.util'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getViewMode } from '../../utils/helper'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { sortListByDate } from '../../utils'
import { setFullSelectedArtifact } from '../../utils/artifacts.util'
import { setNotification } from '../../reducers/notificationReducer'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { toggleYaml } from '../../reducers/appReducer'

import './datasets.scss'
import cssVariables from './datasets.scss'

const Datasets = () => {
  const [datasets, setDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [selectedDatasetMin, setSelectedDatasetMin] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [maxArtifactsErrorIsShown, setMaxArtifactsErrorIsShown] = useState(false)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const viewMode = getViewMode(window.location.search)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const filters = useFiltersFromSearchParams(filtersConfig)
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const datasetsRef = useRef(null)

  const pageData = useMemo(
    () => generatePageData(selectedDataset, viewMode, params),
    [selectedDataset, viewMode, params]
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedDataset.tag ?? ''
    }),
    [selectedDataset.tag]
  )

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      DATASETS_TAB,
      dispatch,
      navigate,
      selectedDatasetMin,
      setSelectedDataset,
      params.projectName
    )
  }, [dispatch, navigate, params.projectName, selectedDatasetMin])

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  useEffect(() => {
    getAndSetSelectedArtifact()
  }, [getAndSetSelectedArtifact])

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      return dispatch(
        fetchDataSets({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: {
              format: 'minimal'
            }
          }
        })
      )
        .unwrap()
        .then(result => {
          if (result) {
            setDatasets(result)
            setMaxArtifactsErrorIsShown(result.length === 1000)
          }

          return result
        })
    },
    [dispatch, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        dispatch,
        fetchTags: fetchArtifactTags,
        project: params.projectName,
        category: DATASET_TYPE,
        config: {
          signal: tagAbortControllerRef.current.signal
        }
      })
    )
  }, [dispatch, params.projectName])

  const handleRefresh = useCallback(
    filters => {
      fetchTags()
      setSelectedRowData({})
      setSelectedDatasetMin({})
      setDatasets([])

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleRefreshWithFilters = useCallback(() => {
    handleRefresh(filters)
  }, [filters, handleRefresh])

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => handleRefresh(filters),
        projectName: params.projectName
      })
    },
    [params.projectName, handleRefresh, filters]
  )

  const actionsMenu = useMemo(
    () => (datasetMin, menuPosition) =>
      generateActionsMenu(
        datasetMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        filters,
        menuPosition,
        selectedDataset
      ),
    [
      dispatch,
      filters,
      frontendSpec,
      handleAddTag,
      handleRefresh,
      params.projectName,
      selectedDataset,
      toggleConvertedYaml
    ]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        params.projectName,
        selectedDataset,
        setNotification,
        dispatch
      )
    },
    [dispatch, params.projectName, selectedDataset]
  )

  const applyDetailsChangesCallback = changes => {
    if ('tag' in changes.data) {
      setSelectedRowData({})
      setDatasets([])

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/${DATASETS_PAGE.toLowerCase()}/${params.name}/${
            changes.data.tag.currentFieldValue
          }/overview${window.location.search}`,
          { replace: true }
        )
      }
    }

    handleRefresh(filters)
  }

  const handleExpand = useCallback(
    (dataset, content) => {
      const dataSetIdentifier = getArtifactIdentifier(dataset)

      setSelectedRowData(state => {
        return {
          ...state,
          [dataSetIdentifier]: {
            content: sortListByDate(content[dataset.db_key ?? dataset.key], 'updated', false).map(
              contentItem => createDatasetsRowData(contentItem, params.projectName)
            ),
            error: null,
            loading: false
          }
        }
      })
    },
    [params.projectName]
  )

  const handleRemoveRowData = useCallback(
    dataset => {
      const newStoreSelectedRowData = {
        ...artifactsStore.dataSets.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[dataset.data.ui.identifier]
      delete newPageDataSelectedRowData[dataset.data.ui.identifier]

      dispatch(removeDataSet(newStoreSelectedRowData))
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.dataSets.selectedRowData.content, dispatch, selectedRowData]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    datasets,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleExpand,
    null,
    DATASETS_PAGE
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createDatasetsRowData(contentItem, params.projectName, frontendSpec, true)
        })
      : datasets.map(contentItem =>
          createDatasetsRowData(contentItem, params.projectName, frontendSpec, false)
        )
  }, [datasets, filtersStore.groupBy, frontendSpec, latestItems, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: tableHeaders,
      content: tableContent,
      sortConfig: {
        excludeSortBy: ['labels', 'size'],
        defaultSortBy: 'updated',
        defaultDirection: 'desc'
      }
    })

  useInitialTableFetch({
    createRowData: rowItem => createDatasetsRowData(rowItem, params.projectName, frontendSpec),
    fetchData,
    fetchTags,
    filterModalName: DATASETS_PAGE,
    filters,
    setExpandedRowsData: setSelectedRowData,
    sortExpandedRowsDataBy: 'updated'
  })

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, pageData.details.menu, params.name, params.tab, params.tag])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedDataset(
      params.name,
      selectedRowData,
      datasets,
      params.tag,
      params.iter,
      params.uid,
      params.projectName,
      setSelectedDatasetMin,
      navigate
    )
  }, [
    datasets,
    navigate,
    params.iter,
    params.name,
    params.projectName,
    params.tag,
    params.uid,
    selectedRowData
  ])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setDatasets([])
      dispatch(removeDataSets())
      setSelectedDatasetMin({})
      setSelectedRowData({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [dispatch, params.projectName, tagAbortControllerRef])

  const handleRegisterDataset = useCallback(() => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: DATASET_TYPE,
      params,
      refresh: () => handleRefresh(filters),
      title: registerDatasetTitle
    })
  }, [params, handleRefresh, filters])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: sortedTableContent,
      expandedRowsData: selectedRowData,
      selectedItem: selectedDataset
    },
    heightData: {
      headerRowHeight: cssVariables.datasetsHeaderRowHeight,
      rowHeight: cssVariables.datasetsRowHeight,
      rowHeightExtended: cssVariables.datasetsRowHeightExtended
    },
    activateTableScroll: true
  })

  return (
    <DatasetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      datasets={datasets}
      detailsFormInitialValues={detailsFormInitialValues}
      filters={filters}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRegisterDataset={handleRegisterDataset}
      maxArtifactsErrorIsShown={maxArtifactsErrorIsShown}
      pageData={pageData}
      ref={{ datasetsRef }}
      requestErrorMessage={requestErrorMessage}
      selectedDataset={selectedDataset}
      selectedRowData={selectedRowData}
      setMaxArtifactsErrorIsShown={setMaxArtifactsErrorIsShown}
      setSelectedDatasetMin={setSelectedDatasetMin}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      viewMode={viewMode}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default Datasets

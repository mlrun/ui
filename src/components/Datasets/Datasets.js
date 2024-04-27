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
  DATASET_TYPE,
  DATASETS_FILTERS,
  DATASETS_PAGE,
  FILTER_MENU_MODAL,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  REQUEST_CANCELED,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import {
  fetchArtifactTags,
  fetchDataSet,
  fetchDataSets,
  removeDataSet,
  removeDataSets
} from '../../reducers/artifactsReducer'
import {
  checkForSelectedDataset,
  fetchDataSetRowData,
  filters,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerDatasetTitle
} from './datasets.util'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getViewMode } from '../../utils/helper'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setNotification } from '../../reducers/notificationReducer'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useYaml } from '../../hooks/yaml.hook'

import './datasets.scss'
import cssVariables from './datasets.scss'

const Datasets = () => {
  const [datasets, setDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [urlTagOption, tagAbortControllerRef] = useGetTagOptions(
    fetchArtifactTags,
    filters,
    DATASET_TYPE,
    DATASETS_FILTERS
  )
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const viewMode = getViewMode(window.location.search)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  const abortControllerRef = useRef(new AbortController())
  const datasetsRef = useRef(null)
  const tableBodyRef = useRef(null)
  const tableRef = useRef(null)

  const datasetsFilters = useMemo(
    () => ({
      name: filtersStore.name,
      ...filtersStore[FILTER_MENU_MODAL][DATASETS_FILTERS].values
    }),
    [filtersStore]
  )
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

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchDataSets({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setLargeRequestErrorMessage
            }
          }
        })
      )
        .unwrap()
        .then(result => {
          if (result) {
            setDatasets(result)
          }

          return result
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      dispatch(
        getFilterTagOptions({
          dispatch,
          fetchTags: fetchArtifactTags,
          project: params.projectName,
          category: DATASET_TYPE,
          config: {
            ui: {
              controller: tagAbortControllerRef.current,
              setLargeRequestErrorMessage
            }
          }
        })
      )
      setSelectedRowData({})
      setDatasets([])

      return fetchData(filters)
    },
    [dispatch, fetchData, params.projectName, tagAbortControllerRef]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => handleRefresh(datasetsFilters),
        getArtifact: () =>
          fetchDataSet({
            project: params.projectName,
            dataSet: artifact.db_key,
            iter: true,
            tag: TAG_FILTER_ALL_ITEMS
          }),
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName, datasetsFilters]
  )

  const actionsMenu = useMemo(
    () => (dataset, menuPosition) =>
      generateActionsMenu(
        dataset,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        datasetsFilters,
        menuPosition
      ),
    [
      datasetsFilters,
      dispatch,
      frontendSpec,
      handleAddTag,
      handleRefresh,
      params.projectName,
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
          }/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(datasetsFilters)
  }

  const handleRequestOnExpand = useCallback(
    async dataset => {
      await fetchDataSetRowData(
        dispatch,
        dataset,
        setSelectedRowData,
        datasetsFilters.iter,
        datasetsFilters.tag,
        params.projectName,
        frontendSpec
      )
    },
    [datasetsFilters.iter, datasetsFilters.tag, dispatch, frontendSpec, params.projectName]
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
    handleRequestOnExpand,
    null,
    DATASETS_PAGE
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createDatasetsRowData(contentItem, params.projectName, frontendSpec, true)
        })
      : datasets.map(contentItem =>
          createDatasetsRowData(contentItem, params.projectName, frontendSpec)
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

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, pageData.details.menu, params.name, params.tab, params.tag])

  useEffect(() => {
    if (urlTagOption && datasets.length === 0) {
      fetchData({
        tag: urlTagOption,
        iter: SHOW_ITERATIONS
      })
    }
  }, [datasets.length, fetchData, urlTagOption])

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
      setSelectedDataset,
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
      setSelectedDataset({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [dispatch, params.projectName, tagAbortControllerRef])

  const handleRegisterDataset = useCallback(() => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: DATASET_TYPE,
      params,
      refresh: () => handleRefresh(datasetsFilters),
      title: registerDatasetTitle
    })
  }, [handleRefresh, params, datasetsFilters])

  useEffect(() => setDatasets([]), [filtersStore.tag])

  const virtualizationConfig = useVirtualization({
    tableRef,
    tableBodyRef,
    rowsData: {
      content: sortedTableContent,
      expandedRowsData: selectedRowData,
      selectedItem: selectedDataset
    },
    heightData: {
      headerRowHeight: cssVariables.datasetsHeaderRowHeight,
      rowHeight: cssVariables.datasetsRowHeight,
      rowHeightExtended: cssVariables.datasetsRowHeightExtended
    }
  })

  return (
    <DatasetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      convertedYaml={convertedYaml}
      datasets={datasets}
      detailsFormInitialValues={detailsFormInitialValues}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      handleRegisterDataset={handleRegisterDataset}
      largeRequestErrorMessage={largeRequestErrorMessage}
      pageData={pageData}
      ref={{ datasetsRef, tableRef, tableBodyRef }}
      selectedDataset={selectedDataset}
      selectedRowData={selectedRowData}
      setDatasets={setDatasets}
      setSelectedDataset={setSelectedDataset}
      setSelectedRowData={setSelectedRowData}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      toggleConvertedYaml={toggleConvertedYaml}
      urlTagOption={urlTagOption}
      viewMode={viewMode}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default Datasets

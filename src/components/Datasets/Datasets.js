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
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import DatasetsView from './DatasetsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  ALL_VERSIONS_PATH,
  DATASETS_PAGE,
  DATASETS_TAB,
  DATASET_TYPE,
  GROUP_BY_NONE,
  REQUEST_CANCELED
} from '../../constants'
import { fetchArtifactTags, fetchDataSets, removeDataSets } from '../../reducers/artifactsReducer'
import {
  checkForSelectedDataset,
  getFiltersConfig,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerDatasetTitle
} from './datasets.util'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getViewMode } from '../../utils/helper'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setFullSelectedArtifact } from '../../utils/artifacts.util'
import { setNotification } from '../../reducers/notificationReducer'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { toggleYaml } from '../../reducers/appReducer'
import { transformSearchParams } from '../../utils/filter.util'

import './datasets.scss'
import cssVariables from './datasets.scss'

const Datasets = ({ isAllVersions = false }) => {
  const [datasets, setDatasets] = useState([])
  const [datasetVersions, setDatasetVersions] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [selectedDatasetMin, setSelectedDatasetMin] = useState({})
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
  const [, setSearchParams] = useSearchParams()
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const datasetsRef = useRef(null)

  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const filters = useFiltersFromSearchParams(filtersConfig)

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
      params.projectName,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, selectedDatasetMin])

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

      const requestParams = {
        format: 'minimal'
      }

      if (isAllVersions) {
        requestParams.name = params.datasetName
      } else {
        requestParams['partition-by'] = 'project_and_name'
      }

      return dispatch(
        fetchDataSets({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: requestParams
          }
        })
      )
        .unwrap()
        .then(result => {
          if (result) {
            if (isAllVersions) {
              setDatasetVersions(result)
            } else {
              setDatasets(result)
            }

            setMaxArtifactsErrorIsShown(result.length === 1000)
          }

          return result
        })
    },
    [dispatch, isAllVersions, params.datasetName, params.projectName]
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
      setSelectedDatasetMin({})
      setDatasets([])
      setDatasetVersions([])

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

  const showAllVersions = useCallback(
    datasetName => {
      navigate(
        `/projects/${params.projectName}/datasets/${datasetName}/${ALL_VERSIONS_PATH}?${transformSearchParams(window.location.search)}`
      )
    },
    [navigate, params.projectName]
  )

  const actionsMenu = useMemo(
    () => datasetMin =>
      generateActionsMenu(
        datasetMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        filters,
        selectedDataset,
        showAllVersions,
        isAllVersions
      ),
    [
      dispatch,
      filters,
      frontendSpec,
      handleAddTag,
      handleRefresh,
      isAllVersions,
      params.projectName,
      selectedDataset,
      showAllVersions,
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

  const applyDetailsChangesCallback = (changes, selectedItem) => {
    if ('tag' in changes.data) {
      if (isAllVersions) {
        setDatasetVersions([])
      } else {
        setDatasets([])
      }

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/${DATASETS_PAGE.toLowerCase()}/${params.datasetName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/:${
            changes.data.tag.currentFieldValue
          }@${selectedItem.uid}/overview${window.location.search}`,
          { replace: true }
        )
      }
    }

    handleRefresh(filters)
  }

  const tableContent = useMemo(() => {
    return (isAllVersions ? datasetVersions : datasets).map(contentItem =>
      createDatasetsRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [datasetVersions, datasets, isAllVersions, params.projectName])

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
    fetchData,
    fetchTags,
    filters,
    requestTrigger: isAllVersions
  })

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, pageData.details.menu, params.id, params.tab])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedDataset(
      params.datasetName,
      isAllVersions ? datasetVersions : datasets,
      params.id,
      params.projectName,
      setSelectedDatasetMin,
      navigate,
      isAllVersions
    )
  }, [
    datasetVersions,
    datasets,
    isAllVersions,
    navigate,
    params.id,
    params.datasetName,
    params.projectName
  ])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setDatasets([])
      setDatasetVersions([])
      dispatch(removeDataSets())
      setSelectedDatasetMin({})
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
      datasets={isAllVersions ? datasetVersions : datasets}
      datasetName={params.datasetName}
      detailsFormInitialValues={detailsFormInitialValues}
      filters={filters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefresh={handleRefresh}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRegisterDataset={handleRegisterDataset}
      isAllVersions={isAllVersions}
      maxArtifactsErrorIsShown={maxArtifactsErrorIsShown}
      pageData={pageData}
      projectName={params.projectName}
      ref={{ datasetsRef }}
      requestErrorMessage={requestErrorMessage}
      selectedDataset={selectedDataset}
      setMaxArtifactsErrorIsShown={setMaxArtifactsErrorIsShown}
      setSearchParams={setSearchParams}
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

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
import React, { useCallback, useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import DatasetsView from './DatasetsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  ALL_VERSIONS_PATH,
  DATASETS_PAGE,
  DATASETS_TAB,
  DATASET_TYPE,
  GROUP_BY_NONE,
  REQUEST_CANCELED,
  BE_PAGE,
  BE_PAGE_SIZE,
  ITERATIONS_FILTER,
  SHOW_ITERATIONS
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
import { toggleYaml } from '../../reducers/appReducer'
import { transformSearchParams } from '../../utils/filter.util'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { usePagination } from '../../hooks/usePagination.hook'

import './datasets.scss'

const Datasets = ({ isAllVersions = false }) => {
  const [datasets, setDatasets] = useState([])
  const [datasetVersions, setDatasetVersions] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [selectedDatasetMin, setSelectedDatasetMin] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const viewMode = getViewMode(window.location.search)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const paginationConfigDatasetsRef = useRef({})
  const paginationConfigDatasetVersionsRef = useRef({})
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const datasetsRef = useRef(null)

  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const datasetsFilters = useFiltersFromSearchParams(filtersConfig)

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

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      const requestParams = {
        format: 'minimal'
      }

      if (isAllVersions) {
        requestParams.name = params.datasetName
        setDatasetVersions([])
      } else {
        if (filters[ITERATIONS_FILTER] !== SHOW_ITERATIONS) {
          requestParams['partition-by'] = 'project_and_name'
          requestParams['partition-sort-by'] = 'updated'
        }
        
        setDatasets([])
      }

      if (!isAllVersions && !isEmpty(paginationConfigDatasetsRef.current)) {
        requestParams.page = paginationConfigDatasetsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigDatasetsRef.current[BE_PAGE_SIZE]
      }

      if (isAllVersions && !isEmpty(paginationConfigDatasetVersionsRef.current)) {
        requestParams.page = paginationConfigDatasetVersionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigDatasetVersionsRef.current[BE_PAGE_SIZE]
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
        .then(response => {
          if (response?.artifacts) {
            if (isAllVersions) {
              paginationConfigDatasetVersionsRef.current.paginationResponse = response.pagination
              setDatasetVersions(response.artifacts || [])
            } else {
              paginationConfigDatasetsRef.current.paginationResponse = response.pagination
              setDatasets(response.artifacts || [])
            }
          }

          return response
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

  const refreshDatasets = useCallback(
    filters => {
      fetchTags()
      setSelectedDatasetMin({})

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleRefreshWithFilters = useCallback(() => {
    refreshDatasets(datasetsFilters)
  }, [datasetsFilters, refreshDatasets])

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => refreshDatasets(datasetsFilters),
        projectName: params.projectName
      })
    },
    [params.projectName, refreshDatasets, datasetsFilters]
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
        refreshDatasets,
        datasetsFilters,
        selectedDataset,
        showAllVersions,
        isAllVersions
      ),
    [
      dispatch,
      datasetsFilters,
      frontendSpec,
      handleAddTag,
      refreshDatasets,
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

    refreshDatasets(datasetsFilters)
  }

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [location, navigate, pageData.details.menu, params.id, params.tab])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    return () => {
      setDatasets([])
      setDatasetVersions([])
    }
  }, [params.projectName])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
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
      refresh: () => refreshDatasets(datasetsFilters),
      title: registerDatasetTitle
    })
  }, [params, refreshDatasets, datasetsFilters])

  const [handleRefreshDatasets, paginatedDatasets, searchDatasetsParams, setSearchDatasetsParams] =
    usePagination({
      hidden: isAllVersions,
      content: datasets,
      refreshContent: refreshDatasets,
      filters: datasetsFilters,
      paginationConfigRef: paginationConfigDatasetsRef,
      resetPaginationTrigger: `${params.projectName}`
    })
  const [
    handleRefreshDatasetVersions,
    paginatedDatasetVersions,
    searchDatasetVersionsParams,
    setSearchDatasetVersionsParams
  ] = usePagination({
    hidden: !isAllVersions,
    content: datasetVersions,
    refreshContent: refreshDatasets,
    filters: datasetsFilters,
    paginationConfigRef: paginationConfigDatasetVersionsRef,
    resetPaginationTrigger: `${params.projectName}_${isAllVersions}`
  })

  const tableContent = useMemo(() => {
    return (isAllVersions ? paginatedDatasetVersions : paginatedDatasets).map(contentItem =>
      createDatasetsRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [isAllVersions, paginatedDatasetVersions, paginatedDatasets, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  useLayoutEffect(() => {
    checkForSelectedDataset(
      params.datasetName,
      isAllVersions ? paginatedDatasetVersions : paginatedDatasets,
      params.id,
      params.projectName,
      setSelectedDatasetMin,
      navigate,
      isAllVersions,
      isAllVersions ? searchDatasetVersionsParams : searchDatasetsParams,
      isAllVersions ? paginationConfigDatasetVersionsRef : paginationConfigDatasetsRef
    )
  }, [
    isAllVersions,
    navigate,
    params.id,
    params.datasetName,
    params.projectName,
    paginatedDatasetVersions,
    paginatedDatasets,
    searchDatasetVersionsParams,
    searchDatasetsParams
  ])

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      DATASETS_TAB,
      dispatch,
      navigate,
      selectedDatasetMin,
      setSelectedDataset,
      params.projectName,
      params.id,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, params.id, selectedDatasetMin])

  useEffect(() => {
    getAndSetSelectedArtifact()
  }, [getAndSetSelectedArtifact])

  return (
    <DatasetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      datasetName={params.datasetName}
      datasets={isAllVersions ? datasetVersions : datasets}
      detailsFormInitialValues={detailsFormInitialValues}
      filters={datasetsFilters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefreshDatasets={isAllVersions ? handleRefreshDatasetVersions : handleRefreshDatasets}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRegisterDataset={handleRegisterDataset}
      isAllVersions={isAllVersions}
      pageData={pageData}
      paginationConfigDatasetsRef={
        isAllVersions ? paginationConfigDatasetVersionsRef : paginationConfigDatasetsRef
      }
      projectName={params.projectName}
      ref={{ datasetsRef }}
      requestErrorMessage={requestErrorMessage}
      selectedDataset={selectedDataset}
      setSearchDatasetsParams={
        isAllVersions ? setSearchDatasetVersionsParams : setSearchDatasetsParams
      }
      setSelectedDatasetMin={setSelectedDatasetMin}
      tableContent={tableContent}
      tableHeaders={tableHeaders}
      viewMode={viewMode}
    />
  )
}

export default Datasets

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
import { isEmpty } from 'lodash'

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import DatasetsView from './DatasetsView'
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
  SHOW_ITERATIONS,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import {
  getFiltersConfig,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerDatasetTitle
} from './datasets.util'
import { createDatasetsRowData } from '../../utils/createArtifactsContent'
import { fetchArtifactTags, fetchDataSets, removeDataSets } from '../../reducers/artifactsReducer'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getSavedSearchParams, transformSearchParams } from '../../utils/filter.util'
import { getViewMode } from '../../utils/helper'
import { getCloseDetailsLink, isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { checkForSelectedArtifact, setFullSelectedArtifact } from '../../utils/artifacts.util'
import { setNotification } from '../../reducers/notificationReducer'
import { toggleYaml } from '../../reducers/appReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { useMode } from '../../hooks/mode.hook'
import { usePagination } from '../../hooks/usePagination.hook'
import { useRefreshAfterDelete } from '../../hooks/useRefreshAfterDelete.hook'

import './datasets.scss'

const Datasets = ({ isAllVersions = false }) => {
  const [datasets, setDatasets] = useState([])
  const [datasetVersions, setDatasetVersions] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const viewMode = getViewMode(window.location.search)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { isDemoMode } = useMode()
  const params = useParams()
  const paginationConfigDatasetsRef = useRef({})
  const paginationConfigDatasetVersionsRef = useRef({})
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const datasetsRef = useRef(null)
  const lastCheckedArtifactIdRef = useRef(null)

  const historyBackLink = useMemo(
    () => `/projects/${params.projectName}/datasets${getSavedSearchParams(location.search)}`,
    [location.search, params.projectName]
  )
  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const datasetsFilters = useFiltersFromSearchParams(filtersConfig)
  const [refreshAfterDeleteCallback, refreshAfterDeleteTrigger] = useRefreshAfterDelete(
    paginationConfigDatasetVersionsRef,
    historyBackLink,
    'artifacts',
    params.id && getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : DATASETS_TAB, true)
  )

  const pageData = useMemo(
    () => generatePageData(selectedDataset, viewMode, params, false, isDemoMode),
    [isDemoMode, selectedDataset, viewMode, params]
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
        setDatasetVersions(null)
      } else {
        if (
          filters[ITERATIONS_FILTER] !== SHOW_ITERATIONS ||
          filters[TAG_FILTER] === TAG_FILTER_ALL_ITEMS
        ) {
          requestParams['partition-by'] = 'project_and_name'
          requestParams['partition-sort-by'] = 'updated'
        }

        setDatasets(null)
      }

      if (!isAllVersions && !isEmpty(paginationConfigDatasetsRef.current)) {
        requestParams.page = paginationConfigDatasetsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigDatasetsRef.current[BE_PAGE_SIZE]
      }

      if (isAllVersions && !isEmpty(paginationConfigDatasetVersionsRef.current)) {
        requestParams.page = paginationConfigDatasetVersionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigDatasetVersionsRef.current[BE_PAGE_SIZE]
      }

      lastCheckedArtifactIdRef.current = null

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
          } else {
            if (isAllVersions) {
              setDatasetVersions([])
            } else {
              setDatasets([])
            }
          }

          return response
        })
        .catch(() => {
          if (isAllVersions) {
            setDatasetVersions([])
          } else {
            setDatasets([])
          }
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
      setSelectedDataset({})

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
        refreshAfterDeleteCallback,
        datasetsFilters,
        selectedDataset,
        showAllVersions,
        isAllVersions
      ),
    [
      datasetsFilters,
      dispatch,
      frontendSpec,
      handleAddTag,
      isAllVersions,
      params.projectName,
      refreshAfterDeleteCallback,
      refreshDatasets,
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
        setDatasetVersions(null)
      } else {
        setDatasets(null)
      }

      navigate(
        `/projects/${params.projectName}/${DATASETS_PAGE.toLowerCase()}/${params.datasetName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/${
          changes.data.tag.currentFieldValue ? `:${changes.data.tag.currentFieldValue}` : ''
        }@${selectedItem.uid}/overview${window.location.search}`,
        { replace: true }
      )
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
      setDatasets(null)
      setDatasetVersions(null)
    }
  }, [params.projectName])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
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
      refresh: () => refreshDatasets(datasetsFilters),
      title: registerDatasetTitle
    })
  }, [params, refreshDatasets, datasetsFilters])

  const [handleRefreshDatasets, paginatedDatasets, searchDatasetsParams, setSearchDatasetsParams] =
    usePagination({
      hidden: isAllVersions,
      content: datasets ?? [],
      refreshContent: refreshDatasets,
      filters: datasetsFilters,
      paginationConfigRef: paginationConfigDatasetsRef,
      resetPaginationTrigger: `${params.projectName}_${refreshAfterDeleteTrigger}`
    })
  const [
    handleRefreshDatasetVersions,
    paginatedDatasetVersions,
    searchDatasetVersionsParams,
    setSearchDatasetVersionsParams
  ] = usePagination({
    hidden: !isAllVersions,
    content: datasetVersions ?? [],
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

  useEffect(() => {
    checkForSelectedArtifact({
      artifactName: params.datasetName,
      artifacts: isAllVersions ? datasetVersions : datasets,
      dispatch,
      isAllVersions,
      navigate,
      paginatedArtifacts: isAllVersions ? paginatedDatasetVersions : paginatedDatasets,
      paginationConfigRef: isAllVersions
        ? paginationConfigDatasetVersionsRef
        : paginationConfigDatasetsRef,
      paramsId: params.id,
      projectName: params.projectName,
      searchParams: isAllVersions ? searchDatasetVersionsParams : searchDatasetsParams,
      setSearchParams: isAllVersions ? setSearchDatasetVersionsParams : setSearchDatasetsParams,
      setSelectedArtifact: setSelectedDataset,
      lastCheckedArtifactIdRef,
      tab: DATASETS_TAB
    })
  }, [
    isAllVersions,
    navigate,
    params.id,
    params.datasetName,
    params.projectName,
    paginatedDatasetVersions,
    paginatedDatasets,
    searchDatasetVersionsParams,
    searchDatasetsParams,
    datasetVersions,
    datasets,
    setSearchDatasetVersionsParams,
    setSearchDatasetsParams,
    dispatch
  ])

  useEffect(() => {
    if (isEmpty(selectedDataset)) {
      lastCheckedArtifactIdRef.current = null
    }
  }, [selectedDataset])

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      DATASETS_TAB,
      dispatch,
      navigate,
      params.datasetName,
      setSelectedDataset,
      params.projectName,
      params.id,
      isAllVersions
    )
  }, [dispatch, navigate, params.datasetName, params.projectName, params.id, isAllVersions])

  return (
    <DatasetsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      datasetName={params.datasetName}
      datasets={(isAllVersions ? datasetVersions : datasets) ?? []}
      detailsFormInitialValues={detailsFormInitialValues}
      filters={datasetsFilters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefreshDatasets={isAllVersions ? handleRefreshDatasetVersions : handleRefreshDatasets}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRegisterDataset={handleRegisterDataset}
      historyBackLink={historyBackLink}
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
      setSelectedDataset={setSelectedDataset}
      tableContent={tableContent}
      tableHeaders={tableHeaders}
      viewMode={viewMode}
    />
  )
}

export default Datasets

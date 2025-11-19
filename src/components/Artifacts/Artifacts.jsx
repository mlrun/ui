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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { chain, isEmpty, isNil } from 'lodash'
import PropTypes from 'prop-types'

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import ArtifactsView from './ArtifactsView'
import DeployModelPopUp from '../../elements/DeployModelPopUp/DeployModelPopUp'

import {
  ALL_VERSIONS_PATH,
  BE_PAGE,
  BE_PAGE_SIZE,
  FUNCTION_TYPE_SERVING,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  REQUEST_CANCELED,
  SHOW_ITERATIONS,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import { checkForSelectedArtifact } from '../../utils/artifacts.util'
import { fetchArtifactsFunctions, fetchArtifactTags } from '../../reducers/artifactsReducer'
import { fetchModelFeatureVector } from '../../reducers/detailsReducer'
import { getCloseDetailsLink, isDetailsTabExists } from '../../utils/link-helper.util'
import { getFeatureVectorData } from '../ModelsPage/Models/models.util'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getFiltersConfig } from './artifacts.util'
import { getSavedSearchParams, transformSearchParams } from 'igz-controls/utils/filter.util'
import { openPopUp, getViewMode } from 'igz-controls/utils/common.util'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { toggleYaml } from '../../reducers/appReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { useMode } from '../../hooks/mode.hook'
import { usePagination } from '../../hooks/usePagination.hook'
import { useRefreshAfterDelete } from '../../hooks/useRefreshAfterDelete.hook'
import { useTableScroll } from 'igz-controls/hooks/useTable.hook'

const Artifacts = ({
  actionButtons = [],
  artifactType,
  createArtifactsRowData,
  fetchArtifacts,
  generateActionsMenu,
  generateDetailsFormInitialValues,
  generatePageData,
  getArtifactFiltersConfig = null,
  handleApplyDetailsChanges,
  handleDeployArtifactFailure = null,
  isAllVersions = false,
  page,
  renderPageTabs = null,
  removeArtifacts,
  storeArtifactTypeLoading,
  tab = ''
}) => {
  const [artifacts, setArtifacts] = useState(null)
  const [artifactVersions, setArtifactVersions] = useState(null)
  const [selectedArtifact, setSelectedArtifact] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [isSelectedArtifactBeyondTheList, setSelectedArtifactIsBeyondTheList] = useState(false)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const detailsStore = useSelector(store => store.detailsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const { isDemoMode } = useMode()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const viewMode = getViewMode(window.location.search)
  const paginationConfigArtifactsRef = useRef({})
  const paginationConfigArtifactVersionsRef = useRef({})
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const artifactsRef = useRef(null)
  const lastCheckedArtifactIdRef = useRef(null)

  const historyBackLink = useMemo(
    () =>
      `/projects/${params.projectName}/${page}${tab ? `/${tab}` : ''}${getSavedSearchParams(location.search)}`,
    [location.search, page, params.projectName, tab]
  )
  const filtersConfig = useMemo(
    () => (getArtifactFiltersConfig || getFiltersConfig)(isAllVersions),
    [getArtifactFiltersConfig, isAllVersions]
  )
  const artifactsFilters = useFiltersFromSearchParams(filtersConfig)
  const [refreshAfterDeleteCallback, refreshAfterDeleteTrigger] = useRefreshAfterDelete(
    paginationConfigArtifactVersionsRef,
    historyBackLink,
    'artifacts',
    params.id &&
    getCloseDetailsLink(
      isAllVersions ? ALL_VERSIONS_PATH : tab || page,
      true,
      params.artifactName
    ),
    isAllVersions
  )
  const pageData = useMemo(
    () => generatePageData(viewMode, false, selectedArtifact, params, isDemoMode),
    [generatePageData, isDemoMode, params, selectedArtifact, viewMode]
  )
  const detailsFormInitialValues = useMemo(() => {
    return generateDetailsFormInitialValues(selectedArtifact, frontendSpec.internal_labels)
  }, [frontendSpec.internal_labels, generateDetailsFormInitialValues, selectedArtifact])

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const fetchData = useCallback(
    async filters => {
      abortControllerRef.current = new AbortController()

      const requestParams = {
        format: 'minimal'
      }

      if (isAllVersions) {
        requestParams.name = params.artifactName
        setArtifactVersions(null)
      } else {
        if (
          filters[ITERATIONS_FILTER] !== SHOW_ITERATIONS ||
          filters[TAG_FILTER] === TAG_FILTER_ALL_ITEMS
        ) {
          requestParams['partition-by'] = 'project_and_name'
          requestParams['partition-sort-by'] = 'updated'
        }

        setArtifacts(null)
      }

      if (!isAllVersions && !isEmpty(paginationConfigArtifactsRef.current)) {
        requestParams.page = paginationConfigArtifactsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigArtifactsRef.current[BE_PAGE_SIZE]
      }

      if (isAllVersions && !isEmpty(paginationConfigArtifactVersionsRef.current)) {
        requestParams.page = paginationConfigArtifactVersionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigArtifactVersionsRef.current[BE_PAGE_SIZE]
      }

      lastCheckedArtifactIdRef.current = null

      return dispatch(
        fetchArtifacts({
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
              paginationConfigArtifactVersionsRef.current.paginationResponse = response.pagination
              setArtifactVersions(response.artifacts || [])
            } else {
              paginationConfigArtifactsRef.current.paginationResponse = response.pagination
              setArtifacts(response.artifacts || [])
            }
          } else {
            if (isAllVersions) {
              setArtifactVersions([])
            } else {
              setArtifacts([])
            }
          }

          return response
        })
        .catch(() => {
          if (isAllVersions) {
            setArtifactVersions([])
          } else {
            setArtifacts([])
          }
        })
    },
    [dispatch, fetchArtifacts, isAllVersions, params.artifactName, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        dispatch,
        fetchTags: fetchArtifactTags,
        project: params.projectName,
        category: artifactType,
        config: {
          signal: tagAbortControllerRef.current.signal
        }
      })
    )
  }, [artifactType, dispatch, params.projectName])

  const refreshArtifacts = useCallback(
    filters => {
      fetchTags()
      setSelectedArtifact({})

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => refreshArtifacts(artifactsFilters),
        projectName: params.projectName
      })
    },
    [params.projectName, refreshArtifacts, artifactsFilters]
  )

  const showAllVersions = useCallback(
    artifactName => {
      navigate(
        `/projects/${params.projectName}/${page}${tab ? `/${tab}` : ''}/${artifactName}/${ALL_VERSIONS_PATH}?${transformSearchParams(window.location.search)}`
      )
    },
    [navigate, page, params.projectName, tab]
  )

  const handleDeployArtifact = useCallback(
    artifact => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchArtifactsFunctions({
          project: artifact.project,
          filters: {},
          config: {
            signal: abortControllerRef.current.signal,
            params: { format: 'minimal', kind: 'serving' }
          }
        })
      )
        .unwrap()
        .then(functions => {
          if (!isNil(functions)) {
            const functionOptions = chain(functions)
              .filter(func => func.type === FUNCTION_TYPE_SERVING && func.graph?.kind === 'router')
              .uniqBy('name')
              .map(func => ({ label: func.name, id: func.name }))
              .value()

            if (functionOptions.length > 0) {
              openPopUp(DeployModelPopUp, {
                model: artifact,
                functionList: functions,
                functionOptionList: functionOptions
              })
            } else {
              handleDeployArtifactFailure(params.projectName, artifact.db_key)
            }
          }
        })
    },
    [dispatch, handleDeployArtifactFailure, params.projectName]
  )

  const actionsMenu = useMemo(
    () => artifactMin =>
      generateActionsMenu(
        artifactMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        refreshArtifacts,
        refreshAfterDeleteCallback,
        artifactsFilters,
        selectedArtifact,
        showAllVersions,
        isAllVersions,
        false,
        handleDeployArtifact
      ),
    [
      artifactsFilters,
      dispatch,
      frontendSpec,
      generateActionsMenu,
      handleAddTag,
      handleDeployArtifact,
      isAllVersions,
      params.projectName,
      refreshAfterDeleteCallback,
      refreshArtifacts,
      selectedArtifact,
      showAllVersions,
      toggleConvertedYaml
    ]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        params.projectName,
        selectedArtifact,
        setNotification,
        dispatch
      )
    },
    [dispatch, handleApplyDetailsChanges, params.projectName, selectedArtifact]
  )

  const applyDetailsChangesCallback = (changes, selectedItem) => {
    if ('tag' in changes.data) {
      if (isAllVersions) {
        setArtifactVersions(null)
      } else {
        setArtifacts(null)
      }

      navigate(
        `/projects/${params.projectName}/${page}${tab ? `/${tab}` : ''}/${params.artifactName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/${changes.data.tag.currentFieldValue ? `:${changes.data.tag.currentFieldValue}` : ''
        }@${selectedItem.uid}/overview${window.location.search}`,
        { replace: true }
      )
    }

    refreshArtifacts(artifactsFilters)
  }

  const [
    handleRefreshArtifacts,
    paginatedArtifacts,
    searchArtifactsParams,
    setSearchArtifactsParams
  ] = usePagination({
    hidden: isAllVersions,
    content: artifacts ?? [],
    refreshContent: refreshArtifacts,
    filters: artifactsFilters,
    paginationConfigRef: paginationConfigArtifactsRef,
    resetPaginationTrigger: `${params.projectName}_${refreshAfterDeleteTrigger}`
  })

  const [
    handleRefreshArtifactVersions,
    paginatedArtifactVersions,
    searchArtifactVersionsParams,
    setSearchArtifactVersionsParams
  ] = usePagination({
    hidden: !isAllVersions,
    content: artifactVersions ?? [],
    refreshContent: refreshArtifacts,
    filters: artifactsFilters,
    paginationConfigRef: paginationConfigArtifactVersionsRef,
    resetPaginationTrigger: `${params.projectName}_${isAllVersions}`
  })

  useTableScroll({
    content: isAllVersions ? paginatedArtifactVersions : paginatedArtifacts,
    selectedItem: selectedArtifact,
    isAllVersions
  })

  const tableContent = useMemo(() => {
    return (isAllVersions ? paginatedArtifactVersions : paginatedArtifacts).map(contentItem =>
      createArtifactsRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [
    createArtifactsRowData,
    isAllVersions,
    paginatedArtifactVersions,
    paginatedArtifacts,
    params.projectName
  ])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.tab, params.id])

  useEffect(() => {
    if (isEmpty(selectedArtifact)) {
      lastCheckedArtifactIdRef.current = null
    }
  }, [selectedArtifact])

  const getAndSetSelectedArtifact = useCallback((ignoreLastCheckedArtifact = false) => {
    checkForSelectedArtifact({
      artifactName: params.artifactName,
      artifacts: isAllVersions ? artifactVersions : artifacts,
      dispatch,
      ignoreLastCheckedArtifact,
      isAllVersions,
      navigate,
      paginatedArtifacts: isAllVersions ? paginatedArtifactVersions : paginatedArtifacts,
      paginationConfigRef: isAllVersions
        ? paginationConfigArtifactVersionsRef
        : paginationConfigArtifactsRef,
      paramsId: params.id,
      projectName: params.projectName,
      searchParams: isAllVersions ? searchArtifactVersionsParams : searchArtifactsParams,
      setSearchParams: isAllVersions ? setSearchArtifactVersionsParams : setSearchArtifactsParams,
      setSelectedArtifact: setSelectedArtifact,
      setSelectedArtifactIsBeyondTheList,
      lastCheckedArtifactIdRef,
      page,
      tab
    })
  }, [
    artifactVersions,
    artifacts,
    dispatch,
    isAllVersions,
    navigate,
    page,
    paginatedArtifactVersions,
    paginatedArtifacts,
    params.artifactName,
    params.id,
    params.projectName,
    searchArtifactVersionsParams,
    searchArtifactsParams,
    setSearchArtifactVersionsParams,
    setSearchArtifactsParams,
    tab
  ])

  useEffect(() => getAndSetSelectedArtifact(true), [getAndSetSelectedArtifact])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      dispatch(removeArtifacts())
      setSelectedArtifact({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, dispatch, tagAbortControllerRef, removeArtifacts])

  useEffect(() => {
    return () => {
      setArtifacts(null)
      setArtifactVersions(null)
    }
  }, [params.projectName])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    if (
      selectedArtifact.feature_vector &&
      !detailsStore.error &&
      isEmpty(detailsStore.modelFeatureVectorData)
    ) {
      const { name, tag } = getFeatureVectorData(selectedArtifact.feature_vector)
      dispatch(fetchModelFeatureVector({ project: params.projectName, name, reference: tag }))
    }
  }, [
    detailsStore.error,
    detailsStore.modelFeatureVectorData,
    dispatch,
    params.projectName,
    selectedArtifact.feature_vector
  ])

  return (
    <ArtifactsView
      actionButtons={actionButtons}
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactName={params.artifactName}
      artifacts={(isAllVersions ? artifactVersions : artifacts) ?? []}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      filters={artifactsFilters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefreshArtifacts={
        isAllVersions ? handleRefreshArtifactVersions : handleRefreshArtifacts
      }
      historyBackLink={historyBackLink}
      isAllVersions={isAllVersions}
      isOnlyTabScreen={Boolean(tab)}
      isSelectedArtifactBeyondTheList={isSelectedArtifactBeyondTheList}
      page={page}
      pageData={pageData}
      paginationConfigArtifactsRef={
        isAllVersions ? paginationConfigArtifactVersionsRef : paginationConfigArtifactsRef
      }
      params={params}
      ref={{ artifactsRef }}
      requestErrorMessage={requestErrorMessage}
      renderPageTabs={renderPageTabs}
      selectedArtifact={selectedArtifact}
      setSearchArtifactsParams={
        isAllVersions ? setSearchArtifactVersionsParams : setSearchArtifactsParams
      }
      setSelectedArtifact={setSelectedArtifact}
      storeArtifactTypeLoading={storeArtifactTypeLoading}
      tab={tab}
      tableContent={tableContent}
      tableHeaders={tableHeaders}
      viewMode={viewMode}
    />
  )
}

Artifacts.propTypes = {
  actionButtons: PropTypes.array,
  artifactType: PropTypes.string.isRequired,
  createArtifactsRowData: PropTypes.func.isRequired,
  fetchArtifacts: PropTypes.func.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  generateDetailsFormInitialValues: PropTypes.func.isRequired,
  generatePageData: PropTypes.func.isRequired,
  getArtifactFiltersConfig: PropTypes.func,
  handleApplyDetailsChanges: PropTypes.func.isRequired,
  handleDeployArtifactFailure: PropTypes.func,
  isAllVersions: PropTypes.bool,
  page: PropTypes.string.isRequired,
  renderPageTabs: PropTypes.func,
  removeArtifacts: PropTypes.func.isRequired,
  storeArtifactTypeLoading: PropTypes.bool.isRequired,
  tab: PropTypes.string
}

export default Artifacts

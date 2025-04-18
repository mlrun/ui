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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import DocumentsView from './DocumentsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'

import {
  ALL_VERSIONS_PATH,
  BE_PAGE,
  BE_PAGE_SIZE,
  DOCUMENT_TYPE,
  DOCUMENTS_TAB,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  REQUEST_CANCELED,
  SHOW_ITERATIONS,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import {
  getFiltersConfig,
  generatePageData,
  handleApplyDetailsChanges,
  generateActionsMenu
} from './documents.util'
import { createDocumentsRowData } from '../../utils/createArtifactsContent'
import { fetchArtifactTags, fetchDocuments, removeDocuments } from '../../reducers/artifactsReducer'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getSavedSearchParams, transformSearchParams } from '../../utils/filter.util'
import { getViewMode } from '../../utils/helper'
import { getCloseDetailsLink, isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData } from '../../utils/convertChipsData'
import { checkForSelectedArtifact, setFullSelectedArtifact } from '../../utils/artifacts.util'
import { setNotification } from '../../reducers/notificationReducer'
import { toggleYaml } from '../../reducers/appReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { usePagination } from '../../hooks/usePagination.hook'
import { useRefreshAfterDelete } from '../../hooks/useRefreshAfterDelete.hook'

import './documents.scss'

const Documents = ({ isAllVersions = false }) => {
  const [documents, setDocuments] = useState(null)
  const [documentVersions, setDocumentVersions] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState({})
  const viewMode = getViewMode(window.location.search)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [isSelectedArtifactBeyondTheList, setSelectedArtifactIsBeyondTheList] = useState(false)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const documentsRef = useRef(null)
  const paginationConfigDocumentsRef = useRef({})
  const paginationConfigDocumentVersionsRef = useRef({})
  const lastCheckedArtifactIdRef = useRef(null)

  const historyBackLink = useMemo(
    () =>
      `/projects/${params.projectName}/${DOCUMENTS_TAB}${getSavedSearchParams(location.search)}`,
    [location.search, params.projectName]
  )
  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const documentsFilters = useFiltersFromSearchParams(filtersConfig)
  const pageData = useMemo(() => generatePageData(viewMode), [viewMode])
  const [refreshAfterDeleteCallback, refreshAfterDeleteTrigger] = useRefreshAfterDelete(
    paginationConfigDocumentVersionsRef,
    historyBackLink,
    'artifacts',
    params.id && getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : DOCUMENTS_TAB, true),
    isAllVersions
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedDocument?.tag ?? '',
      labels: parseChipsData(selectedDocument?.labels ?? {}, frontendSpec.internal_labels)
    }),
    [frontendSpec.internal_labels, selectedDocument?.labels, selectedDocument?.tag]
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
        requestParams.name = params.documentName
        setDocumentVersions(null)
      } else {
        if (
          filters[ITERATIONS_FILTER] !== SHOW_ITERATIONS ||
          filters[TAG_FILTER] === TAG_FILTER_ALL_ITEMS
        ) {
          requestParams['partition-by'] = 'project_and_name'
          requestParams['partition-sort-by'] = 'updated'
        }

        setDocuments(null)
      }

      if (!isAllVersions && !isEmpty(paginationConfigDocumentsRef.current)) {
        requestParams.page = paginationConfigDocumentsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigDocumentsRef.current[BE_PAGE_SIZE]
      }

      if (isAllVersions && !isEmpty(paginationConfigDocumentVersionsRef.current)) {
        requestParams.page = paginationConfigDocumentVersionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigDocumentVersionsRef.current[BE_PAGE_SIZE]
      }

      return dispatch(
        fetchDocuments({
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
              paginationConfigDocumentVersionsRef.current.paginationResponse = response.pagination
              setDocumentVersions(response.artifacts || [])
            } else {
              paginationConfigDocumentsRef.current.paginationResponse = response.pagination
              setDocuments(response.artifacts || [])
            }
          } else {
            if (isAllVersions) {
              setDocumentVersions([])
            } else {
              setDocuments([])
            }
          }

          return response
        })
        .catch(() => {
          if (isAllVersions) {
            setDocumentVersions([])
          } else {
            setDocuments([])
          }
        })
    },
    [dispatch, isAllVersions, params.documentName, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        dispatch,
        fetchTags: fetchArtifactTags,
        project: params.projectName,
        category: DOCUMENT_TYPE,
        config: {
          signal: tagAbortControllerRef.current.signal
        }
      })
    )
  }, [dispatch, params.projectName])

  const refreshDocuments = useCallback(
    filters => {
      fetchTags()
      setSelectedDocument({})

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => refreshDocuments(documentsFilters),
        projectName: params.projectName
      })
    },
    [params.projectName, refreshDocuments, documentsFilters]
  )

  const showAllVersions = useCallback(
    documentName => {
      navigate(
        `/projects/${params.projectName}/${DOCUMENTS_TAB}/${documentName}/${ALL_VERSIONS_PATH}?${transformSearchParams(window.location.search)}`
      )
    },
    [navigate, params.projectName]
  )

  const actionsMenu = useMemo(
    () => documentMin =>
      generateActionsMenu(
        documentMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        refreshDocuments,
        refreshAfterDeleteCallback,
        documentsFilters,
        selectedDocument,
        showAllVersions,
        isAllVersions
      ),
    [
      frontendSpec,
      dispatch,
      toggleConvertedYaml,
      handleAddTag,
      params.projectName,
      refreshDocuments,
      refreshAfterDeleteCallback,
      documentsFilters,
      selectedDocument,
      showAllVersions,
      isAllVersions
    ]
  )

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        params.projectName,
        selectedDocument,
        setNotification,
        dispatch
      )
    },
    [dispatch, params.projectName, selectedDocument]
  )

  const applyDetailsChangesCallback = (changes, selectedItem) => {
    if ('tag' in changes.data) {
      if (isAllVersions) {
        setDocumentVersions(null)
      } else {
        setDocuments(null)
      }

      navigate(
        `/projects/${params.projectName}/${DOCUMENTS_TAB}/${params.documentName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/${
          changes.data.tag.currentFieldValue ? `:${changes.data.tag.currentFieldValue}` : ''
        }@${selectedItem.uid}/overview${window.location.search}`,
        { replace: true }
      )
    }

    refreshDocuments(documentsFilters)
  }

  const [
    handleRefreshDocuments,
    paginatedDocuments,
    searchDocumentsParams,
    setSearchDocumentsParams
  ] = usePagination({
    hidden: isAllVersions,
    content: documents ?? [],
    refreshContent: refreshDocuments,
    filters: documentsFilters,
    paginationConfigRef: paginationConfigDocumentsRef,
    resetPaginationTrigger: `${params.projectName}_${refreshAfterDeleteTrigger}`
  })

  const [
    handleRefreshDocumentVersions,
    paginatedDocumentVersions,
    searchDocumentVersionsParams,
    setSearchDocumentVersionsParams
  ] = usePagination({
    hidden: !isAllVersions,
    content: documentVersions ?? [],
    refreshContent: refreshDocuments,
    filters: documentsFilters,
    paginationConfigRef: paginationConfigDocumentVersionsRef,
    resetPaginationTrigger: `${params.projectName}_${isAllVersions}`
  })

  const tableContent = useMemo(() => {
    return (isAllVersions ? paginatedDocumentVersions : paginatedDocuments).map(contentItem =>
      createDocumentsRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [paginatedDocumentVersions, paginatedDocuments, isAllVersions, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      DOCUMENTS_TAB,
      dispatch,
      navigate,
      params.documentName,
      setSelectedDocument,
      params.projectName,
      params.id,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, params.id, params.documentName])

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.id, params.tab])

  useEffect(() => {
    return () => {
      setDocuments(null)
      setDocumentVersions(null)
    }
  }, [params.projectName])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      dispatch(removeDocuments())
      setSelectedDocument({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, dispatch, tagAbortControllerRef])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedArtifact({
      artifactName: params.documentName,
      artifacts: isAllVersions ? documentVersions : documents,
      dispatch,
      isAllVersions,
      navigate,
      paginatedArtifacts: isAllVersions ? paginatedDocumentVersions : paginatedDocuments,
      paginationConfigRef: isAllVersions
        ? paginationConfigDocumentVersionsRef
        : paginationConfigDocumentsRef,
      paramsId: params.id,
      projectName: params.projectName,
      searchParams: isAllVersions ? searchDocumentVersionsParams : searchDocumentsParams,
      setSearchParams: isAllVersions ? setSearchDocumentVersionsParams : setSearchDocumentsParams,
      setSelectedArtifact: setSelectedDocument,
      setSelectedArtifactIsBeyondTheList,
      lastCheckedArtifactIdRef,
      tab: DOCUMENTS_TAB
    })
  }, [
    dispatch,
    documentVersions,
    documents,
    isAllVersions,
    navigate,
    paginatedDocumentVersions,
    paginatedDocuments,
    params.documentName,
    params.id,
    params.projectName,
    searchDocumentVersionsParams,
    searchDocumentsParams,
    setSearchDocumentVersionsParams,
    setSearchDocumentsParams
  ])

  useEffect(() => {
    if (isEmpty(selectedDocument)) {
      lastCheckedArtifactIdRef.current = null
    }
  }, [selectedDocument])

  return (
    <DocumentsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      documentName={params.documentName}
      documents={(isAllVersions ? documentVersions : documents) ?? []}
      filters={documentsFilters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefreshDocuments={
        isAllVersions ? handleRefreshDocumentVersions : handleRefreshDocuments
      }
      historyBackLink={historyBackLink}
      isAllVersions={isAllVersions}
      isSelectedArtifactBeyondTheList={isSelectedArtifactBeyondTheList}
      pageData={pageData}
      paginationConfigDocumentsRef={
        isAllVersions ? paginationConfigDocumentVersionsRef : paginationConfigDocumentsRef
      }
      projectName={params.projectName}
      ref={{ documentsRef }}
      requestErrorMessage={requestErrorMessage}
      selectedDocument={selectedDocument}
      setSearchDocumentsParams={
        isAllVersions ? setSearchDocumentVersionsParams : setSearchDocumentsParams
      }
      setSelectedDocument={setSelectedDocument}
      tableContent={tableContent}
      tableHeaders={tableHeaders}
      viewMode={viewMode}
    />
  )
}

Documents.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Documents

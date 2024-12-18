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
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import DocumentsView from './DocumentsView'
import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'

import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import {
  getFiltersConfig,
  generatePageData,
  handleApplyDetailsChanges,
  generateActionsMenu,
  checkForSelectedDocument
} from './documents.util'
import { getViewMode } from '../../utils/helper'
import { parseChipsData } from '../../utils/convertChipsData'
import { toggleYaml } from '../../reducers/appReducer'
import { setFullSelectedArtifact } from '../../utils/artifacts.util'
import {
  ALL_VERSIONS_PATH,
  DOCUMENT_TYPE,
  DOCUMENTS_TAB,
  GROUP_BY_NONE,
  REQUEST_CANCELED
} from '../../constants'
import { fetchArtifactTags, fetchDocuments, removeDocuments } from '../../reducers/artifactsReducer'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { openPopUp } from 'igz-controls/utils/common.util'
import { transformSearchParams } from '../../utils/filter.util'
import { createDocumentsRowData } from '../../utils/createArtifactsContent'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { setNotification } from '../../reducers/notificationReducer'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { useVirtualization } from '../../hooks/useVirtualization.hook'

import './documents.scss'
import cssVariables from './documents.scss'
import PropTypes from 'prop-types'

const Documents = ({ isAllVersions = false }) => {
  const [documents, setDocuments] = useState([])
  const [documentVersions, setDocumentVersions] = useState([])
  const [selectedDocument, setSelectedDocument] = useState({})
  const [, setSearchParams] = useSearchParams()
  const viewMode = getViewMode(window.location.search)
  const [selectedDocumentMin, setSelectedDocumentMin] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [maxArtifactsErrorIsShown, setMaxArtifactsErrorIsShown] = useState(false)
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

  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const filters = useFiltersFromSearchParams(filtersConfig)
  const pageData = useMemo(() => generatePageData(viewMode), [viewMode])

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

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      DOCUMENTS_TAB,
      dispatch,
      navigate,
      selectedDocumentMin,
      setSelectedDocument,
      params.projectName,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, selectedDocumentMin])

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      const requestParams = {
        format: 'minimal'
      }

      if (!isAllVersions) {
        requestParams['partition-by'] = 'project_and_name'
      } else {
        requestParams.name = params.documentName
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
        .then(result => {
          if (result) {
            if (isAllVersions) {
              setDocumentVersions(result)
            } else {
              setDocuments(result)
            }

            setMaxArtifactsErrorIsShown(result.length === 1000)
          }

          return result
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

  const handleRefresh = useCallback(
    filters => {
      fetchTags()
      setSelectedDocumentMin({})
      setDocuments([])
      setDocumentVersions([])

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
        handleRefresh,
        filters,
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
      handleRefresh,
      filters,
      selectedDocument,
      showAllVersions,
      isAllVersions
    ]
  )

  const tableContent = useMemo(() => {
    return (isAllVersions ? documentVersions : documents).map(contentItem =>
      createDocumentsRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [documentVersions, documents, isAllVersions, params.projectName])

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
        setDocumentVersions([])
      } else {
        setDocuments([])
      }

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/${DOCUMENTS_TAB}/${params.documentName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/:${
            changes.data.tag.currentFieldValue
          }@${selectedItem.uid}/overview${window.location.search}`,
          { replace: true }
        )
      }
    }

    handleRefresh(filters)
  }

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
  }, [navigate, location, pageData.details.menu, params.id, params.tab])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setDocuments([])
      setDocumentVersions([])
      dispatch(removeDocuments())
      setSelectedDocumentMin({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, dispatch, tagAbortControllerRef])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedDocument(
      params.documentName,
      isAllVersions ? documentVersions : documents,
      params.id,
      params.projectName,
      setSelectedDocumentMin,
      navigate,
      isAllVersions
    )
  }, [
    isAllVersions,
    navigate,
    params.id,
    params.documentName,
    params.projectName,
    documentVersions,
    documents
  ])

  useEffect(() => {
    getAndSetSelectedArtifact()
  }, [getAndSetSelectedArtifact])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: sortedTableContent,
      selectedItem: selectedDocument
    },
    heightData: {
      headerRowHeight: cssVariables.documentsHeaderRowHeight,
      rowHeight: cssVariables.documentsRowHeight,
      rowHeightExtended: cssVariables.documentsRowHeightExtended
    },
    activateTableScroll: true
  })

  return (
    <DocumentsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      documents={isAllVersions ? documentVersions : documents}
      documentName={params.documentName}
      filters={filters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefresh={handleRefresh}
      handleRefreshWithFilters={handleRefreshWithFilters}
      isAllVersions={isAllVersions}
      maxArtifactsErrorIsShown={maxArtifactsErrorIsShown}
      pageData={pageData}
      projectName={params.projectName}
      ref={{ documentsRef }}
      requestErrorMessage={requestErrorMessage}
      selectedDocument={selectedDocument}
      setMaxArtifactsErrorIsShown={setMaxArtifactsErrorIsShown}
      setSearchParams={setSearchParams}
      setSelectedDocumentMin={setSelectedDocumentMin}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      viewMode={viewMode}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

Documents.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Documents

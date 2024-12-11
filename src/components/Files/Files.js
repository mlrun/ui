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
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import FilesView from './FilesView'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  ALL_VERSIONS_PATH,
  ARTIFACT_OTHER_TYPE,
  ARTIFACT_TYPE,
  FILES_TAB,
  GROUP_BY_NONE,
  REQUEST_CANCELED
} from '../../constants'
import {
  checkForSelectedFile,
  getFiltersConfig,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerArtifactTitle
} from './files.util'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { fetchArtifactTags, fetchFiles, removeFiles } from '../../reducers/artifactsReducer'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getViewMode } from '../../utils/helper'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setFullSelectedArtifact } from '../../utils/artifacts.util'
import { setNotification } from '../../reducers/notificationReducer'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { toggleYaml } from '../../reducers/appReducer'

import './files.scss'
import cssVariables from './files.scss'
import { transformSearchParams } from '../../utils/filter.util'

const Files = ({ isAllVersions = false }) => {
  const [files, setFiles] = useState([])
  const [fileVersions, setFileVersions] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [selectedFileMin, setSelectedFileMin] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [maxArtifactsErrorIsShown, setMaxArtifactsErrorIsShown] = useState(false)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [, setSearchParams] = useSearchParams()
  const viewMode = getViewMode(window.location.search)
  const filters = useFiltersFromSearchParams(getFiltersConfig(isAllVersions))
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const filesRef = useRef(null)

  const pageData = useMemo(() => generatePageData(viewMode), [viewMode])

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedFile.tag ?? ''
    }),
    [selectedFile.tag]
  )

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      FILES_TAB,
      dispatch,
      navigate,
      selectedFileMin,
      setSelectedFile,
      params.projectName,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, selectedFileMin])

  useEffect(() => {
    getAndSetSelectedArtifact()
  }, [getAndSetSelectedArtifact])

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      const requestParams = {
        format: 'minimal'
      }

      if (!isAllVersions) {
        requestParams['partition-by'] = 'project_and_name'
      } else {
        requestParams.name = params.name
      }

      return dispatch(
        fetchFiles({
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
              setFileVersions(result)
            } else {
              setFiles(result)
            }

            setMaxArtifactsErrorIsShown(result.length === 1000)
          }

          return result
        })
    },
    [dispatch, isAllVersions, params.name, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        dispatch,
        fetchTags: fetchArtifactTags,
        project: params.projectName,
        category: ARTIFACT_OTHER_TYPE,
        config: {
          signal: tagAbortControllerRef.current.signal
        }
      })
    )
  }, [dispatch, params.projectName])

  const handleRefresh = useCallback(
    filters => {
      fetchTags()
      setSelectedFileMin({})
      setFiles([])
      setFileVersions([])

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
    filetName => {
      navigate(
        `/projects/${params.projectName}/files/${filetName}/${ALL_VERSIONS_PATH}?${transformSearchParams(window.location.search)}`
      )
    },
    [navigate, params.projectName]
  )

  const actionsMenu = useMemo(
    () => fileMin =>
      generateActionsMenu(
        fileMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        filters,
        selectedFile,
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
      selectedFile,
      showAllVersions,
      isAllVersions
    ]
  )

  const tableContent = useMemo(() => {
    return (isAllVersions ? fileVersions : files).map(contentItem =>
      createFilesRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [fileVersions, files, isAllVersions, params.projectName])

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
        selectedFile,
        setNotification,
        dispatch
      )
    },
    [dispatch, params.projectName, selectedFile]
  )

  const applyDetailsChangesCallback = (changes, selectedItem) => {
    if ('tag' in changes.data) {
      if (isAllVersions) {
        setFileVersions([])
      } else {
        setFiles([])
      }

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/files/${params.name}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/:${
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
      setFiles([])
      setFileVersions([])
      dispatch(removeFiles())
      setSelectedFileMin({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, dispatch, tagAbortControllerRef])


  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedFile(
      params.name,
      isAllVersions ? fileVersions : files,
      params.id,
      params.projectName,
      setSelectedFileMin,
      navigate,
      isAllVersions
    )
  }, [
    fileVersions,
    files,
    isAllVersions,
    navigate,
    params.id,
    params.name,
    params.projectName
  ])

  const handleRegisterArtifact = useCallback(() => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: ARTIFACT_TYPE,
      params,
      refresh: () => handleRefresh(filters),
      title: registerArtifactTitle
    })
  }, [params, handleRefresh, filters])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: sortedTableContent,
      selectedItem: selectedFile
    },
    heightData: {
      headerRowHeight: cssVariables.filesHeaderRowHeight,
      rowHeight: cssVariables.filesRowHeight,
      rowHeightExtended: cssVariables.filesRowHeightExtended
    },
    activateTableScroll: true
  })

  return (
    <FilesView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      files={isAllVersions ? fileVersions : files}
      fileName={params.name}
      filters={filters}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefresh={handleRefresh}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRegisterArtifact={handleRegisterArtifact}
      isAllVersions={isAllVersions}
      maxArtifactsErrorIsShown={maxArtifactsErrorIsShown}
      pageData={pageData}
      projectName={params.projectName}
      ref={{ filesRef }}
      requestErrorMessage={requestErrorMessage}
      selectedFile={selectedFile}
      setMaxArtifactsErrorIsShown={setMaxArtifactsErrorIsShown}
      setSearchParams={setSearchParams}
      setSelectedFileMin={setSelectedFileMin}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      viewMode={viewMode}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default Files

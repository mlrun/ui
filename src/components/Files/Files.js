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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import FilesView from './FilesView'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  ALL_VERSIONS_PATH,
  ARTIFACT_OTHER_TYPE,
  ARTIFACT_TYPE,
  BE_PAGE,
  BE_PAGE_SIZE,
  FILES_TAB,
  GROUP_BY_NONE,
  ITERATIONS_FILTER,
  REQUEST_CANCELED,
  SHOW_ITERATIONS,
  TAG_FILTER,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import {
  getFiltersConfig,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerArtifactTitle
} from './files.util'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { fetchArtifactTags, fetchFiles, removeFiles } from '../../reducers/artifactsReducer'
import { getFilterTagOptions, setFilters } from '../../reducers/filtersReducer'
import { getSavedSearchParams, transformSearchParams } from '../../utils/filter.util'
import { getViewMode } from '../../utils/helper'
import { getCloseDetailsLink, isDetailsTabExists } from '../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { checkForSelectedArtifact, setFullSelectedArtifact } from '../../utils/artifacts.util'
import { setNotification } from '../../reducers/notificationReducer'
import { toggleYaml } from '../../reducers/appReducer'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { usePagination } from '../../hooks/usePagination.hook'
import { useRefreshAfterDelete } from '../../hooks/useRefreshAfterDelete.hook'

import './files.scss'

const Files = ({ isAllVersions = false }) => {
  const [files, setFiles] = useState(null)
  const [fileVersions, setFileVersions] = useState(null)
  const [selectedFile, setSelectedFile] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [isSelectedArtifactBeyondTheList, setSelectedArtifactIsBeyondTheList] = useState('')
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const viewMode = getViewMode(window.location.search)
  const paginationConfigFilesRef = useRef({})
  const paginationConfigFileVersionsRef = useRef({})
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const filesRef = useRef(null)
  const lastCheckedArtifactIdRef = useRef(null)

  const historyBackLink = useMemo(
    () => `/projects/${params.projectName}/files${getSavedSearchParams(location.search)}`,
    [location.search, params.projectName]
  )
  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const filesFilters = useFiltersFromSearchParams(filtersConfig)
  const [refreshAfterDeleteCallback, refreshAfterDeleteTrigger] = useRefreshAfterDelete(
    paginationConfigFileVersionsRef,
    historyBackLink,
    'artifacts',
    params.id && getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : FILES_TAB, true),
    isAllVersions
  )

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

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      const requestParams = {
        format: 'minimal'
      }

      if (isAllVersions) {
        requestParams.name = params.fileName
        setFileVersions(null)
      } else {
        if (
          filters[ITERATIONS_FILTER] !== SHOW_ITERATIONS ||
          filters[TAG_FILTER] === TAG_FILTER_ALL_ITEMS
        ) {
          requestParams['partition-by'] = 'project_and_name'
          requestParams['partition-sort-by'] = 'updated'
        }

        setFiles(null)
      }

      if (!isAllVersions && !isEmpty(paginationConfigFilesRef.current)) {
        requestParams.page = paginationConfigFilesRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigFilesRef.current[BE_PAGE_SIZE]
      }

      if (isAllVersions && !isEmpty(paginationConfigFileVersionsRef.current)) {
        requestParams.page = paginationConfigFileVersionsRef.current[BE_PAGE]
        requestParams['page-size'] = paginationConfigFileVersionsRef.current[BE_PAGE_SIZE]
      }

      lastCheckedArtifactIdRef.current = null

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
        .then(response => {
          if (response?.artifacts) {
            if (isAllVersions) {
              paginationConfigFileVersionsRef.current.paginationResponse = response.pagination
              setFileVersions(response.artifacts || [])
            } else {
              paginationConfigFilesRef.current.paginationResponse = response.pagination
              setFiles(response.artifacts || [])
            }
          } else {
            if (isAllVersions) {
              setFileVersions([])
            } else {
              setFiles([])
            }
          }

          return response
        })
        .catch(() => {
          if (isAllVersions) {
            setFileVersions([])
          } else {
            setFiles([])
          }
        })
    },
    [dispatch, isAllVersions, params.fileName, params.projectName]
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

  const refreshFiles = useCallback(
    filters => {
      fetchTags()
      setSelectedFile({})

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => refreshFiles(filesFilters),
        projectName: params.projectName
      })
    },
    [params.projectName, refreshFiles, filesFilters]
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
        refreshFiles,
        refreshAfterDeleteCallback,
        filesFilters,
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
      refreshFiles,
      refreshAfterDeleteCallback,
      filesFilters,
      selectedFile,
      showAllVersions,
      isAllVersions
    ]
  )

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
        setFileVersions(null)
      } else {
        setFiles(null)
      }

      navigate(
        `/projects/${params.projectName}/files/${params.fileName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/${
          changes.data.tag.currentFieldValue ? `:${changes.data.tag.currentFieldValue}` : ''
        }@${selectedItem.uid}/overview${window.location.search}`,
        { replace: true }
      )
    }

    refreshFiles(filesFilters)
  }

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.id, params.tab])

  useEffect(() => {
    return () => {
      setFiles(null)
      setFileVersions(null)
    }
  }, [params.projectName])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      dispatch(removeFiles())
      setSelectedFile({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, dispatch, tagAbortControllerRef])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  const handleRegisterArtifact = useCallback(() => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: ARTIFACT_TYPE,
      params,
      refresh: () => refreshFiles(filesFilters),
      title: registerArtifactTitle
    })
  }, [params, refreshFiles, filesFilters])

  const [handleRefreshFiles, paginatedFiles, searchFilesParams, setSearchFilesParams] =
    usePagination({
      hidden: isAllVersions,
      content: files ?? [],
      refreshContent: refreshFiles,
      filters: filesFilters,
      paginationConfigRef: paginationConfigFilesRef,
      resetPaginationTrigger: `${params.projectName}_${refreshAfterDeleteTrigger}`
    })
  const [
    handleRefreshFileVersions,
    paginatedFileVersions,
    searchFileVersionsParams,
    setSearchFileVersionsParams
  ] = usePagination({
    hidden: !isAllVersions,
    content: fileVersions ?? [],
    refreshContent: refreshFiles,
    filters: filesFilters,
    paginationConfigRef: paginationConfigFileVersionsRef,
    resetPaginationTrigger: `${params.projectName}_${isAllVersions}`
  })

  const tableContent = useMemo(() => {
    return (isAllVersions ? paginatedFileVersions : paginatedFiles).map(contentItem =>
      createFilesRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [paginatedFileVersions, paginatedFiles, isAllVersions, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  useEffect(() => {
    checkForSelectedArtifact({
      artifactName: params.fileName,
      artifacts: isAllVersions ? fileVersions : files,
      dispatch,
      isAllVersions,
      navigate,
      paginatedArtifacts: isAllVersions ? paginatedFileVersions : paginatedFiles,
      paginationConfigRef: isAllVersions
        ? paginationConfigFileVersionsRef
        : paginationConfigFilesRef,
      paramsId: params.id,
      projectName: params.projectName,
      searchParams: isAllVersions ? searchFileVersionsParams : searchFilesParams,
      setSearchParams: isAllVersions ? setSearchFileVersionsParams : setSearchFilesParams,
      setSelectedArtifact: setSelectedFile,
      setSelectedArtifactIsBeyondTheList,
      lastCheckedArtifactIdRef,
      tab: FILES_TAB
    })
  }, [
    dispatch,
    fileVersions,
    files,
    isAllVersions,
    navigate,
    paginatedFileVersions,
    paginatedFiles,
    params.fileName,
    params.id,
    params.projectName,
    searchFileVersionsParams,
    searchFilesParams,
    setSearchFileVersionsParams,
    setSearchFilesParams
  ])

  useEffect(() => {
    if (isEmpty(selectedFile)) {
      lastCheckedArtifactIdRef.current = null
    }
  }, [selectedFile])

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      FILES_TAB,
      dispatch,
      navigate,
      params.fileName,
      setSelectedFile,
      params.projectName,
      params.id,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, params.id, params.fileName])

  return (
    <FilesView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      fileName={params.fileName}
      files={(isAllVersions ? fileVersions : files) ?? []}
      filters={filesFilters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefreshFiles={isAllVersions ? handleRefreshFileVersions : handleRefreshFiles}
      handleRegisterArtifact={handleRegisterArtifact}
      historyBackLink={historyBackLink}
      isAllVersions={isAllVersions}
      isSelectedArtifactBeyondTheList={isSelectedArtifactBeyondTheList}
      pageData={pageData}
      paginationConfigFilesRef={
        isAllVersions ? paginationConfigFileVersionsRef : paginationConfigFilesRef
      }
      projectName={params.projectName}
      ref={{ filesRef }}
      refreshFiles={refreshFiles}
      requestErrorMessage={requestErrorMessage}
      selectedFile={selectedFile}
      setSearchFilesParams={isAllVersions ? setSearchFileVersionsParams : setSearchFilesParams}
      setSelectedFile={setSelectedFile}
      tableContent={tableContent}
      tableHeaders={tableHeaders}
      viewMode={viewMode}
    />
  )
}

Files.propTypes = {
  isAllVersions: PropTypes.bool.isRequired
}

export default Files

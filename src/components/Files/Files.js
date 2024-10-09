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

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import FilesView from './FilesView'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import {
  ARTIFACT_OTHER_TYPE,
  ARTIFACT_TYPE,
  FILES_FILTERS,
  FILES_PAGE,
  FILES_TAB,
  FILTER_MENU_MODAL,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  REQUEST_CANCELED
} from '../../constants'
import {
  checkForSelectedFile,
  generateActionsMenu,
  generatePageData,
  handleApplyDetailsChanges,
  registerArtifactTitle
} from './files.util'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import {
  fetchArtifactTags,
  fetchFiles,
  removeFile,
  removeFiles
} from '../../reducers/artifactsReducer'
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
import { useInitialTableFetch } from '../../hooks/useInitialTableFetch.hook'
import { useVirtualization } from '../../hooks/useVirtualization.hook'
import { useYaml } from '../../hooks/yaml.hook'

import './files.scss'
import cssVariables from './files.scss'

const Files = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [selectedFileMin, setSelectedFileMin] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [maxArtifactsErrorIsShown, setMaxArtifactsErrorIsShown] = useState(false)
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const viewMode = getViewMode(window.location.search)

  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const filesRef = useRef(null)

  const pageData = useMemo(() => generatePageData(viewMode), [viewMode])

  const filesFilters = useMemo(
    () => ({ name: filtersStore.name, ...filtersStore[FILTER_MENU_MODAL][FILES_FILTERS].values }),
    [filtersStore]
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedFile.tag ?? ''
    }),
    [selectedFile.tag]
  )

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      FILES_TAB,
      dispatch,
      navigate,
      selectedFileMin,
      setSelectedFile,
      params.projectName
    )
  }, [dispatch, navigate, params.projectName, selectedFileMin])

  useEffect(() => {
    getAndSetSelectedArtifact()
  }, [getAndSetSelectedArtifact])

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      return dispatch(
        fetchFiles({
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
            setFiles(result)
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
      setSelectedRowData({})
      setSelectedFileMin({})
      setFiles([])

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => handleRefresh(filesFilters),
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName, filesFilters]
  )

  const actionsMenu = useMemo(
    () => (fileMin, menuPosition) =>
      generateActionsMenu(
        fileMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        filesFilters,
        menuPosition,
        selectedFile
      ),
    [
      dispatch,
      filesFilters,
      frontendSpec,
      handleAddTag,
      handleRefresh,
      params.projectName,
      toggleConvertedYaml,
      selectedFile
    ]
  )

  const handleRemoveRowData = useCallback(
    file => {
      const newStoreSelectedRowData = {
        ...artifactsStore.files.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[file.data.ui.identifier]
      delete newPageDataSelectedRowData[file.data.ui.identifier]

      dispatch(removeFile(newStoreSelectedRowData))
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.files.selectedRowData.content, dispatch, selectedRowData]
  )

  const handleExpand = useCallback(
    (file, content) => {
      const fileIdentifier = getArtifactIdentifier(file)

      setSelectedRowData(state => ({
        ...state,
        [fileIdentifier]: {
          content: sortListByDate(content[file.db_key ?? file.key], 'updated', false).map(artifact =>
            createFilesRowData(artifact, params.projectName)
          )
        },
        error: null,
        loading: false
      }))
    },
    [params.projectName]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    files,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleExpand,
    null,
    FILES_PAGE
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createFilesRowData(contentItem, params.projectName, frontendSpec, true)
        })
      : files.map(contentItem => createFilesRowData(contentItem, params.projectName, frontendSpec))
  }, [files, filtersStore.groupBy, frontendSpec, latestItems, params.projectName])

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

  const applyDetailsChangesCallback = changes => {
    if ('tag' in changes.data) {
      setSelectedRowData({})
      setFiles([])

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/files/${params.name}/${changes.data.tag.currentFieldValue}/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(filesFilters)
  }

  useInitialTableFetch({
    createRowData: rowItem => createFilesRowData(rowItem, params.projectName, frontendSpec),
    fetchData,
    fetchTags,
    filterMenuName: FILES_FILTERS,
    filters: filesFilters,
    setExpandedRowsData: setSelectedRowData,
    sortExpandedRowsDataBy: 'updated'
  })

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setFiles([])
      dispatch(removeFiles())
      setSelectedFileMin({})
      setSelectedRowData({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, dispatch, tagAbortControllerRef])

  useEffect(() => setFiles([]), [filtersStore.tag])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  const handleSelectFile = useCallback(
    file => {
      const { db_key: name, tag, iter, uid } = file

      checkForSelectedFile(
        name,
        selectedRowData,
        files,
        tag,
        iter,
        uid,
        navigate,
        params.projectName,
        setSelectedFileMin
      )
    },
    [files, navigate, params.projectName, selectedRowData]
  )

  useEffect(() => {
    if (params.name && isEmpty(selectedFileMin)) {
      handleSelectFile({ db_key: params.name, tag: params.tag, iter: params.iter })
    }
  }, [handleSelectFile, params.iter, params.name, params.tag, selectedFileMin])

  const handleRegisterArtifact = useCallback(() => {
    openPopUp(RegisterArtifactModal, {
      artifactKind: ARTIFACT_TYPE,
      params,
      refresh: () => handleRefresh(filesFilters),
      title: registerArtifactTitle
    })
  }, [handleRefresh, params, filesFilters])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: sortedTableContent,
      expandedRowsData: selectedRowData,
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
      convertedYaml={convertedYaml}
      detailsFormInitialValues={detailsFormInitialValues}
      files={files}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      handleRegisterArtifact={handleRegisterArtifact}
      handleSelectFile={handleSelectFile}
      maxArtifactsErrorIsShown={maxArtifactsErrorIsShown}
      pageData={pageData}
      ref={{ filesRef }}
      requestErrorMessage={requestErrorMessage}
      selectedFile={selectedFile}
      selectedRowData={selectedRowData}
      setFiles={setFiles}
      setMaxArtifactsErrorIsShown={setMaxArtifactsErrorIsShown}
      setSelectedFileMin={setSelectedFileMin}
      setSelectedRowData={setSelectedRowData}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      toggleConvertedYaml={toggleConvertedYaml}
      viewMode={viewMode}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default Files

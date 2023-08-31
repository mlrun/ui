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
import { isNil } from 'lodash'

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import FilesView from './FilesView'

import {
  FILES_FILTERS,
  FILES_PAGE,
  FILTER_MENU_MODAL,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import {
  checkForSelectedFile,
  fetchFilesRowData,
  filters,
  generatePageData,
  handleApplyDetailsChanges
} from './files.util'
import { cancelRequest } from '../../utils/cancelRequest'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { fetchFile, fetchFiles, removeFile, removeFiles } from '../../reducers/artifactsReducer'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setArtifactTags } from '../../utils/artifacts.util'
import { setFilters } from '../../reducers/filtersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useYaml } from '../../hooks/yaml.hook'
import { getViewMode } from '../../utils/helper'

import { ReactComponent as TagIcon } from 'igz-controls/images/tag-icon.svg'
import { ReactComponent as YamlIcon } from 'igz-controls/images/yaml.svg'

const Files = () => {
  const [files, setFiles] = useState([])
  const [allFiles, setAllFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [urlTagOption] = useGetTagOptions(null, filters, null, FILES_FILTERS)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const filesRef = useRef(null)
  const viewMode = getViewMode(window.location.search)
  const pageData = useMemo(() => generatePageData(selectedFile, viewMode), [selectedFile, viewMode])
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const filesFilters = useMemo(
    () => filtersStore[FILTER_MENU_MODAL][FILES_FILTERS].values,
    [filtersStore]
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedFile.tag ?? ''
    }),
    [selectedFile.tag]
  )

  const fetchData = useCallback(
    filters => {
      dispatch(fetchFiles({ project: params.projectName, filters }))
        .unwrap()
        .then(filesResponse => {
          setArtifactTags(filesResponse, setFiles, setAllFiles, filters, dispatch, FILES_PAGE)

          return filesResponse
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      setSelectedRowData({})
      setFiles([])
      setAllFiles([])

      return fetchData(filters)
    },
    [fetchData]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: handleRefresh,
        getArtifact: () =>
          fetchFile({
            project: params.projectName,
            file: artifact.db_key,
            iter: true,
            tag: TAG_FILTER_ALL_ITEMS
          }),
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName]
  )

  const actionsMenu = useMemo(
    () => [
      {
        label: 'Add a tag',
        icon: <TagIcon />,
        onClick: handleAddTag
      },
      {
        label: 'View YAML',
        icon: <YamlIcon />,
        onClick: toggleConvertedYaml
      }
    ],
    [handleAddTag, toggleConvertedYaml]
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

  const handleRequestOnExpand = useCallback(
    async file => {
      await fetchFilesRowData(
        file,
        setSelectedRowData,
        dispatch,
        params.projectName,
        filesFilters.iter,
        filesFilters.tag,
        frontendSpec
      )
    },
    [dispatch, filesFilters.iter, filesFilters.tag, frontendSpec, params.projectName]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    files,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleRequestOnExpand,
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
      setAllFiles([])

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/files/${params.name}/${changes.data.tag.currentFieldValue}/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(filesFilters)
  }

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    if (isNil(filtersStore.tagOptions) && urlTagOption) {
      fetchData({ ...filesFilters, tag: urlTagOption })
    }
  }, [fetchData, filesFilters, filtersStore, urlTagOption])

  useEffect(() => {
    return () => {
      setFiles([])
      setAllFiles([])
      dispatch(removeFiles())
      setSelectedFile({})
      cancelRequest('cancel')
    }
  }, [params.projectName, dispatch])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedFile(
      params.name,
      selectedRowData,
      allFiles,
      params.tag,
      params.iter,
      params.uid,
      navigate,
      params.projectName,
      setSelectedFile
    )
  }, [
    allFiles,
    navigate,
    params.iter,
    params.name,
    params.projectName,
    params.tag,
    params.uid,
    selectedRowData
  ])

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
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={filesRef}
      selectedFile={selectedFile}
      selectedRowData={selectedRowData}
      setFiles={setFiles}
      setSelectedFile={setSelectedFile}
      setSelectedRowData={setSelectedRowData}
      tableContent={tableContent}
      toggleConvertedYaml={toggleConvertedYaml}
      viewMode={viewMode}
      urlTagOption={urlTagOption}
    />
  )
}

export default Files

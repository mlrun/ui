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
import { connect, useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import AddArtifactTagPopUp from '../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import FilesView from './FilesView'

import {
  ARTIFACT_OTHER_TYPE,
  FILES_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import {
  checkForSelectedFile,
  fetchFilesRowData,
  filters,
  generatePageData,
  handleApplyDetailsChanges
} from './files.util'
import {
  fetchArtifactTags,
  fetchFiles,
  removeFile,
  removeFiles
} from '../../reducers/artifactsReducer'
import { cancelRequest } from '../../utils/cancelRequest'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { useYaml } from '../../hooks/yaml.hook'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Files = ({ setNotification, getFilterTagOptions, setFilters }) => {
  const [urlTagOption] = useGetTagOptions(fetchArtifactTags, filters, ARTIFACT_OTHER_TYPE)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const filesRef = useRef(null)
  const pageData = useMemo(() => generatePageData(selectedFile), [selectedFile])

  const fetchData = useCallback(
    filters => {
      dispatch(fetchFiles({ project: params.projectName, filters }))
        .unwrap()
        .then(result => {
          if (result) {
            setFiles(result)
          }

          return result
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      getFilterTagOptions(fetchArtifactTags, params.projectName, ARTIFACT_OTHER_TYPE)
      setSelectedRowData({})
      setFiles([])

      return fetchData(filters)
    },
    [fetchData, getFilterTagOptions, params.projectName]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: handleRefresh,
        onInit: () => fetchFile(params.projectName, artifact.db_key, true, TAG_FILTER_ALL_ITEMS),
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName]
  )

  const actionsMenu = useMemo(
    () => [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      },
      {
        label: 'Add a tag',
        onClick: handleAddTag
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
        filtersStore.iter,
        filtersStore.tag
      )
    },
    [dispatch, filtersStore.iter, filtersStore.tag, params.projectName]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    files,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleRequestOnExpand,
    FILES_PAGE
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createFilesRowData(contentItem, params.projectName, true)
        })
      : files.map(contentItem => createFilesRowData(contentItem, params.projectName))
  }, [files, filtersStore.groupBy, latestItems, params.projectName])

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
    [dispatch, params.projectName, selectedFile, setNotification]
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

    handleRefresh(filtersStore)
  }

  useEffect(() => {
    dispatch(removeFile({}))
    setSelectedRowData({})
  }, [filtersStore.iter, filtersStore.tag, dispatch])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    if (urlTagOption) {
      fetchData({ tag: urlTagOption, iter: SHOW_ITERATIONS })
    }
  }, [fetchData, urlTagOption])

  useEffect(() => {
    return () => {
      setFiles([])
      dispatch(removeFiles())
      setSelectedFile({})
      cancelRequest('cancel')
    }
  }, [params.projectName, dispatch])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filtersStore.iter)) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [filtersStore.tag, filtersStore.iter, filtersStore.groupBy, setFilters])

  useEffect(() => {
    checkForSelectedFile(
      params.name,
      selectedRowData,
      files,
      params.tag,
      params.iter,
      params.uid,
      navigate,
      params.projectName,
      setSelectedFile
    )
  }, [
    files,
    navigate,
    params.iter,
    params.name,
    params.projectName,
    params.tag,
    params.uid,
    selectedRowData
  ])

  useEffect(() => setFiles([]), [filtersStore.tag])

  return (
    <FilesView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      convertedYaml={convertedYaml}
      files={files}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      pageData={pageData}
      ref={filesRef}
      selectedFile={selectedFile}
      selectedRowData={selectedRowData}
      setSelectedFile={setSelectedFile}
      tableContent={tableContent}
      toggleConvertedYaml={toggleConvertedYaml}
    />
  )
}

export default connect(null, { ...filtersActions, ...notificationActions })(Files)

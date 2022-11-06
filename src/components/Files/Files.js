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
import { connect, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import FilesView from './FilesView'

import artifactsAction from '../../actions/artifacts'
import { generatePageData, filters, fetchFilesRowData, checkForSelectedFile } from './files.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'
import {
  FILES_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import filtersActions from '../../actions/filters'
import { createFilesRowData } from '../../utils/createArtifactsContent'
import { useYaml } from '../../hooks/yaml.hook'
import { useGroupContent } from '../../hooks/groupContent.hook'
import { cancelRequest } from '../../utils/cancelRequest'

import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

const Files = ({
  fetchArtifactTags,
  fetchFile,
  fetchFiles,
  getFilterTagOptions,
  removeFile,
  removeFiles,
  setFilters
}) => {
  const urlTagOption = useGetTagOptions(fetchArtifactTags, filters)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const filesRef = useRef(null)
  const pageData = useMemo(() => generatePageData(selectedFile), [selectedFile])

  const actionsMenu = useMemo(
    () => [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      fetchFiles(params.projectName, filters).then(result => {
        if (result) {
          setFiles(result)
        }

        return result
      })
    },
    [fetchFiles, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      getFilterTagOptions(fetchArtifactTags, params.projectName)

      return fetchData(filters)
    },
    [fetchArtifactTags, fetchData, getFilterTagOptions, params.projectName]
  )

  const handleRemoveRowData = useCallback(
    file => {
      const newStoreSelectedRowData = {
        ...artifactsStore.files.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[file.data.ui.identifier]
      delete newPageDataSelectedRowData[file.data.ui.identifier]

      removeFile(newStoreSelectedRowData)
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.files.selectedRowData.content, removeFile, selectedRowData]
  )

  const handleRequestOnExpand = useCallback(
    async file => {
      await fetchFilesRowData(
        file,
        setSelectedRowData,
        fetchFile,
        params.projectName,
        filtersStore.iter,
        filtersStore.tag,
        selectedFile
      )
    },
    [fetchFile, filtersStore.iter, filtersStore.tag, params.projectName, selectedFile]
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
          return createFilesRowData(contentItem, params.projectName, !isEmpty(selectedFile), true)
        })
      : files.map(contentItem =>
          createFilesRowData(contentItem, params.projectName, !isEmpty(selectedFile))
        )
  }, [files, filtersStore.groupBy, latestItems, params.projectName, selectedFile])

  useEffect(() => {
    removeFile({})
    setSelectedRowData({})
  }, [filtersStore.iter, filtersStore.tag, removeFile])

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
      removeFiles()
      setSelectedFile({})
      cancelRequest('cancel')
    }
  }, [params.projectName, removeFiles])

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
      navigate,
      params.projectName,
      setSelectedFile
    )
  }, [files, navigate, params.iter, params.name, params.projectName, params.tag, selectedRowData])

  useEffect(() => setFiles([]), [filtersStore.tag])

  return (
    <FilesView
      actionsMenu={actionsMenu}
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

export default connect(null, { ...artifactsAction, ...filtersActions })(Files)

import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import {
  detailsMenu,
  filters,
  page,
  registerArtifactDialogTitle,
  tableHeaders,
  infoHeaders
} from './files.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import { filterArtifacts } from '../../utils/filterArtifacts'

import { ARTIFACTS } from '../../constants'
import { generateUri } from '../../utils/resources'

const Files = ({
  artifactsStore,
  fetchFile,
  fetchFiles,
  history,
  match,
  removeFile,
  removeFiles,
  setArtifactFilter
}) => {
  const [files, setFiles] = useState([])
  const [yamlContent, setYamlContent] = useState({
    allData: [],
    selectedRowData: []
  })
  const [groupFilter, setGroupFilter] = useState('')
  const [selectedFile, setSelectedFile] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData, setPageData] = useState({
    detailsMenu,
    filters,
    page,
    registerArtifactDialogTitle,
    tableHeaders,
    infoHeaders
  })

  const fetchData = useCallback(
    item => {
      fetchFiles(item).then(result => {
        if (result) {
          setFiles(generateArtifacts(filterArtifacts(result)))
          setYamlContent(state => ({
            ...state,
            allData: result
          }))
        }

        return result
      })
    },
    [fetchFiles]
  )

  const handleRemoveFile = useCallback(
    file => {
      const newSelectedRowData = {
        ...artifactsStore.files.selectedRowData
      }

      delete newSelectedRowData[file.db_key]

      removeFile(newSelectedRowData)
    },
    [artifactsStore.files.selectedRowData, removeFile]
  )

  const handleRequestOnExpand = useCallback(
    async item => {
      let result = []

      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [item.db_key]: {
            loading: true
          }
        }
      }))

      try {
        result = await fetchFile(item)
      } catch (error) {
        setPageData(state => ({
          ...state,
          selectedRowData: {
            ...state.selectedRowData,
            [item.db_key]: {
              ...state.selectedRowData[item.db_key],
              error,
              loading: false
            }
          }
        }))
      }

      if (result?.length > 0) {
        setYamlContent(state => ({
          ...state,
          selectedRowData: result
        }))
        setPageData(state => {
          return {
            ...state,
            selectedRowData: {
              ...state.selectedRowData,
              [item.db_key]: {
                content: [...generateArtifacts(filterArtifacts(result))],
                error: null,
                loading: false
              }
            }
          }
        })
      }
    },
    [fetchFile]
  )

  const handleExpandRow = useCallback((item, isCollapse) => {
    if (isCollapse) {
      setYamlContent(state => ({
        ...state,
        selectedRowData: []
      }))
    }
  }, [])

  useEffect(() => {
    fetchData({ project: match.params.projectName, tag: 'latest' })

    return () => {
      setGroupFilter('')
      setFiles([])
      removeFiles()
      setSelectedFile({})
      setYamlContent({
        allData: [],
        selectedRowData: []
      })
      setArtifactFilter({ tag: 'latest', labels: '', name: '' })
    }
  }, [fetchData, match.params.projectName, removeFiles, setArtifactFilter])

  useEffect(() => {
    if (artifactsStore.filter.tag === 'latest') {
      setGroupFilter('name')
    } else if (groupFilter.length > 0) {
      setGroupFilter('')
    }
  }, [match.params.pageTab, groupFilter.length, artifactsStore.filter])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      handleRequestOnExpand,
      handleRemoveRequestData: handleRemoveFile
    }))
  }, [handleRemoveFile, handleRequestOnExpand])

  useEffect(() => {
    if (match.params.name) {
      const { name, tag } = match.params
      const artifacts =
        artifactsStore.files.selectedRowData.content[name] ||
        artifactsStore.files.allData

      if (artifacts.length !== 0) {
        const searchItem = artifacts.find(
          item =>
            item.db_key === name && (item.tag === tag || item.tree === tag)
        )

        if (!searchItem) {
          history.push(`/projects/${match.params.projectName}/files`)
        } else {
          searchItem.URI = generateUri(searchItem, ARTIFACTS)
          setSelectedFile({ item: searchItem })
        }
      } else {
        setSelectedFile({})
      }
    }
  }, [
    artifactsStore.dataSets.allData,
    artifactsStore.dataSets.selectedRowData.content,
    artifactsStore.files,
    history,
    match.params
  ])

  const handleFilesTreeFilterChange = useCallback(
    item => {
      handleArtifactTreeFilterChange(
        fetchData,
        artifactsStore.filter,
        item,
        match.params.projectName,
        setArtifactFilter,
        setFiles
      )
    },
    [
      artifactsStore.filter,
      fetchData,
      match.params.projectName,
      setArtifactFilter
    ]
  )

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={files}
        expandRow={handleExpandRow}
        groupFilter={groupFilter}
        handleArtifactFilterTree={handleFilesTreeFilterChange}
        handleCancel={() => setSelectedFile({})}
        handleSelectItem={item => setSelectedFile({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedFile.item}
        yamlContent={yamlContent}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactFilter={artifactsStore.filter}
          artifactKind="file"
          match={match}
          refresh={fetchData}
          setIsPopupOpen={setIsPopupDialogOpen}
          title={pageData.registerArtifactDialogTitle}
        />
      )}
    </>
  )
}

Files.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction
})(Files)

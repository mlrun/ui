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
import { filterArtifacts } from '../../utils/filterArtifacts'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { generateUri } from '../../utils/resources'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'

import {
  ARTIFACTS,
  INIT_TAG_FILTER,
  INIT_GROUP_FILTER,
  FILES_PAGE
} from '../../constants'
import filtersActions from '../../actions/filters'

const Files = ({
  artifactsStore,
  fetchFile,
  fetchFiles,
  filtersStore,
  history,
  match,
  removeFile,
  removeFiles,
  setFilters
}) => {
  const [files, setFiles] = useState([])
  const [yamlContent, setYamlContent] = useState({
    allData: [],
    selectedRowData: []
  })
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
    filters => {
      fetchFiles(match.params.projectName, filters).then(result => {
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
    [fetchFiles, match.params.projectName]
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
        result = await fetchFile(item.project, item.db_key, !filtersStore.iter)
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
                content: [
                  ...generateArtifacts(
                    filterArtifacts(result),
                    !filtersStore.iter
                  )
                ],
                error: null,
                loading: false
              }
            }
          }
        })
      }
    },
    [fetchFile, filtersStore.iter]
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
    if (
      match.params.name &&
      match.params.tag &&
      pageData.detailsMenu.length > 0
    ) {
      isDetailsTabExists(
        FILES_PAGE,
        match.params,
        pageData.detailsMenu,
        history
      )
    }
  }, [history, match.params, pageData.detailsMenu])

  useEffect(() => {
    fetchData({ tag: INIT_TAG_FILTER, iter: 'iter' })

    return () => {
      setFiles([])
      removeFiles()
      setSelectedFile({})
      setYamlContent({
        allData: [],
        selectedRowData: []
      })
    }
  }, [fetchData, removeFiles])

  useEffect(() => {
    if (filtersStore.tag === INIT_TAG_FILTER) {
      setFilters({ groupBy: INIT_GROUP_FILTER })
    } else if (filtersStore.groupBy === INIT_GROUP_FILTER) {
      setFilters({ groupBy: 'none' })
    }
  }, [match.params.pageTab, filtersStore.tag, filtersStore.groupBy, setFilters])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      handleRequestOnExpand,
      handleRemoveRequestData: handleRemoveFile
    }))
  }, [handleRemoveFile, handleRequestOnExpand])

  useEffect(() => {
    if (match.params.name) {
      const { name, tag, iter } = match.params
      const artifacts =
        artifactsStore.files.selectedRowData.content[name] ||
        artifactsStore.files.allData

      if (artifacts.length) {
        const searchItem = searchArtifactItem(artifacts, name, tag, iter)

        if (!searchItem) {
          history.replace(`/projects/${match.params.projectName}/files`)
        } else {
          searchItem.URI = generateUri(searchItem, ARTIFACTS)
          setSelectedFile({ item: searchItem })
        }
      }
    } else {
      setSelectedFile({})
    }
  }, [
    artifactsStore,
    artifactsStore.dataSets.allData,
    artifactsStore.dataSets.selectedRowData.content,
    artifactsStore.files,
    history,
    match,
    match.params,
    pageData
  ])

  useEffect(() => setFiles([]), [filtersStore.tag])

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={files}
        expandRow={handleExpandRow}
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

export default connect(
  ({ artifactsStore, filtersStore }) => ({
    artifactsStore,
    filtersStore
  }),
  { ...artifactsAction, ...filtersActions }
)(Files)

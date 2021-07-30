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
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'

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
        }

        return result
      })
    },
    [fetchFiles, match.params.projectName]
  )

  const handleRemoveFile = useCallback(
    file => {
      const newStoreSelectedRowData = {
        ...artifactsStore.files.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[file.key.value]
      delete newPageDataSelectedRowData[file.key.value]

      removeFile(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [
      artifactsStore.files.selectedRowData.content,
      pageData.selectedRowData,
      removeFile
    ]
  )

  const handleRequestOnExpand = useCallback(
    async file => {
      const fileIdentifier = getArtifactIdentifier(file)
      let result = []

      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [fileIdentifier]: {
            loading: true
          }
        }
      }))

      try {
        result = await fetchFile(file.project, file.db_key, !filtersStore.iter)
      } catch (error) {
        setPageData(state => ({
          ...state,
          selectedRowData: {
            ...state.selectedRowData,
            [fileIdentifier]: {
              ...state.selectedRowData[fileIdentifier],
              error,
              loading: false
            }
          }
        }))
      }

      if (result?.length > 0) {
        setPageData(state => {
          return {
            ...state,
            selectedRowData: {
              ...state.selectedRowData,
              [fileIdentifier]: {
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

  useEffect(() => {
    removeFile({})
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, removeFile])

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
    artifactsStore.files.allData,
    artifactsStore.files.selectedRowData.content,
    history,
    match.params,
    pageData
  ])

  useEffect(() => setFiles([]), [filtersStore.tag])

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={files}
        handleCancel={() => setSelectedFile({})}
        handleSelectItem={item => setSelectedFile({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedFile.item}
        getIdentifier={getArtifactIdentifier}
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

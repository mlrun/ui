import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generatePageData } from './files.util'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { generateUri } from '../../utils/resources'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import {
  ARTIFACTS,
  INIT_TAG_FILTER,
  INIT_GROUP_FILTER,
  FILES_PAGE
} from '../../constants'
import filtersActions from '../../actions/filters'

const Files = ({
  artifactsStore,
  fetchArtifactTags,
  fetchFile,
  fetchFiles,
  filtersStore,
  getFilterTagOptions,
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
    details: {
      menu: [],
      infoHeaders: []
    },
    filters: [],
    page: '',
    registerArtifactDialogTitle: '',
    tableHeaders: []
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
    setPageData(state => ({
      ...state,
      ...generatePageData(!isEveryObjectValueEmpty(selectedFile))
    }))
  }, [selectedFile])

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
      pageData.details.menu.length > 0
    ) {
      isDetailsTabExists(FILES_PAGE, match, pageData.details.menu, history)
    }
  }, [history, match, pageData.details.menu])

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

      if (artifacts.length > 0) {
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
    match.params
  ])

  useEffect(() => setFiles([]), [filtersStore.tag])

  useEffect(() => {
    if (filtersStore.tagOptions.length === 0) {
      getFilterTagOptions(fetchArtifactTags, match.params.projectName)
    }
  }, [
    fetchArtifactTags,
    filtersStore.tagOptions.length,
    getFilterTagOptions,
    match.params.projectName,
    pageData.page
  ])

  return (
    <div className="content-wrapper">
      {artifactsStore.loading && <Loader />}
      <Content
        content={files}
        handleCancel={() => setSelectedFile({})}
        handleSelectItem={item => setSelectedFile({ item })}
        loading={artifactsStore.loading}
        match={match}
        handleActionsMenuClick={() => setIsPopupDialogOpen(true)}
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
          title={pageData.actionsMenuHeader}
        />
      )}
    </div>
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

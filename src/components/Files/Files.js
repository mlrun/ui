import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generatePageData, pageDataInitialState } from './files.util'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { generateUri } from '../../utils/resources'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import { useOpenPanel } from '../../hooks/openPanel.hook'
import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'

import {
  ARTIFACTS,
  FILES_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../../constants'
import filtersActions from '../../actions/filters'

const Files = ({
  artifactsStore,
  fetchArtifactTags,
  fetchFile,
  fetchFiles,
  filtersStore,
  history,
  match,
  removeFile,
  removeFiles,
  setFilters
}) => {
  const [pageData, setPageData] = useState(pageDataInitialState)
  const urlTagOption = useGetTagOptions(fetchArtifactTags, pageData.filters)
  const openPanelByDefault = useOpenPanel()
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)

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
        result = await fetchFile(
          file.project ?? match.params.projectName,
          file.db_key,
          !filtersStore.iter,
          filtersStore.tag
        )
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
    [fetchFile, filtersStore.iter, filtersStore.tag, match.params.projectName]
  )

  useEffect(() => {
    if (openPanelByDefault) {
      setIsPopupDialogOpen(true)
    }
  }, [openPanelByDefault])

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
  }, [filtersStore.iter, filtersStore.tag, removeFile])

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
    if (urlTagOption) {
      fetchData({ tag: urlTagOption, iter: SHOW_ITERATIONS })
    }
  }, [fetchData, urlTagOption])

  useEffect(() => {
    return () => {
      setFiles([])
      removeFiles()
      setSelectedFile({})
    }
  }, [match.params.projectName, removeFiles])

  useEffect(() => {
    if (
      filtersStore.tag === TAG_FILTER_ALL_ITEMS ||
      filtersStore.tag === TAG_FILTER_LATEST
    ) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
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
          artifactKind="artifact"
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

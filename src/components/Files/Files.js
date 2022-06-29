import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'

import artifactsAction from '../../actions/artifacts'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { generatePageData, pageDataInitialState } from './files.util'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { searchArtifactItem } from '../../utils/searchArtifactItem'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'
import { openPopUp } from 'igz-controls/utils/common.util'

import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'

import {
  ARTIFACTS,
  FILES_PAGE,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import filtersActions from '../../actions/filters'

const Files = ({
  artifactsStore,
  fetchArtifactTags,
  fetchFile,
  fetchFiles,
  filtersStore,
  removeFile,
  removeFiles,
  setFilters
}) => {
  const [pageData, setPageData] = useState(pageDataInitialState)
  const urlTagOption = useGetTagOptions(fetchArtifactTags, pageData.filters)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchData = useCallback(
    filters => {
      fetchFiles(params.projectName, filters).then(result => {
        if (result) {
          setFiles(generateArtifacts(filterArtifacts(result), ARTIFACTS))
        }

        return result
      })
    },
    [fetchFiles, params.projectName]
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
    [artifactsStore.files.selectedRowData.content, pageData.selectedRowData, removeFile]
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
          file.project ?? params.projectName,
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
                  ...generateArtifacts(filterArtifacts(result), ARTIFACTS, !filtersStore.iter)
                ],
                error: null,
                loading: false
              }
            }
          }
        })
      }
    },
    [fetchFile, filtersStore.iter, filtersStore.tag, params.projectName]
  )

  useEffect(() => {
    setPageData(state => ({
      ...state,
      ...generatePageData(handleRequestOnExpand, selectedFile)
    }))
  }, [handleRequestOnExpand, selectedFile])

  useEffect(() => {
    removeFile({})
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, filtersStore.tag, removeFile])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(FILES_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, params, pageData.details.menu])

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
  }, [params.projectName, removeFiles])

  useEffect(() => {
    if (filtersStore.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filtersStore.iter)) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else if (filtersStore.groupBy === GROUP_BY_NAME) {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [params.pageTab, filtersStore.tag, filtersStore.iter, filtersStore.groupBy, setFilters])

  useEffect(() => {
    if (params.name) {
      const { name, tag, iter } = params
      const artifacts =
        artifactsStore.files.selectedRowData.content[name] || artifactsStore.files.allData

      if (artifacts.length > 0) {
        const searchItem = searchArtifactItem(artifacts, name, tag, iter)

        if (!searchItem) {
          navigate(`/projects/${params.projectName}/files`, { replace: true })
        } else {
          setSelectedFile({ item: searchItem })
        }
      }
    } else {
      setSelectedFile({})
    }
  }, [artifactsStore.files.allData, artifactsStore.files.selectedRowData.content, navigate, params])

  useEffect(() => setFiles([]), [filtersStore.tag])

  return (
    <div className="content-wrapper">
      {artifactsStore.loading && <Loader />}
      <Content
        content={files}
        handleCancel={() => setSelectedFile({})}
        handleRemoveRequestData={handleRemoveFile}
        handleSelectItem={item => setSelectedFile({ item })}
        loading={artifactsStore.loading}
        handleActionsMenuClick={() =>
          openPopUp(RegisterArtifactModal, {
            artifactKind: 'artifact',
            projectName: params.projectName,
            refresh: fetchData,
            title: pageData.actionsMenuHeader
          })
        }
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedFile.item}
        getIdentifier={getArtifactIdentifier}
      />
    </div>
  )
}

export default connect(
  ({ artifactsStore, filtersStore }) => ({
    artifactsStore,
    filtersStore
  }),
  { ...artifactsAction, ...filtersActions }
)(Files)

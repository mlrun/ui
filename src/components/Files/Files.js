import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { maxBy } from 'lodash'

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

const Files = ({
  artifactsStore,
  fetchFiles,
  history,
  match,
  removeFiles,
  setArtifactFilter
}) => {
  const [files, setFiles] = useState([])
  const [yamlContent, setYamlContent] = useState([])
  const [selectedFile, setSelectedFile] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [pageData] = useState({
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
        let data = []

        if (result) {
          const filteredFiles = filterArtifacts(result)
          data = generateArtifacts(filteredFiles)

          setFiles(data)
          setYamlContent(result)
        }

        return data
      })
    },
    [fetchFiles]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setFiles([])
      removeFiles()
      setSelectedFile({})
    }
  }, [fetchData, match.params.projectName, removeFiles])

  useEffect(() => {
    if (match.params.name && artifactsStore.files.length !== 0) {
      const { name } = match.params

      const [searchItem] = artifactsStore.files.filter(
        item => item.key === name
      )

      if (!searchItem) {
        history.push(`/projects/${match.params.projectName}/files`)
      } else {
        const file = maxBy(
          searchItem.data.filter(item => {
            if (searchItem.link_iteration) {
              const { link_iteration } = searchItem.link_iteration

              return link_iteration === item.iter
            }

            return true
          }),
          'updated'
        )

        setSelectedFile({ item: file })
      }
    } else {
      setSelectedFile({})
    }
  }, [artifactsStore.files, history, match.params])

  const handleFilesTreeFilterChange = useCallback(
    item => {
      handleArtifactTreeFilterChange(
        fetchData,
        artifactsStore.filter,
        item,
        match.params.projectName,
        setArtifactFilter
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
          match={match}
          pageData={pageData}
          refresh={fetchData}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
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

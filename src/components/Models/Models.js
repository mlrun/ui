import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

import artifactsAction from '../../actions/artifacts'
import {
  handleFetchData,
  generatePageData,
  checkForSelectedModel,
  checkForSelectedModelEndpoint
} from './models.util'
import { handleArtifactTreeFilterChange } from '../../utils/handleArtifactTreeFilterChange'
import { MODEL_ENDPOINTS_TAB, MODELS_TAB } from '../../constants'

const Models = ({
  artifactsStore,
  fetchModelEndpoints,
  fetchModels,
  history,
  match,
  removeModels,
  setArtifactFilter,
  getModelsEndpoints
}) => {
  const [content, setContent] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [yamlContent, setYamlContent] = useState([])
  const [pageData, setPageData] = useState({
    detailsMenu: [],
    filters: [],
    infoHeaders: [],
    page: '',
    registerArtifactDialogTitle: '',
    tabs: []
  })

  const fetchData = useCallback(
    async item => {
      const data = await handleFetchData(
        fetchModelEndpoints,
        fetchModels,
        item,
        match.params.pageTab
      )

      if (data.content) {
        setContent(data.content)
        setYamlContent(data.yamlContent)
      }

      return data.content
    },
    [fetchModelEndpoints, fetchModels, match.params.pageTab]
  )

  useEffect(() => {
    fetchData({ project: match.params.projectName })

    return () => {
      setContent([])
      removeModels()
      setSelectedModel({})
    }
  }, [fetchData, getModelsEndpoints, match.params.projectName, removeModels])

  useEffect(() => {
    setPageData(generatePageData(match.params.pageTab))
  }, [match.params.pageTab])

  useEffect(() => {
    if (
      match.params.name &&
      (artifactsStore.models.length > 0 ||
        artifactsStore.modelEndpoints.length > 0)
    ) {
      const { name } = match.params

      if (match.params.pageTab === MODELS_TAB) {
        checkForSelectedModel(
          history,
          match,
          artifactsStore.models,
          name,
          setSelectedModel
        )
      } else if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
        checkForSelectedModelEndpoint(
          history,
          match,
          artifactsStore.modelEndpoints,
          name,
          setSelectedModel
        )
      }
    } else {
      setSelectedModel({})
    }
  }, [
    match.params,
    artifactsStore.artifacts,
    history,
    artifactsStore.models,
    artifactsStore.modelEndpoints.length,
    artifactsStore.modelEndpoints,
    match
  ])

  const handleModelTreeFilterChange = useCallback(
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
        content={content}
        handleArtifactFilterTree={handleModelTreeFilterChange}
        handleCancel={() => setSelectedModel({})}
        handleSelectItem={item => setSelectedModel({ item })}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsPopupDialogOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedModel.item}
        yamlContent={yamlContent}
      />
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactFilter={artifactsStore.filter}
          artifactKind={pageData.page.slice(0, -1)}
          match={match}
          refresh={fetchData}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
          title={pageData.registerArtifactDialogTitle}
        />
      )}
    </>
  )
}

Models.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(artifactsStore => artifactsStore, {
  ...artifactsAction
})(Models)

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
import { generateArtifacts } from '../../utils/generateArtifacts'
import { filterArtifacts } from '../../utils/filterArtifacts'

const Models = ({
  artifactsStore,
  fetchModel,
  fetchModelEndpoints,
  fetchModels,
  history,
  match,
  removeModel,
  removeModels,
  setArtifactFilter,
  getModelsEndpoints
}) => {
  const [content, setContent] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [groupFilter, setGroupFilter] = useState('')
  const [yamlContent, setYamlContent] = useState({
    allData: [],
    selectedRowData: []
  })
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
        setYamlContent(state => ({
          ...state,
          allData: data.yamlContent
        }))
      }

      return data.yamlContent
    },
    [fetchModelEndpoints, fetchModels, match.params.pageTab]
  )

  const handleRemoveModel = useCallback(
    model => {
      const newSelectedRowData = {
        ...artifactsStore.models.selectedRowData
      }

      delete newSelectedRowData[model.db_key]

      removeModel(newSelectedRowData)
    },
    [artifactsStore.models.selectedRowData, removeModel]
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
        result = await fetchModel(item)
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
    [fetchModel]
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
    fetchData({
      project: match.params.projectName,
      tag: artifactsStore.filter.tag
    })

    return () => {
      setContent([])
      removeModels()
      setSelectedModel({})
      setYamlContent({
        allData: [],
        selectedRowData: []
      })
    }
  }, [
    artifactsStore.filter.tag,
    fetchData,
    getModelsEndpoints,
    match.params.pageTab,
    match.params.projectName,
    removeModels
  ])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      ...generatePageData(
        match.params.pageTab,
        handleRequestOnExpand,
        handleRemoveModel
      )
    }))
  }, [handleRemoveModel, handleRequestOnExpand, match.params.pageTab])

  useEffect(() => {
    if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
      setGroupFilter('')
    } else if (artifactsStore.filter.tag === 'latest') {
      setGroupFilter('name')
    } else if (groupFilter.length > 0) {
      setGroupFilter('')
    }
  }, [match.params.pageTab, groupFilter.length, artifactsStore.filter])

  useEffect(() => {
    if (
      match.params.name &&
      ((match.params.pageTab === MODELS_TAB &&
        artifactsStore.models.allData.length > 0) ||
        (match.params.pageTab === MODEL_ENDPOINTS_TAB &&
          artifactsStore.modelEndpoints.length > 0))
    ) {
      const { name, tag } = match.params

      if (match.params.pageTab === MODELS_TAB) {
        checkForSelectedModel(
          history,
          match,
          artifactsStore.models,
          name,
          setSelectedModel,
          tag
        )
      } else if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
        checkForSelectedModelEndpoint(
          history,
          match,
          artifactsStore.modelEndpoints,
          tag,
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
    artifactsStore.modelEndpoints.length,
    artifactsStore.modelEndpoints,
    match,
    artifactsStore.models
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
        expandRow={handleExpandRow}
        groupFilter={groupFilter}
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

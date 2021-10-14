import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty, orderBy } from 'lodash'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import DeployModelPopUp from '../../elements/DeployModelPopUp/DeployModelPopUp'

import artifactsAction from '../../actions/artifacts'
import detailsActions from '../../actions/details'
import filtersActions from '../../actions/filters'
import {
  handleFetchData,
  generatePageData,
  getFeatureVectorData,
  checkForSelectedModel,
  checkForSelectedModelEndpoint
} from './models.util'
import {
  INIT_GROUP_FILTER,
  INIT_TAG_FILTER,
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE
} from '../../constants'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { getArtifactIdentifier } from '../../utils/getUniqueIdentifier'

const Models = ({
  artifactsStore,
  detailsStore,
  fetchArtifactTags,
  fetchModel,
  fetchModelEndpointWithAnalysis,
  fetchModelEndpoints,
  fetchModelFeatureVector,
  fetchModels,
  filtersStore,
  getFilterTagOptions,
  history,
  match,
  removeModel,
  removeModels,
  setFilters
}) => {
  const [content, setContent] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const [deployModel, setDeployModel] = useState({})
  const [
    isRegisterArtifactPopupOpen,
    setIsRegisterArtifactPopupOpen
  ] = useState(false)
  const [isDeployPopupOpen, setIsDeployPopupOpen] = useState(false)
  const [pageData, setPageData] = useState({
    details: { menu: [], infoHeaders: [] },
    filters: [],
    infoHeaders: [],
    page: MODELS_PAGE,
    registerArtifactDialogTitle: '',
    tabs: []
  })

  const fetchData = useCallback(
    async filters => {
      const data = await handleFetchData(
        fetchModelEndpoints,
        fetchModels,
        filters,
        match.params.projectName,
        match.params.pageTab
      )

      if (data.content) {
        setContent(data.content)
      }

      return data.originalContent
    },
    [
      fetchModelEndpoints,
      fetchModels,
      match.params.pageTab,
      match.params.projectName
    ]
  )

  const closeDeployModelPopUp = () => {
    setDeployModel({})
    setIsDeployPopupOpen(false)
  }

  const handleDeployModel = useCallback(model => {
    setDeployModel(model)
    setIsDeployPopupOpen(true)
  }, [])

  const handleRemoveModel = useCallback(
    model => {
      const newStoreSelectedRowData = {
        ...artifactsStore.models.selectedRowData.content
      }
      const newPageDataSelectedRowData = { ...pageData.selectedRowData }

      delete newStoreSelectedRowData[model.key.value]
      delete newPageDataSelectedRowData[model.key.value]

      removeModel(newStoreSelectedRowData)
      setPageData(state => ({
        ...state,
        selectedRowData: newPageDataSelectedRowData
      }))
    },
    [
      artifactsStore.models.selectedRowData.content,
      pageData.selectedRowData,
      removeModel
    ]
  )

  const handleRequestOnExpand = useCallback(
    async model => {
      const modelIdentifier = getArtifactIdentifier(model)
      let result = []

      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [modelIdentifier]: {
            loading: true
          }
        }
      }))

      try {
        result = await fetchModel(
          model.project,
          model.db_key,
          !filtersStore.iter
        )
      } catch (error) {
        setPageData(state => ({
          ...state,
          selectedRowData: {
            ...state.selectedRowData,
            [modelIdentifier]: {
              ...state.selectedRowData[modelIdentifier],
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
              [modelIdentifier]: {
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
    [fetchModel, filtersStore.iter]
  )

  useEffect(() => {
    removeModel({})
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, removeModel])

  useEffect(() => {
    fetchData({
      tag: INIT_TAG_FILTER,
      iter: match.params.pageTab === MODELS_TAB ? 'iter' : ''
    })

    return () => {
      setContent([])
      removeModels()
      setSelectedModel({})
    }
  }, [fetchData, match.params.pageTab, removeModels])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      ...generatePageData(
        selectedModel,
        match.params.pageTab,
        handleDeployModel,
        handleRequestOnExpand,
        handleRemoveModel,
        !isEveryObjectValueEmpty(selectedModel)
      )
    }))
  }, [
    handleDeployModel,
    handleRemoveModel,
    handleRequestOnExpand,
    match.params.pageTab,
    selectedModel
  ])

  useEffect(() => {
    if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
      setFilters({ groupBy: 'none', sortBy: 'function' })
    } else if (filtersStore.tag === INIT_TAG_FILTER) {
      setFilters({ groupBy: INIT_GROUP_FILTER })
    } else {
      setFilters({ groupBy: 'none' })
    }
  }, [filtersStore.tag, match.params.pageTab, setFilters])

  useEffect(() => {
    if (
      match.params.name &&
      ((match.params.pageTab === MODELS_TAB &&
        artifactsStore.models.allData.length > 0) ||
        (match.params.pageTab === MODEL_ENDPOINTS_TAB &&
          artifactsStore.modelEndpoints.length > 0))
    ) {
      const { name, tag, iter } = match.params

      if (match.params.pageTab === MODELS_TAB) {
        checkForSelectedModel(
          history,
          match,
          artifactsStore.models,
          name,
          setSelectedModel,
          tag,
          iter
        )
      } else if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
        checkForSelectedModelEndpoint(
          fetchModelEndpointWithAnalysis,
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
    artifactsStore.modelEndpoints,
    artifactsStore.models,
    fetchModelEndpointWithAnalysis,
    history,
    match
  ])

  useEffect(() => setContent([]), [filtersStore.tag])

  useEffect(() => {
    if (
      match.params.name &&
      match.params.tag &&
      pageData.details.menu.length > 0
    ) {
      isDetailsTabExists(MODELS_PAGE, match, pageData.details.menu, history)
    }
  }, [history, match, pageData.details.menu])

  useEffect(() => {
    if (
      match.params.pageTab === MODELS_TAB &&
      selectedModel.item?.feature_vector &&
      !detailsStore.modelFeatureVectorData.error &&
      isEmpty(detailsStore.modelFeatureVectorData)
    ) {
      const { name, tag } = getFeatureVectorData(
        selectedModel.item.feature_vector
      )
      fetchModelFeatureVector(match.params.projectName, name, tag)
    }
  }, [
    detailsStore.modelFeatureVectorData,
    detailsStore.modelFeatureVectorData.error,
    fetchModelFeatureVector,
    match.params.pageTab,
    match.params.projectName,
    selectedModel.item
  ])

  useEffect(() => {
    if (
      filtersStore.tagOptions.length === 0 &&
      match.params.pageTab === MODELS_TAB
    ) {
      getFilterTagOptions(fetchArtifactTags, match.params.projectName)
    }
  }, [
    fetchArtifactTags,
    filtersStore.tagOptions.length,
    getFilterTagOptions,
    match.params.pageTab,
    match.params.projectName
  ])

  const sortedContent = useMemo(() => {
    const path =
      filtersStore.sortBy === 'function' ? 'spec.model_uri' : 'spec.model'

    return orderBy(content, [path], ['asc'])
  }, [content, filtersStore.sortBy])

  return (
    <div className="content-wrapper">
      {artifactsStore.loading && <Loader />}
      <Content
        content={sortedContent}
        handleActionsMenuClick={() => setIsRegisterArtifactPopupOpen(true)}
        handleCancel={() => setSelectedModel({})}
        loading={artifactsStore.loading}
        match={match}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedModel.item}
        getIdentifier={getArtifactIdentifier}
      />
      {isRegisterArtifactPopupOpen && (
        <RegisterArtifactPopup
          artifactKind={pageData.page.slice(0, -1)}
          match={match}
          refresh={fetchData}
          setIsPopupOpen={setIsRegisterArtifactPopupOpen}
          title={pageData.actionsMenuHeader}
        />
      )}
      {isDeployPopupOpen && (
        <DeployModelPopUp
          closePopUp={closeDeployModelPopUp}
          model={deployModel}
        />
      )}
    </div>
  )
}

Models.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ artifactsStore, filtersStore, detailsStore }) => ({
    artifactsStore,
    filtersStore,
    detailsStore
  }),
  {
    ...artifactsAction,
    ...detailsActions,
    ...filtersActions
  }
)(Models)

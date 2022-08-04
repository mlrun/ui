import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty, orderBy } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import DeployModelPopUp from '../../elements/DeployModelPopUp/DeployModelPopUp'
import RegisterModelPopUp from '../../elements/RegisterModelPopUp/RegisterModelPopUp'
import Pipeline from '../Pipeline/Pipeline'

import artifactsAction from '../../actions/artifacts'
import detailsActions from '../../actions/details'
import filtersActions from '../../actions/filters'
import {
  checkForSelectedModel,
  checkForSelectedModelEndpoint,
  checkForSelectedRealTimePipelines,
  generatePageData,
  getFeatureVectorData,
  handleFetchData,
  pageDataInitialState,
  tabs
} from './models.util'
import { openPopUp } from 'igz-controls/utils/common.util'

import {
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  MODELS_TAB,
  REAL_TIME_PIPELINES_TAB,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { getArtifactIdentifier, getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { isPageTabValid } from '../../utils/handleRedirect'

import { useGetTagOptions } from '../../hooks/useGetTagOptions.hook'

const Models = ({
  artifactsStore,
  detailsStore,
  fetchArtifactTags,
  fetchFunctions,
  fetchModel,
  fetchModelEndpointWithAnalysis,
  fetchModelEndpoints,
  fetchModelFeatureVector,
  fetchModels,
  filtersStore,
  removeModel,
  removeModels,
  setFilters,
  subPage
}) => {
  const [pageData, setPageData] = useState(pageDataInitialState)
  const urlTagOption = useGetTagOptions(fetchArtifactTags, pageData.filters)
  const [content, setContent] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchData = useCallback(
    async filters => {
      const data = await handleFetchData(
        fetchModelEndpoints,
        fetchModels,
        fetchFunctions,
        filters,
        params.projectName,
        params.pageTab
      )

      if (data.content) {
        setContent(data.content)
      }

      return data.originalContent
    },
    [fetchFunctions, fetchModelEndpoints, fetchModels, params.pageTab, params.projectName]
  )

  const handleDeployModel = useCallback(model => {
    openPopUp(DeployModelPopUp, { model })
  }, [])

  const handleRegisterModel = useCallback(() => {
    openPopUp(RegisterModelPopUp, { projectName: params.projectName, refresh: fetchData })
  }, [params.projectName, fetchData])

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
    [artifactsStore.models.selectedRowData.content, pageData.selectedRowData, removeModel]
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
        result = await fetchModel(model.project, model.db_key, !filtersStore.iter, filtersStore.tag)
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
                  ...generateArtifacts(filterArtifacts(result), MODELS_TAB, !filtersStore.iter)
                ],
                error: null,
                loading: false
              }
            }
          }
        })
      }
    },
    [fetchModel, filtersStore.iter, filtersStore.tag]
  )

  useEffect(() => {
    removeModel({})
    setPageData(state => ({
      ...state,
      selectedRowData: {}
    }))
  }, [filtersStore.iter, filtersStore.tag, removeModel])

  useEffect(() => {
    const filtersParams = urlTagOption ? { tag: urlTagOption, iter: SHOW_ITERATIONS } : {}
    if (urlTagOption || params.pageTab !== MODELS_TAB) {
      fetchData(filtersParams)
    }
  }, [fetchData, params.pageTab, urlTagOption])

  useEffect(() => {
    return () => {
      setContent([])
      removeModels()
      setSelectedModel({})
      setPageData(pageDataInitialState)
    }
  }, [params.pageTab, removeModels])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      ...generatePageData(
        subPage,
        selectedModel,
        params.pageTab,
        handleDeployModel,
        handleRequestOnExpand,
        detailsStore
      )
    }))
  }, [
    detailsStore,
    handleDeployModel,
    handleRequestOnExpand,
    params.pageTab,
    selectedModel,
    subPage
  ])

  useEffect(() => {
    if (params.pageTab === MODEL_ENDPOINTS_TAB) {
      setFilters({ groupBy: GROUP_BY_NONE, sortBy: 'function' })
    } else if (
      params.pageTab === REAL_TIME_PIPELINES_TAB ||
      filtersStore.tag === TAG_FILTER_ALL_ITEMS ||
      isEmpty(filtersStore.iter)
    ) {
      setFilters({ groupBy: GROUP_BY_NAME })
    } else {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [
    params.pageTab,
    params.projectName,
    params.pipelineId,
    filtersStore.tag,
    filtersStore.iter,
    setFilters
  ])

  useEffect(() => {
    if (
      (params.name &&
        ((params.pageTab === MODELS_TAB && artifactsStore.models.allData.length > 0) ||
          (params.pageTab === MODEL_ENDPOINTS_TAB && artifactsStore.modelEndpoints.length > 0))) ||
      (params.pipelineId && params.pageTab === REAL_TIME_PIPELINES_TAB && content.length > 0)
    ) {
      const { name, tag, iter, pipelineId } = params

      if (params.pageTab === MODELS_TAB) {
        checkForSelectedModel(
          navigate,
          params,
          artifactsStore.models,
          name,
          setSelectedModel,
          tag,
          iter
        )
      } else if (params.pageTab === MODEL_ENDPOINTS_TAB) {
        checkForSelectedModelEndpoint(
          fetchModelEndpointWithAnalysis,
          navigate,
          params,
          artifactsStore.modelEndpoints,
          tag,
          setSelectedModel
        )
      } else if (params.pageTab === REAL_TIME_PIPELINES_TAB) {
        checkForSelectedRealTimePipelines(navigate, pipelineId, params, content)
      }
    } else {
      setSelectedModel({})
    }
  }, [
    artifactsStore.modelEndpoints,
    artifactsStore.models,
    content,
    fetchModelEndpointWithAnalysis,
    navigate,
    params
  ])

  useEffect(() => setContent([]), [filtersStore.tag])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(MODELS_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, params, pageData.details.menu])

  useEffect(() => {
    if (
      params.pageTab === MODELS_TAB &&
      selectedModel.item?.feature_vector &&
      !detailsStore.error &&
      isEmpty(detailsStore.modelFeatureVectorData)
    ) {
      const { name, tag } = getFeatureVectorData(selectedModel.item.feature_vector)
      fetchModelFeatureVector(params.projectName, name, tag)
    }
  }, [
    detailsStore.error,
    detailsStore.modelFeatureVectorData,
    fetchModelFeatureVector,
    params.pageTab,
    params.projectName,
    selectedModel.item
  ])

  useEffect(() => {
    isPageTabValid(
      params.pageTab,
      tabs.map(tab => tab.id),
      navigate,
      location
    )
  }, [navigate, location, params.pageTab])

  const sortedContent = useMemo(() => {
    const path = filtersStore.sortBy === 'function' ? 'spec.model_uri' : 'spec.model'

    return orderBy(content, [path], ['asc'])
  }, [content, filtersStore.sortBy])

  return (
    <div className="content-wrapper">
      {artifactsStore.loading && <Loader />}
      <Content
        content={sortedContent}
        handleActionsMenuClick={handleRegisterModel}
        handleCancel={() => setSelectedModel({})}
        handleRemoveRequestData={params.pageTab === MODELS_TAB && handleRemoveModel}
        loading={artifactsStore.loading}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedModel.item}
        getIdentifier={
          params.pageTab === REAL_TIME_PIPELINES_TAB ? getFunctionIdentifier : getArtifactIdentifier
        }
      >
        {params.pipelineId ? <Pipeline content={content} /> : null}
      </Content>
    </div>
  )
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

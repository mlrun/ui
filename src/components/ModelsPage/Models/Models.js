/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty, isNil } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import AddArtifactTagPopUp from '../../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import DeployModelPopUp from '../../../elements/DeployModelPopUp/DeployModelPopUp'
import ModelsView from './ModelsView'
import RegisterModelModal from '../../../elements/RegisterModelModal/RegisterModelModal'
import JobWizard from '../../JobWizard/JobWizard'

import {
  fetchModel,
  fetchModels,
  removeModel,
  removeModels
} from '../../../reducers/artifactsReducer'
import {
  GROUP_BY_NAME,
  MODELS_PAGE,
  MODELS_TAB,
  TAG_FILTER_ALL_ITEMS,
  FILTER_MENU_MODAL,
  GROUP_BY_NONE,
  MODELS_FILTERS,
  REQUEST_CANCELED
} from '../../../constants'
import {
  checkForSelectedModel,
  fetchModelsRowData,
  filters,
  generateActionsMenu,
  generatePageData,
  getFeatureVectorData,
  handleApplyDetailsChanges,
  modelsTableHeaders
} from './models.util'
import detailsActions from '../../../actions/details'
import { createModelsRowData } from '../../../utils/createArtifactsContent'
import { getArtifactIdentifier } from '../../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData } from '../../../utils/convertChipsData'
import { setFilters } from '../../../reducers/filtersReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { useGroupContent } from '../../../hooks/groupContent.hook'
import { useModelsPage } from '../ModelsPage.context'
import { useSortTable } from '../../../hooks/useSortTable.hook'
import { useGetTagOptions } from '../../../hooks/useGetTagOptions.hook'
import { getViewMode } from '../../../utils/helper'
import { useMode } from '../../../hooks/mode.hook'
import { setArtifactTags } from '../../../utils/artifacts.util'

const Models = ({ fetchModelFeatureVector }) => {
  const [models, setModels] = useState([])
  const [allModels, setAllModels] = useState([])
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState({})
  const [selectedRowData, setSelectedRowData] = useState({})
  const [metricsCounter, setMetricsCounter] = useState(0)
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [tableHeaders, setTableHeaders] = useState(modelsTableHeaders)
  const [urlTagOption] = useGetTagOptions(null, filters, null, MODELS_FILTERS)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const detailsStore = useSelector(store => store.detailsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const modelsRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())
  const viewMode = getViewMode(window.location.search)
  const { toggleConvertedYaml } = useModelsPage()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  const modelsFilters = useMemo(
    () => filtersStore[FILTER_MENU_MODAL][MODELS_FILTERS].values,
    [filtersStore]
  )
  const { isDemoMode } = useMode()

  const pageData = useMemo(
    () => generatePageData(selectedModel, viewMode),
    [selectedModel, viewMode]
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedModel.tag ?? '',
      labels: parseChipsData(selectedModel.labels ?? {})
    }),
    [selectedModel.labels, selectedModel.tag]
  )

  const fetchData = useCallback(
    async filters => {
      abortControllerRef.current = new AbortController()

      return dispatch(
        fetchModels({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setLargeRequestErrorMessage
            }
          }
        })
      )
        .unwrap()
        .then(modelsResponse => {
          if (modelsResponse) {
            setArtifactTags(modelsResponse, setModels, setAllModels, filters, dispatch, MODELS_TAB)

            return modelsResponse
          }
        })
    },
    [dispatch, setModels, params.projectName]
  )

  const handleDeployModel = useCallback(model => {
    openPopUp(DeployModelPopUp, { model })
  }, [])

  const handleRefresh = useCallback(
    filters => {
      setSelectedRowData({})
      setModels([])
      setAllModels([])

      return fetchData(filters)
    },
    [fetchData, setAllModels, setModels]
  )

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: handleRefresh,
        getArtifact: () =>
          fetchModel({
            project: params.projectName,
            model: artifact.db_key,
            iter: true,
            tag: TAG_FILTER_ALL_ITEMS
          }),
        projectName: params.projectName
      })
    },
    [handleRefresh, params.projectName]
  )

  const actionsMenu = useMemo(
    () => model =>
      generateActionsMenu(
        model,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        modelsFilters,
        handleDeployModel
      ),
    [
      dispatch,
      frontendSpec,
      handleAddTag,
      handleDeployModel,
      handleRefresh,
      modelsFilters,
      params.projectName,
      toggleConvertedYaml
    ]
  )

  const handleRemoveRowData = useCallback(
    model => {
      const newStoreSelectedRowData = {
        ...artifactsStore.models.selectedRowData
      }
      const newPageDataSelectedRowData = { ...selectedRowData }

      delete newStoreSelectedRowData[model.data.ui.value]
      delete newPageDataSelectedRowData[model.data.ui.value]

      dispatch(removeModel(newStoreSelectedRowData))
      setSelectedRowData(newPageDataSelectedRowData)
    },
    [artifactsStore.models.selectedRowData, dispatch, selectedRowData]
  )

  const handleRequestOnExpand = useCallback(
    async model => {
      await fetchModelsRowData(
        dispatch,
        model,
        setSelectedRowData,
        modelsFilters.iter,
        modelsFilters.tag,
        params.projectName,
        frontendSpec,
        metricsCounter
      )
    },
    [
      dispatch,
      modelsFilters.iter,
      modelsFilters.tag,
      params.projectName,
      frontendSpec,
      metricsCounter
    ]
  )

  const { latestItems, handleExpandRow } = useGroupContent(
    models,
    getArtifactIdentifier,
    handleRemoveRowData,
    handleRequestOnExpand,
    null,
    MODELS_PAGE,
    MODELS_TAB
  )

  const tableContent = useMemo(() => {
    return filtersStore.groupBy === GROUP_BY_NAME
      ? latestItems.map(contentItem => {
          return createModelsRowData(
            contentItem,
            params.projectName,
            frontendSpec,
            metricsCounter,
            true
          )
        })
      : models.map(contentItem =>
          createModelsRowData(contentItem, params.projectName, frontendSpec, metricsCounter)
        )
  }, [filtersStore.groupBy, frontendSpec, latestItems, metricsCounter, models, params.projectName])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: tableHeaders,
      content: tableContent,
      sortConfig: { excludeSortBy: 'labels', defaultSortBy: 'updated', defaultDirection: 'desc' }
    })

  const applyDetailsChanges = useCallback(
    changes => {
      return handleApplyDetailsChanges(
        changes,
        params.projectName,
        selectedModel,
        setNotification,
        dispatch
      )
    },
    [dispatch, params.projectName, selectedModel]
  )

  const applyDetailsChangesCallback = changes => {
    if ('tag' in changes.data) {
      setSelectedRowData({})
      setModels([])
      setAllModels([])

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/${MODELS_PAGE.toLowerCase()}/${MODELS_TAB}/${
            params.name
          }/${changes.data.tag.currentFieldValue}/overview`,
          { replace: true }
        )
      }
    }

    handleRefresh(modelsFilters)
  }

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  useEffect(() => {
    if (isNil(filtersStore.tagOptions) && urlTagOption) {
      fetchData({ ...modelsFilters, tag: urlTagOption })
    }
  }, [fetchData, filtersStore, modelsFilters, urlTagOption])

  useEffect(() => {
    return () => {
      setModels([])
      setAllModels([])
      dispatch(removeModels())
      setSelectedModel({})
      setDataIsLoaded(false)
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [dispatch, setModels, setAllModels])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedModel(
      params.name,
      selectedRowData,
      allModels,
      params.tag,
      params.iter,
      params.uid,
      navigate,
      params.projectName,
      setSelectedModel
    )
  }, [
    allModels,
    navigate,
    params.iter,
    params.name,
    params.projectName,
    params.tag,
    params.uid,
    selectedRowData
  ])

  useEffect(() => {
    if (
      selectedModel.feature_vector &&
      !detailsStore.error &&
      isEmpty(detailsStore.modelFeatureVectorData)
    ) {
      const { name, tag } = getFeatureVectorData(selectedModel.feature_vector)
      fetchModelFeatureVector(params.projectName, name, tag)
    }
  }, [
    detailsStore.error,
    detailsStore.modelFeatureVectorData,
    fetchModelFeatureVector,
    params.projectName,
    selectedModel.feature_vector
  ])

  useEffect(() => {
    if (models.length > 0 && !dataIsLoaded) {
      const newTableHeaders = []
      const objectWithMaxMetrics = models.reduce((max, model) => {
        if (
          model.metrics &&
          Object.keys(model.metrics).length > Object.keys(max.metrics || {}).length
        ) {
          return model
        }

        return max
      }, {})
      Object.keys(objectWithMaxMetrics.metrics ?? {}).forEach(metricKey => {
        newTableHeaders.push({
          headerId: metricKey,
          headerLabel: metricKey,
          className: 'table-cell-1'
        })
      })

      setMetricsCounter(Object.keys(objectWithMaxMetrics.metrics ?? {}).length)
      setTableHeaders(state => [...state, ...newTableHeaders])
      setDataIsLoaded(true)
    }
  }, [dataIsLoaded, models])

  const handleRegisterModel = useCallback(() => {
    openPopUp(RegisterModelModal, { params, refresh: handleRefresh })
  }, [handleRefresh, params])

  const handleTrainModel = () => {
    openPopUp(JobWizard, {
      params,
      isTrain: true,
      wizardTitle: 'Train model'
    })
  }

  return (
    <ModelsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      filtersStore={filtersStore}
      handleExpandRow={handleExpandRow}
      handleRefresh={handleRefresh}
      handleRegisterModel={handleRegisterModel}
      handleTrainModel={handleTrainModel}
      isDemoMode={isDemoMode}
      largeRequestErrorMessage={largeRequestErrorMessage}
      models={models}
      pageData={pageData}
      ref={modelsRef}
      selectedModel={selectedModel}
      selectedRowData={selectedRowData}
      setModels={setModels}
      setSelectedModel={setSelectedModel}
      setSelectedRowData={setSelectedRowData}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      viewMode={viewMode}
      urlTagOption={urlTagOption}
    />
  )
}

export default connect(null, {
  ...detailsActions
})(Models)

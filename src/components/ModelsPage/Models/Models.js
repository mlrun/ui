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
import { chain, isEmpty, isNil } from 'lodash'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import AddArtifactTagPopUp from '../../../elements/AddArtifactTagPopUp/AddArtifactTagPopUp'
import DeployModelPopUp from '../../../elements/DeployModelPopUp/DeployModelPopUp'
import ModelsView from './ModelsView'
import RegisterModelModal from '../../../elements/RegisterModelModal/RegisterModelModal'
import JobWizard from '../../JobWizard/JobWizard'

import './models.scss'
import cssVariables from './models.scss'

import {
  fetchArtifactsFunctions,
  fetchArtifactTags,
  fetchModels,
  removeModels
} from '../../../reducers/artifactsReducer'
import {
  MODELS_PAGE,
  MODELS_TAB,
  GROUP_BY_NONE,
  REQUEST_CANCELED,
  MODEL_TYPE,
  FUNCTION_TYPE_SERVING,
  ALL_VERSIONS_PATH
} from '../../../constants'
import {
  checkForSelectedModel,
  getFiltersConfig,
  generateActionsMenu,
  generatePageData,
  getFeatureVectorData,
  handleApplyDetailsChanges,
  handleDeployModelFailure
} from './models.util'
import detailsActions from '../../../actions/details'
import { createModelsRowData } from '../../../utils/createArtifactsContent'
import { getFilterTagOptions, setFilters } from '../../../reducers/filtersReducer'
import { getViewMode } from '../../../utils/helper'
import { isDetailsTabExists } from '../../../utils/link-helper.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseChipsData } from '../../../utils/convertChipsData'
import { setFullSelectedArtifact } from '../../../utils/artifacts.util'
import { setNotification } from '../../../reducers/notificationReducer'
import { useMode } from '../../../hooks/mode.hook'
import { useModelsPage } from '../ModelsPage.context'
import { useSortTable } from '../../../hooks/useSortTable.hook'
import { useVirtualization } from '../../../hooks/useVirtualization.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { transformSearchParams } from '../../../utils/filter.util'

const Models = ({ fetchModelFeatureVector, isAllVersions }) => {
  const [models, setModels] = useState([])
  const [modelVersions, setModelVersions] = useState([])
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [maxArtifactsErrorIsShown, setMaxArtifactsErrorIsShown] = useState(false)
  const [selectedModel, setSelectedModel] = useState({})
  const [selectedModelMin, setSelectedModelMin] = useState({})
  //temporarily commented till ML-5606 will be done
  // const [metricsCounter, setMetricsCounter] = useState(0)
  // const [dataIsLoaded, setDataIsLoaded] = useState(false)
  // const [tableHeaders, setTableHeaders] = useState([])
  const artifactsStore = useSelector(store => store.artifactsStore)
  const detailsStore = useSelector(store => store.detailsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [, setSearchParams] = useSearchParams()
  const viewMode = getViewMode(window.location.search)
  const { toggleConvertedYaml } = useModelsPage()
  const abortControllerRef = useRef(new AbortController())
  const tagAbortControllerRef = useRef(new AbortController())
  const modelsRef = useRef(null)

  const filtersConfig = useMemo(() => getFiltersConfig(isAllVersions), [isAllVersions])
  const filters = useFiltersFromSearchParams(filtersConfig)

  const { isDemoMode } = useMode()

  const pageData = useMemo(
    () => generatePageData(selectedModel, viewMode),
    [selectedModel, viewMode]
  )

  const detailsFormInitialValues = useMemo(
    () => ({
      tag: selectedModel.tag ?? '',
      labels: parseChipsData(selectedModel.labels ?? {}, frontendSpec.internal_labels)
    }),
    [frontendSpec.internal_labels, selectedModel.labels, selectedModel.tag]
  )

  const getAndSetSelectedArtifact = useCallback(() => {
    setFullSelectedArtifact(
      MODELS_TAB,
      dispatch,
      navigate,
      selectedModelMin,
      setSelectedModel,
      params.projectName,
      isAllVersions
    )
  }, [dispatch, isAllVersions, navigate, params.projectName, selectedModelMin])

  useEffect(() => {
    getAndSetSelectedArtifact()
  }, [getAndSetSelectedArtifact])

  const fetchData = useCallback(
    async filters => {
      abortControllerRef.current = new AbortController()

      const requestParams = {
        format: 'minimal'
      }

      if (!isAllVersions) {
        requestParams['partition-by'] = 'project_and_name'
      } else {
        requestParams.name = params.modelName
      }

      return dispatch(
        fetchModels({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            },
            params: requestParams
          }
        })
      )
        .unwrap()
        .then(result => {
          if (result) {
            if (isAllVersions) {
              setModelVersions(result)
            } else {
              setModels(result)
            }

            setMaxArtifactsErrorIsShown(result.length === 1000)
          }

          return result
        })
    },
    [dispatch, isAllVersions, params.modelName, params.projectName]
  )

  const fetchTags = useCallback(() => {
    tagAbortControllerRef.current = new AbortController()

    return dispatch(
      getFilterTagOptions({
        dispatch,
        fetchTags: fetchArtifactTags,
        project: params.projectName,
        category: MODEL_TYPE,
        config: {
          signal: tagAbortControllerRef.current.signal
        }
      })
    )
  }, [dispatch, params.projectName])

  const handleDeployModel = useCallback(
    model => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchArtifactsFunctions({
          project: model.project,
          filters: {},
          config: {
            signal: abortControllerRef.current.signal,
            params: { format: 'minimal', kind: 'serving' }
          }
        })
      )
        .unwrap()
        .then(functions => {
          if (!isNil(functions)) {
            const functionOptions = chain(functions)
              .filter(func => func.type === FUNCTION_TYPE_SERVING && func.graph?.kind === 'router')
              .uniqBy('name')
              .map(func => ({ label: func.name, id: func.name }))
              .value()

            if (functionOptions.length > 0) {
              openPopUp(DeployModelPopUp, {
                model,
                functionList: functions,
                functionOptionList: functionOptions
              })
            } else {
              handleDeployModelFailure(params.projectName, model.db_key)
            }
          }
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      fetchTags()
      setSelectedModelMin({})
      setModels([])
      setModelVersions([])
      //temporarily commented till ML-5606 will be done
      // setTableHeaders([])
      // setDataIsLoaded(false)

      return fetchData(filters)
    },
    [fetchData, fetchTags]
  )

  const handleRefreshWithFilters = useCallback(() => {
    handleRefresh(filters)
  }, [filters, handleRefresh])

  const handleAddTag = useCallback(
    artifact => {
      openPopUp(AddArtifactTagPopUp, {
        artifact,
        onAddTag: () => handleRefresh(filters),
        projectName: params.projectName
      })
    },
    [params.projectName, handleRefresh, filters]
  )

  const showAllVersions = useCallback(
    modelName => {
      navigate(
        `/projects/${params.projectName}/${MODELS_PAGE.toLowerCase()}/${MODELS_TAB}/${modelName}/${ALL_VERSIONS_PATH}?${transformSearchParams(window.location.search)}`
      )
    },
    [navigate, params.projectName]
  )

  const actionsMenu = useMemo(
    () => modelMin =>
      generateActionsMenu(
        modelMin,
        frontendSpec,
        dispatch,
        toggleConvertedYaml,
        handleAddTag,
        params.projectName,
        handleRefresh,
        filters,
        selectedModel,
        showAllVersions,
        isAllVersions,
        false,
        handleDeployModel
      ),
    [
      frontendSpec,
      dispatch,
      toggleConvertedYaml,
      handleAddTag,
      params.projectName,
      handleRefresh,
      filters,
      selectedModel,
      handleDeployModel,
      showAllVersions,
      isAllVersions
    ]
  )

  const tableContent = useMemo(() => {
    return (isAllVersions ? modelVersions : models).map(contentItem =>
      createModelsRowData(contentItem, params.projectName, isAllVersions)
    )
  }, [isAllVersions, modelVersions, models, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

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

  const applyDetailsChangesCallback = (changes, selectedItem) => {
    if ('tag' in changes.data) {
      if (isAllVersions) {
        setModelVersions([])
      } else {
        setModels([])
      }

      if (changes.data.tag.currentFieldValue) {
        navigate(
          `/projects/${params.projectName}/${MODELS_PAGE.toLowerCase()}/${MODELS_TAB}/${params.modelName}${isAllVersions ? `/${ALL_VERSIONS_PATH}` : ''}/:${
            changes.data.tag.currentFieldValue
          }@${selectedItem.uid}/overview${window.location.search}`,
          { replace: true }
        )
      }
    }

    handleRefresh(filters)
  }

  useInitialTableFetch({
    fetchData,
    fetchTags,
    filters,
    requestTrigger: isAllVersions
  })

  useEffect(() => {
    if (params.id && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.tab, params.id])

  useEffect(() => {
    const tagAbortControllerCurrent = tagAbortControllerRef.current

    return () => {
      setModels([])
      dispatch(removeModels())
      setSelectedModelMin({})
      //temporarily commented till ML-5606 will be done
      // setTableHeaders([])
      // setDataIsLoaded(false)
      abortControllerRef.current.abort(REQUEST_CANCELED)
      tagAbortControllerCurrent.abort(REQUEST_CANCELED)
    }
  }, [dispatch, params.projectName, setModels, tagAbortControllerRef])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch, params.projectName])

  useEffect(() => {
    checkForSelectedModel(
      params.modelName,
      isAllVersions ? modelVersions : models,
      params.id,
      navigate,
      params.projectName,
      setSelectedModelMin,
      isAllVersions
    )
  }, [
    isAllVersions,
    modelVersions,
    models,
    navigate,
    params.id,
    params.modelName,
    params.projectName
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

  //temporarily commented till ML-5606 will be done
  // useEffect(() => {
  //   if (tableContent?.[0]?.content?.length > 0 && tableHeaders.length === 0) {
  //     setTableHeaders(tableContent?.[0]?.content)
  //   }
  // }, [tableContent, tableHeaders.length])

  // useEffect(() => {
  //   if (models.length > 0 && tableHeaders.length > 0 && !dataIsLoaded) {
  //     const newTableHeaders = []
  //     const maxMetricsModel = models.reduce((modelWithMaxMetrics, model) => {
  //       if (
  //         model.metrics &&
  //         Object.keys(model.metrics).length > Object.keys(modelWithMaxMetrics.metrics || {}).length
  //       ) {
  //         return model
  //       }
  //
  //       return modelWithMaxMetrics
  //     }, {})
  //     Object.keys(maxMetricsModel.metrics ?? {}).forEach(metricKey => {
  //       newTableHeaders.push({
  //         headerId: metricKey,
  //         headerLabel: metricKey,
  //         className: 'table-cell-1'
  //       })
  //     })
  //
  //     setMetricsCounter(Object.keys(maxMetricsModel.metrics ?? {}).length)
  //     setTableHeaders(state => [...state, ...newTableHeaders])
  //     setDataIsLoaded(true)
  //   }
  // }, [dataIsLoaded, models, tableHeaders])

  const handleRegisterModel = useCallback(() => {
    openPopUp(RegisterModelModal, {
      params,
      refresh: () => handleRefresh(filters)
    })
  }, [params, handleRefresh, filters])

  const handleTrainModel = () => {
    openPopUp(JobWizard, {
      params,
      isTrain: true,
      wizardTitle: 'Train model'
    })
  }

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: sortedTableContent,
      selectedItem: selectedModel
    },
    heightData: {
      headerRowHeight: cssVariables.modelsHeaderRowHeight,
      rowHeight: cssVariables.modelsRowHeight,
      rowHeightExtended: cssVariables.modelsRowHeightExtended
    },
    activateTableScroll: true
  })

  return (
    <ModelsView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      artifactsStore={artifactsStore}
      detailsFormInitialValues={detailsFormInitialValues}
      filters={filters}
      filtersConfig={filtersConfig}
      filtersStore={filtersStore}
      getAndSetSelectedArtifact={getAndSetSelectedArtifact}
      handleRefresh={handleRefresh}
      handleRefreshWithFilters={handleRefreshWithFilters}
      handleRegisterModel={handleRegisterModel}
      handleTrainModel={handleTrainModel}
      isAllVersions={isAllVersions}
      isDemoMode={isDemoMode}
      maxArtifactsErrorIsShown={maxArtifactsErrorIsShown}
      models={isAllVersions ? modelVersions : models}
      modelName={params.modelName}
      pageData={pageData}
      projectName={params.projectName}
      ref={{ modelsRef }}
      requestErrorMessage={requestErrorMessage}
      selectedModel={selectedModel}
      setMaxArtifactsErrorIsShown={setMaxArtifactsErrorIsShown}
      setSearchParams={setSearchParams}
      setSelectedModelMin={setSelectedModelMin}
      sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
      tableContent={sortedTableContent}
      tableHeaders={sortedTableHeaders}
      viewMode={viewMode}
      virtualizationConfig={virtualizationConfig}
    />
  )
}

export default connect(null, {
  ...detailsActions
})(Models)

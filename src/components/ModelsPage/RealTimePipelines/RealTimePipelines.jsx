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
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { cloneDeep, isEmpty, isNil, set } from 'lodash'

import ActionBar from '../../ActionBar/ActionBar'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Details from '../../Details/Details'
import RealTimePipelinesTableRow from '../../../elements/RealTimePipelinesTableRow/RealTimePipelinesTableRow'
import Table from '../../Table/Table'
import RealTimePipelinesFilters from './RealTimePipelinesFilters'
import { Loader, Tip, FormToggle } from 'igz-controls/components'

import {
  GROUP_BY_NAME,
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB,
  REQUEST_CANCELED,
  FUNCTION_READY_STATE,
  ERROR_STATE,
  UNHEALTHY_STATE,
  DISPLAY_SYSTEM_PIPELINES_FILTER,
  PIPELINE_TOPOLOGY_FILTER,
  FILTER_ALL_ITEMS,
  PIPELINE_FLOW_TOPOLOGY,
  ROUTER_STEP_KIND,
  FUNCTIONS_PAGE
} from '../../../constants'
import createRealTimePipelinesContent from '../../../utils/createRealTimePipelinesContent'
import {
  checkForSelectedPipeline,
  fetchAndParsePipeline,
  filtersConfig,
  generatePageData
} from './realTimePipelines.util'
import RealTimePipelinesCounters from './RealTimePipelinesCounters'
import { fetchArtifactsFunctions, removePipelines } from '../../../reducers/artifactsReducer'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'
import { setFilters } from '../../../reducers/filtersReducer'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'
import { useModelsPage } from '../ModelsPage.context'
import { FULL_VIEW_MODE } from 'igz-controls/constants'
import { fetchNuclioFunctions } from '../../../reducers/nuclioReducer'
import { getNuclioFuncState } from '../../../utils/getNuclioFuncState'
import getState from '../../../utils/getState'

import Yaml from 'igz-controls/images/yaml.svg?react'

import './realTimePipelines.scss'

const RealTimePipelines = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [pipelines, setPipelines] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState({})
  const [statistics, setStatistics] = useState({
    totalPipelines: 0,
    runningFunctions: 0,
    failedFunctions: 0,
    modelEndpoints: 0
  })
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())
  const nuclioAbortControllerRef = useRef(new AbortController())
  const pipelinesRef = useRef(null)
  const lastCheckedPipelineIdRef = useRef(null)
  const pageData = useMemo(() => generatePageData(params.pipelineId), [params.pipelineId])
  const { toggleConvertedYaml } = useModelsPage()
  const [, setSearchParams] = useSearchParams()
  const filters = useFiltersFromSearchParams(filtersConfig)
  const isPipelineLoading = useSelector(store => store.artifactsStore.pipelines.loading)
  const [childPipelinesMap, setChildPipelinesMap] = useState({})

  const pipelinesRowHeight = useMemo(() => getScssVariableValue('--pipelinesRowHeight'), [])
  const pipelinesRowHeightExtended = useMemo(
    () => getScssVariableValue('--pipelinesRowHeightExtended'),
    []
  )
  const pipelinesHeaderRowHeight = useMemo(
    () => getScssVariableValue('--pipelinesHeaderRowHeight'),
    []
  )

  const selectedPipelineWithChildren = useMemo(() => {
    if (isEmpty(selectedPipeline)) return null

    const childFunctions = childPipelinesMap[selectedPipeline.name]

    if (isNil(childFunctions)) return selectedPipeline

    return { ...selectedPipeline, childFunctions }
  }, [childPipelinesMap, selectedPipeline])

  const filterMenuClassNames = classnames('content__action-bar-wrapper')

  const actionsMenu = useMemo(
    () => [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: func =>
            fetchAndParsePipeline(dispatch, func).then(() => toggleConvertedYaml(func))
        }
      ]
    ],
    [dispatch, toggleConvertedYaml]
  )

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()
      nuclioAbortControllerRef.current = new AbortController()
      lastCheckedPipelineIdRef.current = null

      setIsLoading(true)
      Promise.allSettled([
        dispatch(
          fetchArtifactsFunctions({
            project: params.projectName,
            filters,
            config: {
              params: { kind: 'serving' },
              ui: {
                controller: abortControllerRef.current,
                setRequestErrorMessage
              }
            }
          })
        ).unwrap(),
        dispatch(
          fetchNuclioFunctions({
            project: params.projectName,
            signal: nuclioAbortControllerRef.current.signal,
            getOriginalData: true
          })
        ).unwrap()
      ]).then(([mlrunFunctionsResult, nuclioFunctionsResult]) => {
        if (mlrunFunctionsResult.status === 'fulfilled' && !isNil(mlrunFunctionsResult.value)) {
          let totalPipelines = 0
          let runningFunctions = 0
          let failedFunctions = 0
          let modelEndpoints = 0
          const childFunctionsMap = {}

          const filteredPipelines = mlrunFunctionsResult.value.reduce((pipelinesList, _func) => {
            const func = cloneDeep(_func)
            const nuclioFunc =
              nuclioFunctionsResult?.value?.[func.nuclio_name || `${func.project}-${func.name}`] ||
              {}
            const parent = Object.entries(func.labels).find(([key]) =>
              key.includes('parent-function')
            )?.[1]
            const showSystems = filters[DISPLAY_SYSTEM_PIPELINES_FILTER]
            const isMonitoringInfra = func.labels['mlrun__type'] === 'mlrun__model-monitoring-infra'
            const topology = (func.graph?.kind || PIPELINE_FLOW_TOPOLOGY).toLowerCase()
            const isCorrectTopology =
              topology === filters[PIPELINE_TOPOLOGY_FILTER] ||
              filters[PIPELINE_TOPOLOGY_FILTER] === FILTER_ALL_ITEMS

            if (parent) {
              childFunctionsMap[parent] = [
                ...(childFunctionsMap[parent] || []),
                { func, nuclioFunc }
              ]
            }

            const filteredFunc = !parent && (showSystems || !isMonitoringInfra) && isCorrectTopology

            if (!filteredFunc) return pipelinesList

            totalPipelines += 1

            const nuclioFuncState = !isEmpty(nuclioFunc)
              ? (getNuclioFuncState(nuclioFunc) || '').toLocaleLowerCase()
              : ''

            const state = nuclioFuncState || func.state?.value || func.status?.state

            if (state === FUNCTION_READY_STATE || state === 'running') {
              runningFunctions += 1
            } else if (state === ERROR_STATE || state === UNHEALTHY_STATE) {
              failedFunctions += 1
            }

            set(func, 'state', getState(state, FUNCTIONS_PAGE, 'nuclioFunctions'))

            const modelEndpointsMainCount =
              Object.keys(func.graph?.routes || {}).length ||
              func.graph?.model_endpoints_names?.length ||
              0 // in the future we will get models endpoints count from the BE

            const routesInFlowCount = Object.values(func.graph?.steps || {}).reduce(
              (count, step) => {
                if (step?.kind === ROUTER_STEP_KIND) {
                  count += Object.keys(step.routes || {}).length + 1 // routes + step itself
                }
                return count
              },
              0
            )
            const modelEndpointsCount = modelEndpointsMainCount + routesInFlowCount

            modelEndpoints += modelEndpointsCount

            pipelinesList.push({
              ...func,
              nuclioFunc,
              modelEndpointsCount
            })

            return pipelinesList
          }, [])

          setPipelines(filteredPipelines)
          setStatistics(prev => ({
            ...prev,
            totalPipelines,
            runningFunctions,
            failedFunctions,
            modelEndpoints
          }))
          setChildPipelinesMap(childFunctionsMap)
        }
        setIsLoading(false)
      })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      setSelectedPipeline({})
      setPipelines([])

      return fetchData(filters)
    },
    [fetchData]
  )

  const tableContent = useMemo(() => {
    return createRealTimePipelinesContent(pipelines, params.projectName)
  }, [pipelines, params.projectName])

  const fetchInitialData = useCallback(
    filters => {
      fetchData(filters)
      dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
    },
    [dispatch, fetchData]
  )

  const handleRefreshSelectedItem = useCallback(() => {
    fetchAndParsePipeline(dispatch, selectedPipeline).then(setSelectedPipeline)
  }, [dispatch, selectedPipeline])

  useInitialTableFetch({ fetchData: fetchInitialData, filters })

  useEffect(() => {
    return () => {
      setPipelines([])
      dispatch(removePipelines())
      abortControllerRef.current.abort(REQUEST_CANCELED)
      nuclioAbortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [dispatch])

  useEffect(() => {
    checkForSelectedPipeline(
      pipelines,
      params.pipelineId,
      navigate,
      params.projectName,
      setSelectedPipeline,
      dispatch,
      lastCheckedPipelineIdRef
    )
  }, [dispatch, navigate, params.pipelineId, params.projectName, pipelines])

  useEffect(() => {
    if (isEmpty(selectedPipeline)) {
      lastCheckedPipelineIdRef.current = null
    }
  }, [selectedPipeline])

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: tableContent
    },
    renderTriggerItem: params.pipelineId,
    heightData: {
      headerRowHeight: pipelinesHeaderRowHeight,
      rowHeight: pipelinesRowHeight,
      rowHeightExtended: pipelinesRowHeightExtended
    }
  })

  return (
    <>
      {isLoading && <Loader />}
      <div className="models" ref={pipelinesRef}>
        <div className="table-container">
          <div className={filterMenuClassNames}>
            <ModelsPageTabs />
            <ActionBar
              closeParamName={REAL_TIME_PIPELINES_TAB}
              filters={filters}
              filtersConfig={filtersConfig}
              handleRefresh={handleRefresh}
              setSearchParams={setSearchParams}
              tab={REAL_TIME_PIPELINES_TAB}
              withoutExpandButton
              getCustomActions={applyFilters => [
                <Fragment key={DISPLAY_SYSTEM_PIPELINES_FILTER}>
                  <FormToggle
                    className="action-bar__filters-item"
                    name={DISPLAY_SYSTEM_PIPELINES_FILTER}
                    label={filtersConfig[DISPLAY_SYSTEM_PIPELINES_FILTER].label}
                    labelTip="Default display shows only user-created pipelines"
                    onClick={event =>
                      applyFilters({ [DISPLAY_SYSTEM_PIPELINES_FILTER]: event.target.checked })
                    }
                  />
                </Fragment>
              ]}
            >
              <RealTimePipelinesFilters />
            </ActionBar>
          </div>
          <RealTimePipelinesCounters loading={isLoading} statistics={statistics} />
          <div className="real-time-pipelines__section">
            <div className="real-time-pipelines__section-item">
              <div className="section-item_title">
                <span>All Serving Pipelines</span>
                <Tip text="This data is relevant to the root function" />
              </div>
              {isLoading ? null : pipelines.length === 0 ? (
                <NoData
                  message={getNoDataMessage(
                    filters,
                    filtersConfig,
                    requestErrorMessage,
                    MODELS_PAGE,
                    REAL_TIME_PIPELINES_TAB,
                    filtersStore
                  )}
                />
              ) : (
                <>
                  <Table
                    actionsMenu={actionsMenu}
                    pageData={pageData}
                    selectedItem={selectedPipelineWithChildren}
                    tab={REAL_TIME_PIPELINES_TAB}
                    tableClassName="pipelines-table"
                    tableHeaders={tableContent[0]?.content ?? []}
                    virtualizationConfig={virtualizationConfig}
                    viewMode={FULL_VIEW_MODE}
                  >
                    {tableContent.map(
                      (tableItem, index) =>
                        isRowRendered(virtualizationConfig, index) && (
                          <RealTimePipelinesTableRow
                            actionsMenu={actionsMenu}
                            key={index}
                            rowItem={tableItem}
                          />
                        )
                    )}
                  </Table>
                  {isPipelineLoading && isEmpty(selectedPipelineWithChildren) && <Loader />}
                  {!isEmpty(selectedPipelineWithChildren) && (
                    <Details
                      actionsMenu={actionsMenu}
                      detailsMenu={pageData.details.menu}
                      handleRefresh={handleRefreshSelectedItem}
                      isDetailsScreen
                      pageData={pageData}
                      tab={REAL_TIME_PIPELINES_TAB}
                      selectedItem={selectedPipelineWithChildren}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RealTimePipelines

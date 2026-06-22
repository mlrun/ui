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
import { isEmpty, isNil } from 'lodash'

import ActionBar from '../../ActionBar/ActionBar'
import NoData from '../../../common/NoData/NoData'
import Details from '../../Details/Details'
import RealTimePipelinesTableRow from '../../../elements/RealTimePipelinesTableRow/RealTimePipelinesTableRow'
import Table from '../../Table/Table'
import RealTimePipelinesFilters from './RealTimePipelinesFilters'
import { Loader, Tip, FormToggle } from 'igz-controls/components'

import {
  MODELS_PAGE,
  REAL_TIME_PIPELINES_TAB,
  FUNCTION_READY_STATE,
  FUNCTION_RUNNING_STATE,
  ERROR_STATE,
  UNHEALTHY_STATE,
  DISPLAY_SYSTEM_PIPELINES_FILTER,
  PIPELINE_TOPOLOGY_FILTER,
  FILTER_ALL_ITEMS,
  PIPELINE_FLOW_TOPOLOGY,
  ROUTER_STEP_KIND
} from '../../../constants'
import createRealTimePipelinesContent from '../../../utils/createRealTimePipelinesContent'
import {
  checkForSelectedPipeline,
  filtersConfig,
  generatePageData,
  MONITORING_INFRA_LABEL_KEY,
  MONITORING_INFRA_LABEL_VALUE,
  PIPELINES_ERROR_MESSAGE,
  PIPELINES_DEFAULT_FETCH_CONFIG
} from './realTimePipelines.util'
import RealTimePipelinesCounters from './RealTimePipelinesCounters'
import { removePipelines } from '../../../reducers/artifactsReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { useModelsPage } from '../ModelsPage.context'
import { useNuclioEnrichedFunctions } from '../../../hooks/useNuclioEnrichedFunctions.hook'
import { FULL_VIEW_MODE } from 'igz-controls/constants'

import Yaml from 'igz-controls/images/yaml.svg?react'

import './realTimePipelines.scss'

const RealTimePipelines = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [selectedPipeline, setSelectedPipeline] = useState({})
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const pipelinesRef = useRef(null)
  const lastCheckedPipelineIdRef = useRef(null)
  const pageData = useMemo(() => generatePageData(params.pipelineId), [params.pipelineId])
  const { toggleConvertedYaml, setSelectedItemName } = useModelsPage()
  const [, setSearchParams] = useSearchParams()
  const filters = useFiltersFromSearchParams(filtersConfig)
  const isPipelineLoading = useSelector(
    store => store.functionsStore.funcLoading || store.nuclioStore.nuclioFunctionLoading
  )

  const buildFetchConfig = useCallback(
    currentFilters => ({
      filters: currentFilters,
      config: {
        ...PIPELINES_DEFAULT_FETCH_CONFIG.config,
        ui: { setRequestErrorMessage }
      }
    }),
    []
  )

  const {
    fetchData: fetchNuclioEnriched,
    fetchSingleEnrichedFunction,
    enrichedFunctions,
    isLoading
  } = useNuclioEnrichedFunctions({
    projectName: params.projectName,
    filters,
    buildFetchConfig,
    errorMessage: PIPELINES_ERROR_MESSAGE
  })

  const { pipelines, statistics, childPipelinesMap } = useMemo(() => {
    let totalPipelines = 0
    let runningFunctions = 0
    let failedFunctions = 0
    let modelEndpoints = 0
    const childFunctionsMap = {}

    const filteredPipelines = enrichedFunctions.reduce((pipelinesList, func) => {
      const parent = Object.entries(func.labels || {}).find(([key]) =>
        key.includes('parent-function')
      )?.[1]

      if (parent) {
        childFunctionsMap[parent] = [
          ...(childFunctionsMap[parent] || []),
          { func, nuclioFunc: func.nuclioFunc }
        ]
      }

      const showSystems = filters[DISPLAY_SYSTEM_PIPELINES_FILTER]
      const isMonitoringInfra =
        func.labels?.[MONITORING_INFRA_LABEL_KEY] === MONITORING_INFRA_LABEL_VALUE
      const topology = (func.graph?.kind || PIPELINE_FLOW_TOPOLOGY).toLowerCase()
      const isCorrectTopology =
        topology === filters[PIPELINE_TOPOLOGY_FILTER] ||
        filters[PIPELINE_TOPOLOGY_FILTER] === FILTER_ALL_ITEMS

      if (parent || (!showSystems && isMonitoringInfra) || !isCorrectTopology) return pipelinesList

      totalPipelines += 1

      const stateValue = func.state?.value
      if (stateValue === FUNCTION_READY_STATE || stateValue === FUNCTION_RUNNING_STATE) {
        runningFunctions += 1
      } else if (stateValue === ERROR_STATE || stateValue === UNHEALTHY_STATE) {
        failedFunctions += 1
      }

      const modelEndpointsMainCount =
        Object.keys(func.graph?.routes || {}).length ||
        func.graph?.model_endpoints_names?.length ||
        0

      const routesInFlowCount = Object.values(func.graph?.steps || {}).reduce((count, step) => {
        if (step?.kind === ROUTER_STEP_KIND) {
          count += Object.keys(step.routes || {}).length + 1
        }
        return count
      }, 0)

      const modelEndpointsCount = modelEndpointsMainCount + routesInFlowCount
      modelEndpoints += modelEndpointsCount

      pipelinesList.push({ ...func, modelEndpointsCount })
      return pipelinesList
    }, [])

    return {
      pipelines: filteredPipelines,
      statistics: { totalPipelines, runningFunctions, failedFunctions, modelEndpoints },
      childPipelinesMap: childFunctionsMap
    }
  }, [enrichedFunctions, filters])

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
    const correctStatusBasedOnNuclioFunction =
      pipelines?.find(pipeline => pipeline.name === selectedPipeline.name)?.state ||
      selectedPipeline.state

    if (isNil(childFunctions))
      return { ...selectedPipeline, state: correctStatusBasedOnNuclioFunction }

    return { ...selectedPipeline, childFunctions, state: correctStatusBasedOnNuclioFunction }
  }, [childPipelinesMap, pipelines, selectedPipeline])

  const filterMenuClassNames = classnames('content__action-bar-wrapper')

  const actionsMenu = useMemo(
    () => [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: func => toggleConvertedYaml(func)
        }
      ]
    ],
    [toggleConvertedYaml]
  )

  const handleRefresh = useCallback(
    currentFilters => {
      setSelectedPipeline({})
      lastCheckedPipelineIdRef.current = null

      return fetchNuclioEnriched(buildFetchConfig(currentFilters))
    },
    [fetchNuclioEnriched, buildFetchConfig]
  )

  const tableContent = useMemo(() => {
    return createRealTimePipelinesContent(pipelines, params.projectName)
  }, [pipelines, params.projectName])

  const handleRefreshSelectedItem = useCallback(() => {
    fetchSingleEnrichedFunction({
      name: selectedPipeline.name,
      hash: selectedPipeline.hash,
      tag: selectedPipeline.tag,
      nuclioName: selectedPipeline.nuclio_name
    })
      .then(enriched => {
        if (enriched) {
          setSelectedPipeline(enriched)
        } else {
          setSelectedPipeline({})
        }
      })
      .catch(error => {
        setSelectedPipeline({})
        showErrorNotification(
          dispatch,
          error,
          '',
          'This real-time pipeline either does not exist or was deleted'
        )
      })
  }, [dispatch, fetchSingleEnrichedFunction, selectedPipeline])

  useEffect(() => {
    return () => {
      dispatch(removePipelines())
    }
  }, [dispatch])

  useEffect(() => {
    checkForSelectedPipeline({
      pipelines,
      pipelineId: params.pipelineId,
      navigate,
      projectName: params.projectName,
      setSelectedPipeline,
      fetchSingleEnrichedFunction,
      dispatch,
      lastCheckedPipelineIdRef
    })
  }, [
    dispatch,
    fetchSingleEnrichedFunction,
    navigate,
    params.pipelineId,
    params.projectName,
    pipelines
  ])

  useEffect(() => {
    if (isEmpty(selectedPipeline)) {
      lastCheckedPipelineIdRef.current = null
    }
  }, [selectedPipeline])

  useEffect(() => {
    setSelectedItemName(selectedPipeline?.name || '')
    return () => setSelectedItemName('')
  }, [selectedPipeline, setSelectedItemName])

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
                  {isPipelineLoading && <Loader />}
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

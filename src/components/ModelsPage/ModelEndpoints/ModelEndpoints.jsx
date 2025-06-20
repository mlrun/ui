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
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

import ActionBar from '../../ActionBar/ActionBar'
import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import ModelEndpointsFilters from './ModelEndpointsFilters'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import { Loader } from 'igz-controls/components'

import {
  GROUP_BY_NONE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  REQUEST_CANCELED
} from '../../../constants'
import { chooseOrFetchModelEndpoint, filtersConfig, generatePageData } from './modelEndpoints.util'
import { createModelEndpointsRowData } from '../../../utils/createArtifactsContent'
import { fetchModelEndpoints, removeModelEndpoints } from '../../../reducers/artifactsReducer'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { isDetailsTabExists } from '../../../utils/link-helper.util'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'
import { setFilters } from '../../../reducers/filtersReducer'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { useInitialTableFetch } from '../../../hooks/useInitialTableFetch.hook'
import { useModelsPage } from '../ModelsPage.context'
import { useSortTable } from '../../../hooks/useSortTable.hook'

import MonitorIcon from 'igz-controls/images/monitor-icon.svg?react'
import Yaml from 'igz-controls/images/yaml.svg?react'

import './modelEndpoints.scss'

const ModelEndpoints = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [modelEndpoints, setModelEndpoints] = useState([])
  const [selectedModelEndpoint, setSelectedModelEndpoint] = useState({})
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())
  const modelEndpointsRef = useRef(null)
  const [, setSearchParams] = useSearchParams()
  const filters = useFiltersFromSearchParams(filtersConfig)

  const { handleMonitoring, toggleConvertedYaml } = useModelsPage()

  const modelEndpointsRowHeight = useMemo(
    () => getScssVariableValue('--modelEndpointsRowHeight'),
    []
  )
  const modelEndpointsRowHeightExtended = useMemo(
    () => getScssVariableValue('--modelEndpointsRowHeightExtended'),
    []
  )
  const modelEndpointsHeaderRowHeight = useMemo(
    () => getScssVariableValue('--modelEndpointsHeaderRowHeight'),
    []
  )
  const pageData = useMemo(
    () =>
      generatePageData(
        selectedModelEndpoint,
        frontendSpec.model_monitoring_dashboard_url,
        handleMonitoring
      ),
    [frontendSpec.model_monitoring_dashboard_url, handleMonitoring, selectedModelEndpoint]
  )

  const actionsMenu = useMemo(
    () => [
      [
        {
          label: 'Monitoring',
          icon: <MonitorIcon />,
          tooltip: !frontendSpec.model_monitoring_dashboard_url
            ? 'Grafana service unavailable'
            : '',
          disabled: !frontendSpec.model_monitoring_dashboard_url,
          onClick: handleMonitoring,
          hidden: !isEmpty(selectedModelEndpoint)
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: modelEndpointMin =>
            chooseOrFetchModelEndpoint(dispatch, selectedModelEndpoint, modelEndpointMin).then(
              toggleConvertedYaml
            )
        }
      ]
    ],
    [
      dispatch,
      frontendSpec.model_monitoring_dashboard_url,
      handleMonitoring,
      selectedModelEndpoint,
      toggleConvertedYaml
    ]
  )

  const fetchData = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchModelEndpoints({
          project: params.projectName,
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          },
          params: {
            latest_only: 'True'
          }
        })
      )
        .unwrap()
        .then(modelEndpoints => {
          if (modelEndpoints) {
            setModelEndpoints(modelEndpoints)
          }
        })
    },
    [dispatch, params.projectName]
  )

  const handleRefresh = useCallback(
    filters => {
      setModelEndpoints([])
      setSelectedModelEndpoint({})

      return fetchData(filters)
    },
    [fetchData]
  )

  const handleSelectItem = useCallback(
    modelEndpointMin => {
      chooseOrFetchModelEndpoint(dispatch, {}, modelEndpointMin).then(setSelectedModelEndpoint)
    },
    [dispatch]
  )

  const fetchInitialData = useCallback(
    filters => {
      fetchData(filters)
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    },
    [dispatch, fetchData]
  )

  useInitialTableFetch({ fetchData: fetchInitialData, filters })

  useEffect(() => {
    return () => {
      setModelEndpoints([])
      dispatch(removeModelEndpoints())
      setSelectedModelEndpoint({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [dispatch, params.projectName])

  useEffect(() => {
    if (params.name && modelEndpoints.length > 0) {
      const searchItem = modelEndpoints.find(item => item.metadata?.uid === params.tag)

      if (!searchItem) {
        navigate(
          `/projects/${params.projectName}/models/${MODEL_ENDPOINTS_TAB}${window.location.search}`,
          { replace: true }
        )
      } else if (searchItem.metadata.uid !== selectedModelEndpoint?.metadata?.uid) {
        handleSelectItem(searchItem)
      }
    } else {
      setSelectedModelEndpoint({})
    }
  }, [
    dispatch,
    handleSelectItem,
    modelEndpoints,
    navigate,
    params.name,
    params.projectName,
    params.tag,
    selectedModelEndpoint?.metadata
  ])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  const tableContent = useMemo(() => {
    return modelEndpoints.map(contentItem =>
      createModelEndpointsRowData(contentItem, params.projectName)
    )
  }, [modelEndpoints, params.projectName])

  const tableHeaders = useMemo(() => tableContent[0]?.content ?? [], [tableContent])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: tableHeaders,
      content: tableContent,
      sortConfig: {
        allowSortBy: ['name', 'function'],
        defaultSortBy: 'function',
        defaultDirection: 'asc'
      }
    })

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: sortedTableContent,
      selectedItem: selectedModelEndpoint
    },
    heightData: {
      headerRowHeight: modelEndpointsHeaderRowHeight,
      rowHeight: modelEndpointsRowHeight,
      rowHeightExtended: modelEndpointsRowHeightExtended
    }
  })

  return (
    <>
      {(artifactsStore.modelEndpoints.modelEndpointLoading ||
        artifactsStore.modelEndpoints.loading) && <Loader />}
      <div className="models" ref={modelEndpointsRef}>
        <div className="table-container">
          <div className="content__action-bar-wrapper">
            <ModelsPageTabs />
            <ActionBar
              filters={filters}
              filtersConfig={filtersConfig}
              handleRefresh={handleRefresh}
              closeParamName={MODEL_ENDPOINTS_TAB}
              setSearchParams={setSearchParams}
              tab={MODEL_ENDPOINTS_TAB}
              withoutExpandButton
            >
              <ModelEndpointsFilters />
            </ActionBar>
          </div>
          {artifactsStore.modelEndpoints.loading ? null : modelEndpoints.length === 0 ? (
            <NoData
              message={getNoDataMessage(
                filters,
                filtersConfig,
                requestErrorMessage,
                MODELS_PAGE,
                MODEL_ENDPOINTS_TAB,
                filtersStore
              )}
            />
          ) : (
            <>
              <Table
                actionsMenu={actionsMenu}
                pageData={pageData}
                selectedItem={selectedModelEndpoint}
                tab={MODEL_ENDPOINTS_TAB}
                tableClassName="model-endpoints-table"
                tableHeaders={sortedTableHeaders}
                virtualizationConfig={virtualizationConfig}
                sortProps={{ sortTable, selectedColumnName, getSortingIcon }}
              >
                {sortedTableContent.map(
                  (tableItem, index) =>
                    isRowRendered(virtualizationConfig, index) && (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        key={tableItem.data.ui.identifierUnique}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedItem={selectedModelEndpoint}
                        tab={MODEL_ENDPOINTS_TAB}
                      />
                    )
                )}
              </Table>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ModelEndpoints

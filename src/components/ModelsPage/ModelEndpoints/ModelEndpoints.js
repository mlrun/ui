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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty, orderBy } from 'lodash'

import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import FilterMenu from '../../FilterMenu/FilterMenu'
import Loader from '../../../common/Loader/Loader'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'

import detailsActions from '../../../actions/details'
import {
  GROUP_BY_NONE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  REQUEST_CANCELED
} from '../../../constants'
import { useMode } from '../../../hooks/mode.hook'
import { createModelEndpointsRowData } from '../../../utils/createArtifactsContent'
import { fetchModelEndpoints, removeModelEndpoints } from '../../../reducers/artifactsReducer'
import { filters, generatePageData } from './modelEndpoints.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { setFilters } from '../../../reducers/filtersReducer'
import { useModelsPage } from '../ModelsPage.context'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'

import { ReactComponent as MonitorIcon } from 'igz-controls/images/monitor-icon.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

import cssVariables from './modelEndpoints.scss'

const ModelEndpoints = () => {
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const [modelEndpoints, setModelEndpoints] = useState([])
  const [selectedModelEndpoint, setSelectedModelEndpoint] = useState({})
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const artifactsStore = useSelector(store => store.artifactsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const { isDemoMode } = useMode()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(new AbortController())
  const modelEndpointsRef = useRef(null)
  const tableBodyRef = useRef(null)
  const tableRef = useRef(null)

  const { handleMonitoring, toggleConvertedYaml } = useModelsPage()

  const pageData = useMemo(
    () =>
      generatePageData(
        selectedModelEndpoint,
        frontendSpec.model_monitoring_dashboard_url,
        handleMonitoring,
        isDemoMode
      ),
    [
      frontendSpec.model_monitoring_dashboard_url,
      handleMonitoring,
      isDemoMode,
      selectedModelEndpoint
    ]
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
          onClick: toggleConvertedYaml
        }
      ]
    ],
    [
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
              setLargeRequestErrorMessage
            }
          },
          params: {
            metric: 'latency_avg_1h',
            start: 'now-10m'
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
    modelEndpoint => {
      if (!isEmpty(modelEndpoint)) {
        dispatch(
          detailsActions.fetchModelEndpointWithAnalysis(
            params.projectName,
            modelEndpoint.metadata.uid
          )
        )
      }

      setSelectedModelEndpoint(modelEndpoint)
    },
    [dispatch, params.projectName]
  )

  useEffect(() => {
    fetchData({})
    dispatch(setFilters({ groupBy: GROUP_BY_NONE, sortBy: 'function' }))
  }, [dispatch, fetchData])

  useEffect(() => {
    return () => {
      setModelEndpoints([])
      dispatch(removeModelEndpoints())
      dispatch(detailsActions.removeModelEndpoint())
      setSelectedModelEndpoint({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [dispatch])

  useEffect(() => {
    if (params.name && modelEndpoints.length > 0) {
      const searchItem = modelEndpoints.find(item => item.metadata?.uid === params.tag)

      if (!searchItem) {
        navigate(`/projects/${params.projectName}/models/${MODEL_ENDPOINTS_TAB}`, { replace: true })
      } else if (searchItem.metadata.uid !== selectedModelEndpoint.metadata?.uid) {
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
    selectedModelEndpoint.metadata?.uid
  ])

  useEffect(() => {
    if (params.name && params.tag && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, location, pageData.details.menu, params.name, params.tag, params.tab])

  const sortedContent = useMemo(() => {
    const path = filtersStore.sortBy === 'function' ? 'spec.model_uri' : 'spec.model'

    return orderBy(modelEndpoints, [path], ['asc'])
  }, [modelEndpoints, filtersStore.sortBy])

  const tableContent = useMemo(() => {
    return sortedContent.map(contentItem =>
      createModelEndpointsRowData(contentItem, params.projectName)
    )
  }, [params.projectName, sortedContent])

  const virtualizationConfig = useVirtualization({
    tableRef,
    tableBodyRef,
    rowsData: {
      content: tableContent,
      selectedItem: selectedModelEndpoint
    },
    heightData: {
      headerRowHeight: cssVariables.modelEndpointsHeaderRowHeight,
      rowHeight: cssVariables.modelEndpointsRowHeight,
      rowHeightExtended: cssVariables.modelEndpointsRowHeightExtended
    }
  })

  return (
    <>
      {artifactsStore.modelEndpoints.loading && <Loader />}
      <div className="models" ref={modelEndpointsRef}>
        <div className="table-container">
          <div className="content__action-bar-wrapper">
            <ModelsPageTabs />
            <div className="action-bar">
              <FilterMenu
                filters={filters}
                onChange={handleRefresh}
                page={MODELS_PAGE}
                tab={MODEL_ENDPOINTS_TAB}
                withoutExpandButton
              />
            </div>
          </div>
          {artifactsStore.modelEndpoints.loading ? null : modelEndpoints.length === 0 ? (
            <NoData
              message={getNoDataMessage(
                filtersStore,
                filters,
                largeRequestErrorMessage,
                MODELS_PAGE,
                MODEL_ENDPOINTS_TAB
              )}
            />
          ) : (
            <>
              <Table
                actionsMenu={actionsMenu}
                handleCancel={() => handleSelectItem({})}
                pageData={pageData}
                ref={{ tableRef, tableBodyRef }}
                retryRequest={fetchData}
                selectedItem={selectedModelEndpoint}
                tab={MODEL_ENDPOINTS_TAB}
                tableClassName="model-endpoints-table"
                tableHeaders={tableContent[0]?.content ?? []}
                virtualizationConfig={virtualizationConfig}
              >
                {tableContent.map(
                  (tableItem, index) =>
                    isRowRendered(virtualizationConfig, index) && (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleSelectItem={handleSelectItem}
                        key={index}
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

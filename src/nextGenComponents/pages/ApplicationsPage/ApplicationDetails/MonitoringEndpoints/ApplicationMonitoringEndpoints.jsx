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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { FileCode2 } from 'lucide-react'

import DetailsDataTab from '../../../../shared/DetailsDataTab/DetailsDataTab'
import YamlModal from '../../../../shared/YamlModal/YamlModal'
import MonitoringEndpointsFilters from './MonitoringEndpointsFilters'
import EndpointDetailsDialog from './EndpointDetailsDialog'
import { getMonitoringEndpointsColumns } from './monitoringEndpointsColumns'
import {
  MONITORING_ENDPOINTS_FILTER_CONFIG,
  MONITORING_ENDPOINTS_NO_DATA_MESSAGE
} from './monitoringEndpoints.constants'
import { fetchModelEndpoints, removeModelEndpoints } from '../../../../../reducers/artifactsReducer'
import { toggleYaml } from '../../../../../reducers/appReducer'
import { monitorModelEndpoint } from '../../../../../components/ModelsPage/ModelEndpoints/modelEndpoints.util'
import { FUNCTION_NAME_FILTER } from '../../../../../constants'
import {
  DEFAULT_NAME_SORTING,
  FILTER_ALL_OPTION,
  VIEW_YAML_LABEL
} from '../applicationDetails.constants'

const filterEndpointsByLabel = (endpoints, filters) => {
  if (!filters.label) return endpoints

  return endpoints.filter(endpoint => {
    const labels = endpoint.metadata?.labels ?? {}
    return Object.keys(labels).some(key => key === filters.label)
  })
}

const ApplicationMonitoringEndpoints = ({ application }) => {
  const dispatch = useDispatch()
  const { projectName } = useParams()
  const abortControllerRef = useRef(null)
  const modelEndpoints = useSelector(store => store.artifactsStore.modelEndpoints.allData)
  const isLoading = useSelector(store => store.artifactsStore.modelEndpoints.loading)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [yamlEndpoint, setYamlEndpoint] = useState(null)

  const toggleConvertedYaml = useCallback(data => dispatch(toggleYaml(data)), [dispatch])

  const monitoringDashboardUrl = frontendSpec?.model_monitoring_dashboard_url

  const handleMonitoring = useCallback(
    item => {
      if (!monitoringDashboardUrl) return
      monitorModelEndpoint(monitoringDashboardUrl, item, projectName)
    },
    [monitoringDashboardUrl, projectName]
  )

  const labelOptions = useMemo(() => {
    const labelKeys = new Set()
    modelEndpoints.forEach(endpoint => {
      Object.keys(endpoint.metadata?.labels ?? {}).forEach(key => labelKeys.add(key))
    })

    return [FILTER_ALL_OPTION, ...[...labelKeys].sort().map(key => ({ value: key, label: key }))]
  }, [modelEndpoints])

  const fetchEndpoints = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    dispatch(
      fetchModelEndpoints({
        project: projectName,
        filters: {
          [FUNCTION_NAME_FILTER]: application.name
        },
        config: {
          ui: { controller: abortControllerRef.current }
        },
        params: {
          latest_only: 'True',
          'function-tag': application.tag
        }
      })
    )
  }, [dispatch, projectName, application.name, application.tag])

  useEffect(() => {
    fetchEndpoints()

    return () => {
      abortControllerRef.current?.abort()
      dispatch(removeModelEndpoints())
    }
  }, [dispatch, fetchEndpoints])

  const handleRefresh = useCallback(() => {
    fetchEndpoints()
  }, [fetchEndpoints])

  const handleEndpointClick = useCallback(({ uid, name }) => {
    setSelectedEndpoint({ uid, name })
  }, [])

  const handleClosePopup = useCallback(() => setSelectedEndpoint(null), [])
  const handleCloseYaml = useCallback(() => setYamlEndpoint(null), [])

  const columns = useMemo(
    () => getMonitoringEndpointsColumns(handleEndpointClick),
    [handleEndpointClick]
  )

  const rowActions = useCallback(
    endpoint => [
      { label: VIEW_YAML_LABEL, icon: FileCode2, onClick: () => setYamlEndpoint(endpoint) }
    ],
    []
  )

  const renderFilters = useCallback(
    ({ filters, applyMultipleFilters }) => (
      <MonitoringEndpointsFilters
        filters={filters}
        applyMultipleFilters={applyMultipleFilters}
        labelOptions={labelOptions}
      />
    ),
    [labelOptions]
  )

  return (
    <>
      <DetailsDataTab
        data={modelEndpoints}
        columns={columns}
        isLoading={isLoading}
        filtersConfig={MONITORING_ENDPOINTS_FILTER_CONFIG}
        filterFn={filterEndpointsByLabel}
        renderFilters={renderFilters}
        rowActions={rowActions}
        onRefresh={handleRefresh}
        showRefreshButton={false}
        initialSorting={DEFAULT_NAME_SORTING}
        noDataMessage={MONITORING_ENDPOINTS_NO_DATA_MESSAGE}
      />
      {selectedEndpoint && (
        <EndpointDetailsDialog
          isOpen={!!selectedEndpoint}
          onClose={handleClosePopup}
          modelEndpointUid={selectedEndpoint?.uid}
          modelEndpointName={selectedEndpoint?.name}
          frontendSpec={frontendSpec}
          handleMonitoring={handleMonitoring}
          toggleConvertedYaml={toggleConvertedYaml}
        />
      )}
      <YamlModal open={!!yamlEndpoint} data={yamlEndpoint} onClose={handleCloseYaml} />
    </>
  )
}

ApplicationMonitoringEndpoints.propTypes = {
  application: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tag: PropTypes.string
  }).isRequired
}

export default ApplicationMonitoringEndpoints

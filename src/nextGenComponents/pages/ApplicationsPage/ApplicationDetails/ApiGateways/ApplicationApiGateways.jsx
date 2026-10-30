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
import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { FileCode2 } from 'lucide-react'
import { omit } from 'lodash-es'

import DetailsDataTab from '../../../../shared/DetailsDataTab/DetailsDataTab'
import YamlModal from '../../../../shared/YamlModal/YamlModal'
import ApiGatewaysFilters from './ApiGatewaysFilters'
import { apiGatewaysColumns } from './apiGatewaysColumns'
import { filterApiGatewaysBySearchFields } from './applicationApiGateways.util'
import {
  API_GATEWAYS_FILTER_CONFIG,
  API_GATEWAYS_NO_DATA_MESSAGE,
  DEFAULT_CREATED_AT_SORTING,
  FILTER_ALL_OPTION,
  VIEW_YAML_LABEL
} from '../applicationDetails.constants'

const ApplicationApiGateways = ({ application }) => {
  const [yamlGateway, setYamlGateway] = useState(null)
  const handleCloseYaml = useCallback(() => setYamlGateway(null), [])
  const applicationGateways = useMemo(
    () => application.applicationGateways ?? [],
    [application.applicationGateways]
  )

  const authModeOptions = useMemo(() => {
    const modes = new Set(
      applicationGateways.map(gw => gw.spec?.authenticationMode).filter(Boolean)
    )

    return [FILTER_ALL_OPTION, ...[...modes].sort().map(mode => ({ value: mode, label: mode }))]
  }, [applicationGateways])

  const rowActions = useCallback(
    gateway => [
      {
        label: VIEW_YAML_LABEL,
        icon: FileCode2,
        onClick: () => setYamlGateway(omit(gateway, ['relationship', 'matchedUpstream']))
      }
    ],
    []
  )

  const renderFilters = useCallback(
    ({ filters, setFilterValue, applyFilter, applyMultipleFilters }) => (
      <ApiGatewaysFilters
        filters={filters}
        setFilterValue={setFilterValue}
        applyFilter={applyFilter}
        applyMultipleFilters={applyMultipleFilters}
        authModeOptions={authModeOptions}
      />
    ),
    [authModeOptions]
  )

  return (
    <>
      <DetailsDataTab
        data={applicationGateways}
        columns={apiGatewaysColumns}
        filtersConfig={API_GATEWAYS_FILTER_CONFIG}
        filterFn={filterApiGatewaysBySearchFields}
        renderFilters={renderFilters}
        rowActions={rowActions}
        showRefreshButton={false}
        initialSorting={DEFAULT_CREATED_AT_SORTING}
        noDataMessage={API_GATEWAYS_NO_DATA_MESSAGE}
      />
      <YamlModal open={!!yamlGateway} data={yamlGateway} onClose={handleCloseYaml} />
    </>
  )
}

ApplicationApiGateways.propTypes = {
  application: PropTypes.shape({
    applicationGateways: PropTypes.array,
    name: PropTypes.string.isRequired,
    tag: PropTypes.string
  }).isRequired
}

export default ApplicationApiGateways

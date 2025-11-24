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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'

import DetailsPopUp from '../DetailsPopUp'

import {
  generatePageData,
  generateActionsMenu
} from '../../../components/ModelsPage/ModelEndpoints/modelEndpoints.util'
import modelEndpointsApi from '../../../api/modelEndpoints-api'
import { parseModelEndpoints } from '../../../utils/parseModelEndpoints'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

const ModelEndpointPopUp = ({
  modelEndpointUid,
  modelEndpointName,
  frontendSpec,
  handleMonitoring,
  isOpen,
  onResolve,
  toggleConvertedYaml
}) => {
  const dispatch = useDispatch()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModelEndpoint, setSelectedModelEndpoint] = useState({})

  const modelMonitoringDashboardUrl = useMemo(
    () => frontendSpec.model_monitoring_dashboard_url,
    [frontendSpec.model_monitoring_dashboard_url]
  )

  const fetchModelEndpoint = useCallback(() => {
    setIsLoading(true)

    return modelEndpointsApi
      .getModelEndpoint(params.projectName, modelEndpointName, modelEndpointUid)
      .then(({ data: endpoint }) => {
        setSelectedModelEndpoint(parseModelEndpoints([endpoint])?.[0])
        setIsLoading(false)
      })
      .catch(error => {
        showErrorNotification(
          dispatch,
          error,
          '',
          'This model endpoint either does not exist or was deleted'
        )

        onResolve()
      })
  }, [dispatch, modelEndpointName, modelEndpointUid, onResolve, params.projectName])

  const actionsMenu = useMemo(
    () =>
      generateActionsMenu(
        modelMonitoringDashboardUrl,
        handleMonitoring,
        toggleConvertedYaml,
        selectedModelEndpoint,
        dispatch
      ),
    [
      dispatch,
      handleMonitoring,
      selectedModelEndpoint,
      toggleConvertedYaml,
      modelMonitoringDashboardUrl
    ]
  )

  const pageData = useMemo(
    () => generatePageData(selectedModelEndpoint, modelMonitoringDashboardUrl, handleMonitoring),
    [modelMonitoringDashboardUrl, handleMonitoring, selectedModelEndpoint]
  )

  useEffect(() => {
    if (isEmpty(selectedModelEndpoint)) {
      fetchModelEndpoint()
    }
  }, [fetchModelEndpoint, selectedModelEndpoint])

  return (
    <DetailsPopUp
      actionsMenu={actionsMenu}
      handleRefresh={fetchModelEndpoint}
      isLoading={isLoading}
      isOpen={isOpen}
      onResolve={onResolve}
      pageData={pageData}
      selectedItem={selectedModelEndpoint}
    />
  )
}

ModelEndpointPopUp.propTypes = {
  frontendSpec: PropTypes.object.isRequired,
  handleMonitoring: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modelEndpointUid: PropTypes.string.isRequired,
  modelEndpointName: PropTypes.string.isRequired,
  onResolve: PropTypes.func.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default ModelEndpointPopUp

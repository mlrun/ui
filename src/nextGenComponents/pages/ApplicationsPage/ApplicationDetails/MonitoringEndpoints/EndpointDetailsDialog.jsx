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
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { isEmpty } from 'lodash-es'
import PropTypes from 'prop-types'

import { Loader } from 'igz-controls/nextGenComponents'
import Details from '../../../../../components/Details/Details'

import {
  generatePageData,
  generateActionsMenu
} from '../../../../../components/ModelsPage/ModelEndpoints/modelEndpoints.util'
import modelEndpointsApi from '../../../../../api/modelEndpoints-api'
import { parseModelEndpoints } from '../../../../../utils/parseModelEndpoints'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { DETAILS_OVERVIEW_TAB } from '../../../../../constants'

const MODEL_ENDPOINT_NOT_FOUND_MESSAGE = 'This model endpoint either does not exist or was deleted'

const EndpointDetailsDialog = ({
  modelEndpointUid,
  modelEndpointName,
  frontendSpec,
  handleMonitoring,
  isOpen,
  onClose,
  toggleConvertedYaml
}) => {
  const dispatch = useDispatch()
  const { projectName } = useParams()
  const abortControllerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModelEndpoint, setSelectedModelEndpoint] = useState({})
  const [detailsPopUpSelectedTab, setDetailsPopUpSelectedTab] = useState(DETAILS_OVERVIEW_TAB)

  const modelMonitoringDashboardUrl = useMemo(
    () => frontendSpec?.model_monitoring_dashboard_url,
    [frontendSpec?.model_monitoring_dashboard_url]
  )

  const fetchModelEndpoint = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    return modelEndpointsApi
      .getModelEndpoint(projectName, modelEndpointName, modelEndpointUid, { signal })
      .then(({ data: endpoint }) => {
        if (signal.aborted) return
        setSelectedModelEndpoint(parseModelEndpoints([endpoint])?.[0])
        setIsLoading(false)
      })
      .catch(error => {
        if (signal.aborted || error?.name === 'AbortError' || error?.name === 'CanceledError')
          return
        setIsLoading(false)
        showErrorNotification(dispatch, error, '', MODEL_ENDPOINT_NOT_FOUND_MESSAGE)
        onClose()
      })
  }, [dispatch, modelEndpointName, modelEndpointUid, onClose, projectName])

  const refreshModelEndpoint = useCallback(() => {
    setIsLoading(true)
    return fetchModelEndpoint()
  }, [fetchModelEndpoint])

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

    return () => abortControllerRef.current?.abort()
  }, [fetchModelEndpoint, selectedModelEndpoint])

  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const portalTarget = document.getElementById('overlay_container')

  if (!isOpen || !portalTarget) return null

  return createPortal(
    <div className="fixed inset-0 z-[9]" data-testid="endpoint-details-dialog">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} role="presentation" />
      <div className="absolute inset-[2.5vh_2.5vw] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="function-popup h-full">
            <Details
              actionsMenu={actionsMenu}
              detailsMenu={pageData.details?.menu}
              detailsPopUpSelectedTab={detailsPopUpSelectedTab}
              formInitialValues={{}}
              handleCancel={onClose}
              handleRefresh={refreshModelEndpoint}
              isDetailsPopUp
              isDetailsScreen
              pageData={pageData}
              selectedItem={selectedModelEndpoint}
              setDetailsPopUpSelectedTab={setDetailsPopUpSelectedTab}
            />
          </div>
        )}
      </div>
    </div>,
    portalTarget
  )
}

EndpointDetailsDialog.propTypes = {
  frontendSpec: PropTypes.object.isRequired,
  handleMonitoring: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modelEndpointUid: PropTypes.string.isRequired,
  modelEndpointName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default EndpointDetailsDialog

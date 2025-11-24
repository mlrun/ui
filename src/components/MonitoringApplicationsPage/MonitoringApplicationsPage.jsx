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
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import ActionBar from '../ActionBar/ActionBar'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import MonitoringApplicationCounters from './MonitoringApplications/MonitoringApplicationCounters/MonitoringApplicationCounters'
import TableTop from '../../elements/TableTop/TableTop'

import {
  fetchMEPWithDetections,
  fetchMonitoringApplication,
  fetchMonitoringApplications,
  fetchMonitoringApplicationsSummary
} from '../../reducers/monitoringApplicationsReducer'
import { MODEL_ENDPOINTS_TAB, MONITORING_APP_PAGE } from '../../constants'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { fetchArtifacts } from '../../reducers/artifactsReducer'
import { getFiltersConfig } from './MonitoringApplicationsPage.util'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { getSavedSearchParams } from 'igz-controls/utils/filter.util'

import PresentMetricsIcon from 'igz-controls/images/present-metrics-icon.svg?react'

import './monitoringApplicationsPage.scss'

const MonitoringApplicationsPage = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const filtersConfig = useMemo(() => getFiltersConfig(), [])
  const filters = useFiltersFromSearchParams(filtersConfig)
  const [, setSearchParams] = useSearchParams()
  const contentRef = useRef(null)

  const refreshMonitoringApplications = useCallback(
    (filters, isFilterApplyAction) => {
      if (!isFilterApplyAction) {
        dispatch(fetchMonitoringApplicationsSummary({ project: params.projectName }))
          .unwrap()
          .catch(error => {
            showErrorNotification(dispatch, error, '', 'Failed to fetch applications summary')
          })
        dispatch(fetchMonitoringApplications({ project: params.projectName, filters }))
          .unwrap()
          .catch(error => {
            showErrorNotification(dispatch, error, '', 'Failed to fetch monitoring applications')
          })
        dispatch(
          fetchMEPWithDetections({
            project: params.projectName,
            filters: filters
          })
        )
          .unwrap()
          .catch(error => {
            showErrorNotification(
              dispatch,
              error,
              '',
              'Failed to fetch model endpoints with suspected/detected issue'
            )
          })
      }
    },
    [dispatch, params.projectName]
  )

  const refreshMonitoringApplication = useCallback(
    (filters, isFilterApplyAction) => {
      if (!isFilterApplyAction) {
        dispatch(
          fetchArtifacts({
            project: params.projectName,
            filters: {
              ...filters,
              labels: `mlrun/app-name=${params.name}`
            },
            config: { params: { page: 1, 'page-size': 50, format: 'minimal' } } // limit to 50 artifacts the same as we have on Artifacts page per 1 FE page to avoid overload
          })
        )
          .unwrap()
          .catch(error => {
            showErrorNotification(dispatch, error, '', 'Failed to fetch artifacts')
          })

        dispatch(
          fetchMonitoringApplication({
            project: params.projectName,
            functionName: params.name,
            filters
          })
        )
          .unwrap()
          .catch(error => {
            showErrorNotification(dispatch, error, '', 'Failed to fetch monitoring application')
            navigate(
              `/projects/${params.projectName}/${MONITORING_APP_PAGE}${window.location.search}`,
              { replace: true }
            )
          })
      }
    },
    [dispatch, navigate, params.name, params.projectName]
  )

  useEffect(() => {
    if (params.name) {
      refreshMonitoringApplication(filters)
    } else {
      refreshMonitoringApplications(filters)
    }
  }, [params.name, refreshMonitoringApplications, refreshMonitoringApplication, filters])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0)
    }
  }, [params.name])

  return (
    <div className="content-wrapper">
      <div className="content__header">
        <Breadcrumbs />
      </div>
      <div className="content monitoring-app-content" ref={contentRef}>
        <div className="content__action-bar-wrapper">
          <span className="monitoring-apps-title">
            {params.name && (
              <TableTop
                link={`/projects/${params.projectName}/${MONITORING_APP_PAGE}/${getSavedSearchParams(window.location.search)}`}
                text={params.name}
              />
            )}
          </span>
          <ActionBar
            actionButtons={[
              {
                variant: PRIMARY_BUTTON,
                label: 'Application metrics',
                className: 'action-button',
                hidden: !params.name,
                onClick: () => {
                  navigate(
                    `/projects/${params.projectName}/${MONITORING_APP_PAGE}/${params.name}/${MODEL_ENDPOINTS_TAB}${window.location.search}`
                  )
                },
                icon: <PresentMetricsIcon />
              }
            ]}
            filters={filters}
            filtersConfig={filtersConfig}
            handleRefresh={
              params.name ? refreshMonitoringApplication : refreshMonitoringApplications
            }
            setSearchParams={setSearchParams}
            withRefreshButton
            withoutExpandButton
          />
          <MonitoringApplicationCounters />
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MonitoringApplicationsPage

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
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import ApplicationTableRow from '../../../elements/ApplicationTableRow/ApplicationTableRow'
import MEPsWithDetections from './MEPsWithDetections'
import NoData from '../../../common/NoData/NoData'
import SectionTable from '../../../elements/SectionTable/SectionTable'
import Table from '../../Table/Table'
import { Loader, Tip } from 'igz-controls/components'

import { MODEL_ENDPOINTS_TAB, MONITORING_APP_PAGE } from '../../../constants'
import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../MonitoringApplicationsPage.util'
import { createApplicationContent } from '../../../utils/createApplicationContent'
import { generateOperatingFunctionsTable } from './monitoringApplications.util'
import { removeMonitoringApplications, removeMEPWithDetections } from '../../../reducers/monitoringApplicationsReducer'

import PresentMetricsIcon from 'igz-controls/images/present-metrics-icon.svg?react'

const MonitoringApplications = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const {
    monitoringApplications: { applications = [], operatingFunctions = [] },
    loading
  } = useSelector(store => store.monitoringApplicationsStore)

  const applicationsTableActionsMenu = useMemo(
    () => [
      [],
      [
        {
          id: 'open-metrics',
          label: 'Open metrics',
          icon: <PresentMetricsIcon />,
          onClick: data =>
            navigate(
              `/projects/${params.projectName}/${MONITORING_APP_PAGE}/${data.name}/${MODEL_ENDPOINTS_TAB}${window.location.search}`
            )
        }
      ]
    ],
    [navigate, params.projectName]
  )
  const operatingFunctionsTable = useMemo(
    () => generateOperatingFunctionsTable(operatingFunctions, params.projectName),
    [operatingFunctions, params.projectName]
  )
  const applicationsTableContent = useMemo(() => {
    return applications.map(contentItem =>
      createApplicationContent(contentItem, params.projectName)
    )
  }, [applications, params.projectName])

  const applicationsTableHeaders = useMemo(
    () => applicationsTableContent[0]?.content ?? [],
    [applicationsTableContent]
  )

  useEffect(() => {
    return () => {
      dispatch(removeMonitoringApplications())
      dispatch(removeMEPWithDetections())
    }
  }, [dispatch, params.projectName])

  return (
    <div className="monitoring-apps">
      <div className="monitoring-app__section section_small">
        <MEPsWithDetections />
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>System functions</span>
            <Tip text="System functions that are used for the monitoring application operation" />
          </div>
          {operatingFunctions.length === 0 && !loading ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : (
            <SectionTable loading={loading} params={params} table={operatingFunctionsTable} />
          )}
        </div>
      </div>
      <div className="monitoring-app__section section_big">
        <div className="monitoring-app__section-item">
          <div className="section-item_title">
            <span>All Applications</span>
          </div>
          {applications.length === 0 && !loading ? (
            <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
          ) : loading ? (
            <Loader section secondary />
          ) : (
            <Table
              actionsMenu={applicationsTableActionsMenu}
              pageData={{}}
              tableClassName="applications-table"
              tableHeaders={applicationsTableHeaders}
              skipTableWrapper
            >
              {applicationsTableContent.map((tableItem, index) => (
                <ApplicationTableRow
                  actionsMenu={applicationsTableActionsMenu}
                  key={index}
                  rowIndex={index}
                  rowItem={tableItem}
                />
              ))}
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}

export default MonitoringApplications

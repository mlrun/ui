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
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ActionBar from '../ActionBar/ActionBar'
import { Tip } from 'igz-controls/components'
import SectionTable from '../../elements/SectionTable/SectionTable'

import { generateOperatingFunctionsTable, getFiltersConfig } from './monitoringApplication.util'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'
import { MONITORING_APP_PAGE } from '../../constants'
import MonitoringApplicationCounters from './MonitoringApplicationCounters/MonitoringApplicationCounters'
import PresentMetricsIcon from 'igz-controls/images/present-metrics-icon.svg?react'

import './monitoringApplication.scss'
import Table from '../Table/Table'
import ApplicationTableRow from '../../elements/ApplicationTableRow/ApplicationTableRow'
import { createApplicationContent } from '../../utils/createApplicationContent'

const MonitoringApplication = () => {
  const params = useParams()
  const filtersConfig = useMemo(() => getFiltersConfig(), [])
  const filters = useFiltersFromSearchParams(filtersConfig)
  const applicationsTableActionsMenu = useMemo(
    () => [
      [],
      [
        {
          id: 'open-metrics',
          label: 'Open metrics',
          icon: <PresentMetricsIcon />,
          onClick: () => console.log('click')
        }
      ]
    ],
    []
  )
  const operatingFunctionsMock = [
    {
      name: 'operatingFunction1',
      labels: { aa: 'bb', cc: 'dd' },
      state: 'ready',
      startedAt: 'Oct 26, 2013 13:20',
      duration: '02:29:33'
    },
    {
      name: 'operatingFunction2',
      labels: { aa: 'bb', cc: 'dd' },
      state: 'failed',
      startedAt: 'Oct 26, 2013 13:20',
      duration: '02:29:33'
    },
    {
      name: 'operatingFunction3',
      labels: { aa: 'bb', cc: 'dd' },
      state: 'ready',
      startedAt: 'Oct 26, 2013 13:20',
      duration: '02:29:33'
    }
  ]

  const applicationsMock = [
    {
      name: 'Application1',
      invocations: 12,
      alerts: 12,
      detections: 6,
      possibleDetections: 2,
      class: 'ModelMonitoringClass1',
      startedAt: 'Jan 1, 2019 10:18',
      updated: 'Jan 8  2019 10:18',
      duration: '02:43:34',
      nuclioFunction: 'traing-training',
      state: 'ready'
    },
    {
      name: 'Application2',
      invocations: 11,
      alerts: 10,
      detections: 3,
      possibleDetections: 5,
      class: 'ModelMonitoringClass2',
      startedAt: 'Oct 14, 2019 9:06',
      updated: 'Oct 14, 2019 9:06',
      duration: '02:43:34',
      nuclioFunction: 'traing-training',
      state: 'failed'
    },
    {
      name: 'Application3',
      invocations: 10,
      alerts: 4,
      detections: 5,
      possibleDetections: 2,
      class: 'ModelMonitoringClass3',
      startedAt: 'Oct 14, 2019 9:06',
      updated: 'Oct 14, 2019 9:06',
      duration: '02:43:34',
      nuclioFunction: 'traing-train',
      state: 'running'
    },
    {
      name: 'Application4',
      invocations: 10,
      alerts: 4,
      detections: 5,
      possibleDetections: 2,
      class: 'ModelMonitoringClass4',
      startedAt: 'Oct 14, 2019 9:06',
      updated: 'Oct 14, 2019 9:06',
      duration: '02:43:34',
      nuclioFunction: 'traing-train',
      state: 'failed'
    }
  ]

  const applicationsTableContent = useMemo(() => {
    return applicationsMock.map(contentItem => createApplicationContent(contentItem))
  }, [applicationsMock])

  const applicationsTableHeaders = useMemo(() =>  applicationsTableContent[0]?.content ?? [], [])

  return (
    <div className="content-wrapper">
      <div className="content__header">
        <Breadcrumbs />
      </div>
      <div className="content">
        <div className="content__action-bar-wrapper">
          <span className="monitoring-app-title">Monitoring app</span>
          <ActionBar
            closeParamName={MONITORING_APP_PAGE}
            filters={filters}
            filtersConfig={filtersConfig}
            handleRefresh={() => {}}
            setSearchParams={() => {}}
            withRefreshButton
            withoutExpandButton
          />
        </div>
        <MonitoringApplicationCounters />
        <div className="monitoring-app_section section_small">
          <div className="monitoring-app_section-item">
            <div className="section-item_title">
              <span>Controller calls</span>
              <Tip text="Controller  calls tip" />
            </div>
          </div>
          <div className="monitoring-app_section-item">
            <div className="section-item_title">
              <span>Operating functions</span>
              <Tip text="Operating functions tip" />
            </div>
            <SectionTable
              params={params}
              table={generateOperatingFunctionsTable(operatingFunctionsMock)}
            />
          </div>
        </div>
        <div className="monitoring-app_section">
          <div className="monitoring-app_section-item">
            <div className="section-item_title">
              <span>All Applications</span>
            </div>
            <Table
              actionsMenu={applicationsTableActionsMenu}
              pageData={{}}
              tableClassName="applications-table"
              tableHeaders={applicationsTableHeaders}
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
            {/*<SectionTable*/}
            {/*  params={params}*/}
            {/*  table={generateApplicationsTableData(applicationsMock)}*/}
            {/*  actionsMenu={applicationsTableActionsMenu}*/}
            {/*/>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitoringApplication

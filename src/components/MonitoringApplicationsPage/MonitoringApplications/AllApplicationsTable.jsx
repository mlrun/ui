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
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import ApplicationTableRow from '../../../elements/ApplicationTableRow/ApplicationTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import { Loader } from 'igz-controls/components'

import { MODEL_ENDPOINTS_TAB, MONITORING_APP_PAGE } from '../../../constants'
import { createApplicationContent } from '../../../utils/createApplicationContent'
import { saveAndTransformSearchParams } from 'igz-controls/utils/filter.util'
import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../MonitoringApplicationsPage.util'
import { getScssVariableValue } from 'igz-controls/utils/common.util'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'

import PresentMetricsIcon from 'igz-controls/images/present-metrics-icon.svg?react'

import '../monitoringApplicationsPage.scss'

const AllApplicationsTable = ({ applications, loading, error = null }) => {
  const params = useParams()
  const navigate = useNavigate()

  const applicationsRowHeight = useMemo(() => getScssVariableValue('--applicationRowHeight'), [])
  const applicationRowHeightExtended = useMemo(
    () => getScssVariableValue('--applicationRowHeightExtended'),
    []
  )
  const applicationsHeaderRowHeight = useMemo(
    () => getScssVariableValue('--applicationHeaderRowHeight'),
    []
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
              `/projects/${params.projectName}/${MONITORING_APP_PAGE}/${data.name}/${MODEL_ENDPOINTS_TAB}${saveAndTransformSearchParams(
                window.location.search,
                true
              )}`
            )
        }
      ]
    ],
    [navigate, params.projectName]
  )

  const virtualizationConfig = useVirtualization({
    rowsData: {
      content: applicationsTableContent
    },
    heightData: {
      headerRowHeight: applicationsHeaderRowHeight,
      rowHeight: applicationsRowHeight,
      rowHeightExtended: applicationRowHeightExtended
    }
  })

  return (
    <div className="monitoring-app__section-item all-applications-table">
      <div className="section-item_title">
        <span>All applications</span>
      </div>
      {applications.length === 0 && !loading ? (
        <NoData
          message={
            error
              ? 'Failed to fetch monitoring applications'
              : MONITORING_APPLICATIONS_NO_DATA_MESSAGE
          }
        />
      ) : loading ? (
        <Loader section secondary />
      ) : (
        <Table
          actionsMenu={applicationsTableActionsMenu}
          pageData={{}}
          tableClassName="applications-table"
          tableHeaders={applicationsTableHeaders}
          skipTableWrapper
          virtualizationConfig={virtualizationConfig}
        >
          {applicationsTableContent.map(
            (tableItem, index) =>
              isRowRendered(virtualizationConfig, index) && (
                <ApplicationTableRow
                  actionsMenu={applicationsTableActionsMenu}
                  key={index}
                  rowIndex={index}
                  rowItem={tableItem}
                />
              )
          )}
        </Table>
      )}
    </div>
  )
}

AllApplicationsTable.propTypes = {
  applications: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object
}

export default AllApplicationsTable

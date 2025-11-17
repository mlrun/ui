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

import '../MonitoringApplicationsPage.scss'

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
          {applicationsTableContent.map((tableItem, index) => (
            isRowRendered(virtualizationConfig, index) && (<ApplicationTableRow
              actionsMenu={applicationsTableActionsMenu}
              key={index}
              rowIndex={index}
              rowItem={tableItem}
            />)
          ))}
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

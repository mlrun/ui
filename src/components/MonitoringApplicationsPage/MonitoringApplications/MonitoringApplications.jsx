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
import { useParams } from 'react-router-dom'

import MEPsWithDetections from './MEPsWithDetections'
import NoData from '../../../common/NoData/NoData'
import SectionTable from '../../../elements/SectionTable/SectionTable'
import { Tip } from 'igz-controls/components'
import AllApplicationsTable from './AllApplicationsTable'

import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../MonitoringApplicationsPage.util'
import { generateOperatingFunctionsTable } from './monitoringApplications.util'
import {
  removeMonitoringApplications,
  removeMEPWithDetections
} from '../../../reducers/monitoringApplicationsReducer'

const MonitoringApplications = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const {
    monitoringApplications: { applications = [], operatingFunctions = [] },
    loading,
    error
  } = useSelector(store => store.monitoringApplicationsStore)

  const operatingFunctionsTable = useMemo(
    () => generateOperatingFunctionsTable(operatingFunctions, params.projectName),
    [operatingFunctions, params.projectName]
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
            <NoData
              message={
                error
                  ? 'Failed to fetch monitoring applications'
                  : MONITORING_APPLICATIONS_NO_DATA_MESSAGE
              }
            />
          ) : (
            <SectionTable
              loading={loading}
              params={params}
              table={operatingFunctionsTable}
              maxTableHeight={246}
            />
          )}
        </div>
      </div>
      <div className="monitoring-app__section section_big">
        <AllApplicationsTable applications={applications} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default MonitoringApplications

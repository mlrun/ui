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
import React, { useCallback, useMemo, useState } from 'react'

import { useSelector } from 'react-redux'

import ProjectAlertsView from './ProjectsAlertsView'

// import { getAlertsFiltersConfig } from './alerts.util'

import alertsData from './alertsData.json'
import {
  DATES_FILTER,
  ENTITY_TYPE,
  EVENT_TYPE,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  STATUS_FILTER
} from '../../constants'

const ProjectsAlerts = () => {
  const [alerts] = useState(alertsData)
  const [requestErrorMessage] = useState('')

  const alertsStore = useSelector(state => state.alertsStore)
  const filtersStore = useSelector(store => store.filtersStore)

  // const alertsFiltersConfig = useMemo(() => getAlertsFiltersConfig(), [])

  const alertsFiltersConfig = useMemo(() => {
    return {
      [NAME_FILTER]: { label: 'Name:' },
      [DATES_FILTER]: { label: 'Start time:' },
      [PROJECT_FILTER]: { label: 'Project:' },
      [STATUS_FILTER]: { label: 'Status:' },
      [ENTITY_TYPE]: { label: 'Entity Type:' },
      [EVENT_TYPE]: { label: 'Event Type' },
      [LABELS_FILTER]: { label: 'Labels:' }
    }
  }, [])
  const refreshAlertsCallback = useCallback(filters => {
    console.log(filters)
  }, [])

  // console.log(filtersStore.filterMenuModal.alerts)
  return (
    <ProjectAlertsView
      alerts={alerts}
      alertsFiltersConfig={alertsFiltersConfig}
      alertsStore={alertsStore}
      refreshAlertsCallback={refreshAlertsCallback}
      filtersStore={filtersStore}
      requestErrorMessage={requestErrorMessage}
    />
  )
}

ProjectsAlerts.propTypes = {}

export default ProjectsAlerts

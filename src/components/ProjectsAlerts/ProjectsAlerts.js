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

import ProjectAlertsView from './ProjectsAlertsView'

import { getAlertsFiltersConfig, parseAlertsQueryParamsCallback } from './alerts.util'
import { useFiltersFromSearchParams } from '../../hooks/useFiltersFromSearchParams.hook'

import alertsData from './alertsData.json'

const ProjectsAlerts = () => {
  const [alerts] = useState(alertsData)
  const [selectedAlert] = useState({})

  const alertsFiltersConfig = useMemo(() => getAlertsFiltersConfig(), [])

  const alertsFilters = useFiltersFromSearchParams(
    alertsFiltersConfig,
    parseAlertsQueryParamsCallback
  )

  const refreshAlertsCallback = useCallback(() => {}, [])

  return (
    <ProjectAlertsView
      alerts={alerts}
      alertsFiltersConfig={alertsFiltersConfig}
      actionsMenu={() => []} // TODO
      filters={alertsFilters}
      pageData={{}} //TODO
      refreshAlertsCallback={refreshAlertsCallback}
      selectedAlert={selectedAlert}
    />
  )
}

export default ProjectsAlerts

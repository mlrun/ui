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

import { useSelector } from 'react-redux'

import ProjectAlertsView from './ProjectsAlertsView'

import { getAlertsFiltersConfig } from './alerts.util'

import alertsData from './alertsData.json'

const ProjectsAlerts = () => {
  const [alerts] = useState(alertsData)
  // const [selectedAlert, setSelectedAlert] = useState({})
  const [selectedAlert] = useState({})
  // const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [requestErrorMessage] = useState('')
  const alertsStore = useSelector(state => state.alertsStore)
  const filtersStore = useSelector(store => store.filtersStore)

  const alertsFiltersConfig = useMemo(() => getAlertsFiltersConfig(), [])

  const refreshAlertsCallback = useCallback(filters => {
    console.log(filters)
  }, [])

  return (
    <ProjectAlertsView
      actionsMenu={() => []} // TODO
      alerts={alerts}
      alertsFiltersConfig={alertsFiltersConfig}
      alertsStore={alertsStore}
      refreshAlertsCallback={refreshAlertsCallback}
      filtersStore={filtersStore}
      pageData={{}} //TODO
      requestErrorMessage={requestErrorMessage}
      selectedAlert={selectedAlert}
    />
  )
}

ProjectsAlerts.propTypes = {}

export default ProjectsAlerts

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
import JobsCounters from '../../../elements/ProjectsMonitoringCounters/JobsCounters'
import ScheduledJobsCounters from '../../../elements/ProjectsMonitoringCounters/ScheduledJobsCounters'
import WorkflowsCounters from '../../../elements/ProjectsMonitoringCounters/WorkflowsCounters'

import './projectsMonitoring.scss'

const ProjectsMonitoring = () => {
  return (
    <div className="projects-monitoring-container">
      <div className="projects-monitoring-legend">
        <h5 className="projects-monitoring-legend__title">Monitoring</h5>
        <ul className="projects-monitoring-legend__status">
          <li>
            Running <i className="state-running"></i>
          </li>
          <li>
            Failed <i className="state-failed"></i>
          </li>
          <li>
            Completed <i className="state-completed"></i>
          </li>
        </ul>
      </div>
      <div className="projects-monitoring-stats">
        <JobsCounters />
        {/* Todo: Delete WorkflowsCounters after ML-5460 is impplemented */}
        <WorkflowsCounters />

        <ScheduledJobsCounters />
        {/* Todo: implement as part of ML-5460
        <ModelEndpointsCounters /> */}
      </div>
    </div>
  )
}

export default ProjectsMonitoring

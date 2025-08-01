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
import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getDateAndTimeByFormat } from 'igz-controls/utils/datetime.util'

import './ProjectDetailsHeader.scss'

const ProjectDetailsHeader = ({ projectData, projectName }) => {
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  return (
    <div>
      <div className="project-details__header">{projectName}</div>
      {projectData && (
        <div>
          <span className="project-details__details-label">
            Created:
            {getDateAndTimeByFormat(projectData.metadata.created, ' MM/DD/YYYY, HH:mm:ss A')}
          </span>
          {projectData.spec.owner && !frontendSpec.ce?.version && (
            <span className="project-details__details-label">Owner: {projectData.spec.owner}</span>
          )}
        </div>
      )}
    </div>
  )
}

ProjectDetailsHeader.propTypes = {
  projectData: PropTypes.object,
  projectName: PropTypes.string.isRequired
}

export default ProjectDetailsHeader

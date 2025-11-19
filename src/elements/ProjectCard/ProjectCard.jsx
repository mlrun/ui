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
import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import ProjectCardView from './ProjectCardView'

import { generateProjectStatistic } from './projectCard.util'

const ProjectCard = ({ actionsMenu, alert, project, projectSummary }) => {
  const projectStore = useSelector(store => store.projectStore)
  const nuclioStore = useSelector(store => store.nuclioStore)
  const actionsMenuRef = useRef()
  const fetchNuclioFunctionsFailure =
    nuclioStore.error && !nuclioStore.functions[project.metadata.name]

  const statistics = useMemo(() => {
    return generateProjectStatistic(
      projectSummary,
      projectStore.projectsSummary.error,
      projectStore.projectsSummary.loading,
      fetchNuclioFunctionsFailure,
      nuclioStore.functions[project.metadata.name],
      nuclioStore.loading
    )
  }, [
    fetchNuclioFunctionsFailure,
    nuclioStore.functions,
    nuclioStore.loading,
    project.metadata.name,
    projectStore.projectsSummary.error,
    projectStore.projectsSummary.loading,
    projectSummary
  ])

  return (
    <ProjectCardView
      actionsMenu={actionsMenu}
      alert={alert}
      project={project}
      statistics={statistics}
      ref={actionsMenuRef}
    />
  )
}

ProjectCard.propTypes = {
  actionsMenu: PropTypes.object.isRequired,
  alert: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  projectSummary: PropTypes.object
}

export default ProjectCard

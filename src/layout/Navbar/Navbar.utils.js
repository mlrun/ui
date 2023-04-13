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

import { PROJECT_MONITOR } from '../../constants'
import { generateNuclioLink } from '../../utils'

import { ReactComponent as APIIcon } from 'igz-controls/images/navbar/mlrun-api-gateways.svg'
import { ReactComponent as HomepageIcon } from 'igz-controls/images/navbar/mlrun-project-home.svg'
import { ReactComponent as DatasetsIcon } from 'igz-controls/images/navbar/mlrun-datasets.svg'
import { ReactComponent as MonitoringIcon } from 'igz-controls/images/navbar/mlrun-project-monitoring.svg'
import { ReactComponent as ArtifactsIcon } from 'igz-controls/images/navbar/mlrun-artifacts.svg'
import { ReactComponent as FunctionIcon } from 'igz-controls/images/navbar/mlrun-ml-functions.svg'
import { ReactComponent as JobsWorkflowIcon } from 'igz-controls/images/navbar/mlrun-jobs-and-workflows.svg'
import { ReactComponent as ModelsIcon } from 'igz-controls/images/navbar/mlrun-models.svg'
import { ReactComponent as NuclioIcon } from 'igz-controls/images/navbar/mlrun-realtime-functions.svg'
import { ReactComponent as FeatureStoreIcon } from 'igz-controls/images/navbar/mlrun-feature-store.svg'

// import { ReactComponent as RTPiplinesIcon } from 'igz-controls/images/timer-outline-icon.svg'

export const getLinks = projectName => {
  const pathname = `/projects/${projectName}`

  return [
    {
      icon: <HomepageIcon />,
      id: 'home',
      label: 'Project home',
      link: `${pathname}`,
      end: true
    },
    {
      icon: <MonitoringIcon />,
      id: PROJECT_MONITOR,
      label: 'Project monitoring',
      link: `${pathname}/${PROJECT_MONITOR}`
    },
    {
      icon: <FeatureStoreIcon />,
      id: 'feature-store',
      label: 'Feature store',
      link: `${pathname}/feature-store`
    },
    {
      icon: <DatasetsIcon />,
      id: 'datasets',
      label: 'Datasets',
      link: `${pathname}/datasets`
    },
    {
      icon: <ArtifactsIcon />,
      id: 'files',
      label: 'Artifacts',
      link: `${pathname}/files`
    },
    {
      icon: <ModelsIcon />,
      id: 'models',
      label: 'Models',
      link: `${pathname}/models`
    },
    {
      icon: <JobsWorkflowIcon />,
      id: 'jobs',
      label: 'Jobs and workflows',
      link: `${pathname}/jobs`
    },
    //  {
    //    icon: <RTPiplinesIcon />,
    //    label: 'Realtime pipelines',
    //    link: `${pathname}/models` //TODO: fix path
    //  },
    {
      icon: <FunctionIcon />,
      id: 'ml-functions',
      label: 'ML functions',
      link: `${pathname}/functions`
    },
    {
      icon: <NuclioIcon />,
      id: 'real-time-functions',
      label: 'Real-time functions',
      link: generateNuclioLink(`${pathname}/functions`),
      externalLink: true
    },
    {
      icon: <APIIcon />,
      id: 'api-gateways',
      label: 'API gateways',
      link: generateNuclioLink(`${pathname}/api-gateways`),
      externalLink: true
    }
  ]
}

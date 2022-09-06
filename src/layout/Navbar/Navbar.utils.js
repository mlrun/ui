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

import { ReactComponent as APIIcon } from 'igz-controls/images/api-getaway-icon.svg'
import { ReactComponent as DashboardIcon } from 'igz-controls/images/dashboard-icon.svg'
import { ReactComponent as DatasetsIcon } from 'igz-controls/images/datasets-icon.svg'
import { ReactComponent as EyeIcon } from 'igz-controls/images/eye.svg'
import { ReactComponent as FileIcon } from 'igz-controls/images/file-icon.svg'
import { ReactComponent as FunctionIcon } from 'igz-controls/images/function-icon.svg'
import { ReactComponent as JobsWorkflowIcon } from 'igz-controls/images/sitemap-icon.svg'
import { ReactComponent as ModelsIcon } from 'igz-controls/images/models-icon.svg'
import { ReactComponent as NuclioIcon } from 'igz-controls/images/realtime-icon.svg'
import { ReactComponent as PackageIcon } from 'igz-controls/images/package.svg'
// import { ReactComponent as RTPiplinesIcon } from 'igz-controls/images/timer-outline-icon.svg'

export const getLinks = (projectName, isDemoMode) => {
  const pathname = `/projects/${projectName}`

  return [
    {
      icon: <DashboardIcon />,
      id: 'home',
      label: 'Project home',
      link: `${pathname}/`,
      hidden: !isDemoMode
    },
    {
      icon: <EyeIcon />,
      id: PROJECT_MONITOR,
      label: 'Project monitoring',
      link: `${pathname}/${PROJECT_MONITOR}`
    },
    {
      icon: <PackageIcon />,
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
      icon: <FileIcon />,
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
      id: 'functions',
      label: 'ML functions',
      link: `${pathname}/functions`
    },
    {
      icon: <NuclioIcon />,
      id: 'Real-time functions',
      label: 'Real-time functions',
      link: generateNuclioLink(`${pathname}/functions`),
      externalLink: true
    },
    {
      icon: <APIIcon />,
      id: 'API gateways',
      label: 'API gateways',
      link: generateNuclioLink(`${pathname}/api-gateways`),
      externalLink: true
    }
  ]
}

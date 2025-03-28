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

import { DOCUMENTS_TAB, PROJECT_MONITOR, PROJECT_QUICK_ACTIONS_PAGE } from '../../constants'
import { generateNuclioLink } from '../../utils'

import { ReactComponent as HomepageIcon } from 'igz-controls/images/navbar/mlrun-project-home.svg'
import { ReactComponent as DatasetsIcon } from 'igz-controls/images/navbar/mlrun-datasets.svg'
import { ReactComponent as MonitoringIcon } from 'igz-controls/images/navbar/mlrun-project-monitoring.svg'
import { ReactComponent as ArtifactsIcon } from 'igz-controls/images/navbar/mlrun-artifacts.svg'
import { ReactComponent as FunctionIcon } from 'igz-controls/images/navbar/mlrun-ml-functions.svg'
import { ReactComponent as JobsWorkflowIcon } from 'igz-controls/images/navbar/mlrun-jobs-and-workflows.svg'
import { ReactComponent as ModelsIcon } from 'igz-controls/images/navbar/mlrun-models.svg'
import { ReactComponent as NuclioIcon } from 'igz-controls/images/navbar/mlrun-realtime-functions.svg'
import { ReactComponent as FeatureStoreIcon } from 'igz-controls/images/navbar/mlrun-feature-store.svg'
import { ReactComponent as Documents } from 'igz-controls/images/navbar/documents-icon.svg'

export const getLinks = projectName => {
  const pathname = `/projects/${projectName}`

  return [
    {
      icon: <MonitoringIcon />,
      id: PROJECT_MONITOR,
      label: 'Project monitoring',
      link: `${pathname}/${PROJECT_MONITOR}`
    },
    {
      icon: <HomepageIcon />,
      id: PROJECT_QUICK_ACTIONS_PAGE,
      label: 'Quick actions',
      link: `${pathname}/${PROJECT_QUICK_ACTIONS_PAGE}`
    },
    {
      icon: <FeatureStoreIcon />,
      id: 'feature-store',
      label: 'Feature store',
      link: `${pathname}/feature-store/`,
      nestedLinks: [
        {
          id: 'feature-sets',
          label: 'Feature sets',
          link: `${pathname}/feature-store/feature-sets`
        },
        {
          id: 'features',
          label: 'Features',
          link: `${pathname}/feature-store/features`
        },
        {
          id: 'feature-vectors',
          label: 'Feature vectors',
          link: `${pathname}/feature-store/feature-vectors`
        }
      ]
    },
    {
      icon: <DatasetsIcon />,
      id: 'datasets',
      label: 'Datasets',
      link: `${pathname}/datasets`
    },
    {
      icon: <Documents />,
      id: DOCUMENTS_TAB,
      label: 'Documents',
      link: `${pathname}/${DOCUMENTS_TAB}`
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
      link: `${pathname}/models/`,
      nestedLinks: [
        {
          id: 'models-artifacts',
          label: 'Model artifacts',
          link: `${pathname}/models/models`
        },
        {
          id: 'models-endpoints',
          label: 'Model endpoints',
          link: `${pathname}/models/model-endpoints`
        },
        {
          id: 'real-time-pipelines',
          label: 'Real-time pipelines',
          link: `${pathname}/models/real-time-pipelines`
        }
      ]
    },
    {
      icon: <JobsWorkflowIcon />,
      id: 'jobs',
      label: 'Batch',
      link: `${pathname}/jobs/`,
      nestedLinks: [
        {
          id: 'monitor-jobs',
          label: 'Monitor Jobs',
          link: `${pathname}/jobs/monitor-jobs`
        },
        {
          id: 'monitor-workflows',
          label: 'Monitor Workflows',
          link: `${pathname}/jobs/monitor-workflows`
        },
        {
          id: 'schedule',
          label: 'Schedule',
          link: `${pathname}/jobs/schedule`
        }
      ]
    },
    {
      icon: <FunctionIcon />,
      id: 'ml-functions',
      label: 'ML functions',
      link: `${pathname}/functions`
    },
    {
      icon: <NuclioIcon />,
      id: 'nuclio',
      label: 'Nuclio',
      link: `${pathname}/functions/`,
      nestedLinks: [
        {
          id: 'real-time-functions',
          label: 'Real-time functions',
          link: generateNuclioLink(`${pathname}/functions`),
          externalLink: true
        },
        {
          id: 'api-gateways',
          label: 'API gateways',
          link: generateNuclioLink(`${pathname}/api-gateways`),
          externalLink: true
        }
      ]
    }
  ]
}

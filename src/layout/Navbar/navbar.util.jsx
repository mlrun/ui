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

import {
  DOCUMENTS_PAGE,
  LLM_PROMPTS_PAGE,
  PROJECT_MONITOR,
  PROJECT_QUICK_ACTIONS_PAGE
} from '../../constants'
import { generateNuclioLink } from '../../utils'

import APIIcon from 'igz-controls/images/navbar/mlrun-api-gateways.svg?react'
import HomepageIcon from 'igz-controls/images/navbar/mlrun-project-home.svg?react'
import DatasetsIcon from 'igz-controls/images/navbar/mlrun-datasets.svg?react'
import MonitoringIcon from 'igz-controls/images/navbar/mlrun-project-monitoring.svg?react'
import ArtifactsIcon from 'igz-controls/images/navbar/mlrun-artifacts.svg?react'
import FunctionIcon from 'igz-controls/images/navbar/mlrun-ml-functions.svg?react'
import JobsWorkflowIcon from 'igz-controls/images/navbar/mlrun-jobs-and-workflows.svg?react'
import ModelsIcon from 'igz-controls/images/navbar/mlrun-models.svg?react'
import NuclioIcon from 'igz-controls/images/navbar/mlrun-realtime-functions.svg?react'
import FeatureStoreIcon from 'igz-controls/images/navbar/mlrun-feature-store.svg?react'
import Documents from 'igz-controls/images/navbar/documents-icon.svg?react'
import LLMPrompts from 'igz-controls/images/navbar/llm-prompt-icon.svg?react'
import ModelMonitoringIcon from 'igz-controls/images/navbar/model-monitoring.svg?react'

// import RTPiplinesIcon from 'igz-controls/images/timer-outline-icon.svg?react'

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
      link: `${pathname}/${PROJECT_QUICK_ACTIONS_PAGE}`,
      hidden: true
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
      icon: <Documents />,
      id: DOCUMENTS_PAGE,
      label: 'Documents',
      link: `${pathname}/${DOCUMENTS_PAGE}`
    },
    {
      icon: <LLMPrompts />,
      id: LLM_PROMPTS_PAGE,
      label: 'LLM prompts',
      link: `${pathname}/${LLM_PROMPTS_PAGE}`
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
      icon: <ModelMonitoringIcon />,
      id: 'monitoring-app',
      label: 'Monitoring app',
      link: `${pathname}/monitoring-app`
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

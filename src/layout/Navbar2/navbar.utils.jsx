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
  DOCUMENTS_PAGE, FEATURE_STORE_PAGE_PATH, FILES_PAGE, JOBS_PAGE_PATH,
  LLM_PROMPTS_PAGE, MODELS_PAGE, PROJECT_MONITOR, PROJECT_QUICK_ACTIONS_PAGE
} from '../../constants'
import { generateNuclioLink } from '../../utils'

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

export const getLinks = (projectName, isDemoMode) => {
  const pathname = `/projects/${projectName}`

  return [
    {
      icon: <MonitoringIcon />,
      id: PROJECT_MONITOR,
      label: 'Project monitoring',
      link: `${pathname}/${PROJECT_MONITOR}`
    },
    // Remove this link and related page when the new navbar is approved is ready
    {
      icon: <HomepageIcon />,
      id: PROJECT_QUICK_ACTIONS_PAGE,
      label: 'Quick actions',
      link: `${pathname}/${PROJECT_QUICK_ACTIONS_PAGE}`,
      hidden: !isDemoMode
    },
    {
      icon: <FeatureStoreIcon />,
      id: FEATURE_STORE_PAGE_PATH,
      label: 'Feature store',
      link: `${pathname}/${FEATURE_STORE_PAGE_PATH}/`,
      nestedLinks: [
        {
          id: 'feature-sets',
          label: 'Feature sets',
          link: `${pathname}/${FEATURE_STORE_PAGE_PATH}/feature-sets`
        },
        {
          id: 'features',
          label: 'Features',
          link: `${pathname}/${FEATURE_STORE_PAGE_PATH}/features`
        },
        {
          id: 'feature-vectors',
          label: 'Feature vectors',
          link: `${pathname}/${FEATURE_STORE_PAGE_PATH}/feature-vectors`
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
      id: DOCUMENTS_PAGE,
      label: 'Documents',
      link: `${pathname}/${DOCUMENTS_PAGE}`
    },
    {
      icon: <LLMPrompts />,
      id: LLM_PROMPTS_PAGE,
      label: 'LLM prompts',
      link: `${pathname}/${LLM_PROMPTS_PAGE}`,
      hidden: !isDemoMode
    },
    {
      icon: <ArtifactsIcon />,
      id: FILES_PAGE,
      label: 'Artifacts',
      link: `${pathname}/${FILES_PAGE}`
    },
    {
      icon: <ModelsIcon />,
      id: MODELS_PAGE,
      label: 'Models',
      link: `${pathname}/${MODELS_PAGE}/`,
      nestedLinks: [
        {
          id: 'models-artifacts',
          label: 'Model artifacts',
          link: `${pathname}/${MODELS_PAGE}/models`
        },
        {
          id: 'models-endpoints',
          label: 'Model endpoints',
          link: `${pathname}/${MODELS_PAGE}/model-endpoints`
        },
        {
          id: 'real-time-pipelines',
          label: 'Real-time pipelines',
          link: `${pathname}/${MODELS_PAGE}/real-time-pipelines`
        },
        {
          id: 'monitoring-app',
          label: 'Monitoring app',
          link: `${pathname}/monitoring-app`,
          hidden: !isDemoMode
        }
      ]
    },
    {
      icon: <JobsWorkflowIcon />,
      id: JOBS_PAGE_PATH,
      label: 'Batch',
      link: `${pathname}/${JOBS_PAGE_PATH}/`,
      nestedLinks: [
        {
          id: 'monitor-jobs',
          label: 'Monitor Jobs',
          link: `${pathname}/${JOBS_PAGE_PATH}/monitor-jobs`
        },
        {
          id: 'monitor-workflows',
          label: 'Monitor Workflows',
          link: `${pathname}/${JOBS_PAGE_PATH}/monitor-workflows`
        },
        {
          id: 'schedule',
          label: 'Schedule',
          link: `${pathname}/${JOBS_PAGE_PATH}/schedule`
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

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
  ARTIFACTS_PAGE, API_GATEWAYS_PAGE, DATASETS_PAGE, DOCUMENTS_PAGE, FEATURE_STORE_PAGE_PATH, FILES_PAGE, FUNCTIONS_PAGE_PATH, JOBS_PAGE_PATH,
  LLM_PROMPTS_PAGE, MODELS_PAGE, MODEL_ENDPOINTS_TAB, MONITORING_APP_PAGE, MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB, NUCLIO_PAGE, PROJECTS_PAGE_PATH, PROJECT_MONITOR, PROJECT_QUICK_ACTIONS_PAGE, REAL_TIME_PIPELINES_TAB, REAL_TIME_FUNCTIONS_PAGE, SCHEDULE_TAB
} from '../../constants'
import { generateNuclioLink } from '../../utils'

import HomepageIcon from 'igz-controls/images/navbar/mlrun-project-home.svg?react'
import DatasetsIcon from 'igz-controls/images/navbar/mlrun-datasets.svg?react'
import MonitoringIcon from 'igz-controls/images/navbar/mlrun-project-monitoring.svg?react'
import FunctionIcon from 'igz-controls/images/navbar/mlrun-ml-functions.svg?react'
import JobsWorkflowIcon from 'igz-controls/images/navbar/mlrun-jobs-and-workflows.svg?react'
import ModelsIcon from 'igz-controls/images/navbar/mlrun-models.svg?react'
import NuclioIcon from 'igz-controls/images/navbar/mlrun-realtime-functions.svg?react'

export const getNavbarLinks = (projectName, isDemoMode) => {
  const pathname = `/${PROJECTS_PAGE_PATH}/${projectName}`

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
      icon: <DatasetsIcon />,
      id: ARTIFACTS_PAGE,
      label: 'Data and artifacts',
      screens: [DATASETS_PAGE, DOCUMENTS_PAGE, LLM_PROMPTS_PAGE, FILES_PAGE, FEATURE_STORE_PAGE_PATH],
      nestedLinks: [
        {
          id: DATASETS_PAGE,
          label: 'Datasets',
          link: `${pathname}/${DATASETS_PAGE}`
        },
        {
          id: DOCUMENTS_PAGE,
          label: 'Documents',
          link: `${pathname}/${DOCUMENTS_PAGE}`
        },
        {
          id: LLM_PROMPTS_PAGE,
          label: 'LLM prompts',
          link: `${pathname}/${LLM_PROMPTS_PAGE}`
        },
        {
          id: FILES_PAGE,
          label: 'Other artifacts',
          link: `${pathname}/${FILES_PAGE}`
        },
        {
          id: FEATURE_STORE_PAGE_PATH,
          label: 'Feature store',
          link: `${pathname}/${FEATURE_STORE_PAGE_PATH}`,
        }
      ]
    },
    {
      icon: <ModelsIcon />,
      id: MODELS_PAGE,
      label: 'Models',
      screens: [MODELS_PAGE, MONITORING_APP_PAGE, MODEL_ENDPOINTS_TAB, REAL_TIME_PIPELINES_TAB],
      nestedLinks: [
        {
          id: MODELS_PAGE,
          label: 'Model artifacts',
          link: `${pathname}/${MODELS_PAGE}/${MODELS_PAGE}`
        },
        {
          id: MODEL_ENDPOINTS_TAB,
          label: 'Model endpoints',
          link: `${pathname}/${MODELS_PAGE}/${MODEL_ENDPOINTS_TAB}`
        },
        {
          id: REAL_TIME_PIPELINES_TAB,
          label: 'Real-time pipelines',
          link: `${pathname}/${MODELS_PAGE}/${REAL_TIME_PIPELINES_TAB}`
        },
        {
          id: MONITORING_APP_PAGE,
          label: 'Monitoring app',
          link: `${pathname}/${MONITORING_APP_PAGE}`
        }
      ]
    },
    {
      icon: <JobsWorkflowIcon />,
      id: JOBS_PAGE_PATH,
      label: 'Jobs and workflows',
      screens: [JOBS_PAGE_PATH, MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB, SCHEDULE_TAB],
      nestedLinks: [
        {
          id: MONITOR_JOBS_TAB,
          label: 'Jobs',
          link: `${pathname}/${JOBS_PAGE_PATH}/${MONITOR_JOBS_TAB}`
        },
        {
          id: MONITOR_WORKFLOWS_TAB,
          label: 'Workflows',
          link: `${pathname}/${JOBS_PAGE_PATH}/${MONITOR_WORKFLOWS_TAB}`
        },
        {
          id: SCHEDULE_TAB,
          label: 'Schedule',
          link: `${pathname}/${JOBS_PAGE_PATH}/${SCHEDULE_TAB}`
        }
      ]
    },
    {
      icon: <FunctionIcon />,
      id: FUNCTIONS_PAGE_PATH,
      label: 'ML functions',
      link: `${pathname}/${FUNCTIONS_PAGE_PATH}`
    },
    {
      icon: <NuclioIcon />,
      id: NUCLIO_PAGE,
      label: 'Nuclio',
      nestedLinks: [
        {
          id: REAL_TIME_FUNCTIONS_PAGE,
          label: 'Real-time functions',
          link: generateNuclioLink(`${pathname}/${FUNCTIONS_PAGE_PATH}`),
          externalLink: true
        },
        {
          id: API_GATEWAYS_PAGE,
          label: 'API gateways',
          link: generateNuclioLink(`${pathname}/${API_GATEWAYS_PAGE}`),
          externalLink: true
        }
      ]
    }
  ]
}

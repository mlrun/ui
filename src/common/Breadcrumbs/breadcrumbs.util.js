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
import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  MODEL_ENDPOINTS_TAB,
  MONITOR_JOBS_TAB,
  MODELS_TAB,
  MONITOR_WORKFLOWS_TAB,
  SCHEDULE_TAB
} from '../../constants'

export const generateProjectScreens = params => [
  {
    label: 'Project Monitoring',
    id: 'monitor'
  },
  { label: 'Feature Store', id: 'feature-store' },
  { label: 'Datasets', id: 'datasets' },
  { label: 'Artifacts', id: 'files' },
  { label: 'Models', id: 'models' },
  { label: 'Jobs', id: 'jobs' },
  { label: 'ML functions', id: 'functions' },
  {
    label: 'Real-time functions',
    id: 'Real-time functions',
    link: `${window.mlrunConfig.nuclioUiUrl}/projects/${params.projectName}/functions`
  },
  {
    label: 'API gateways',
    id: 'API gateways',
    link: `${window.mlrunConfig.nuclioUiUrl}/projects/${params.projectName}/api-gateways`
  },
  {
    label: 'Settings',
    id: 'settings'
  }
]

export const generateTabsList = () => [
  {
    label: MONITOR_JOBS_TAB,
    id: MONITOR_JOBS_TAB
  },
  {
    label: MONITOR_WORKFLOWS_TAB,
    id: MONITOR_WORKFLOWS_TAB
  },
  {
    label: SCHEDULE_TAB,
    id: SCHEDULE_TAB
  },
  {
    label: FEATURE_SETS_TAB,
    id: FEATURE_SETS_TAB
  },
  {
    label: FEATURE_VECTORS_TAB,
    id: FEATURE_VECTORS_TAB
  },
  {
    label: FEATURES_TAB,
    id: FEATURES_TAB
  },
  {
    label: MODELS_TAB,
    id: MODELS_TAB
  },
  {
    label: MODEL_ENDPOINTS_TAB,
    id: MODEL_ENDPOINTS_TAB
  }
]

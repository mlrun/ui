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
import { MODELS_TAB } from 'igz-controls/constants'

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

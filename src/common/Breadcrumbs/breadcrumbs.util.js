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

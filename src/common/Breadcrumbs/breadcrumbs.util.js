export const generateProjectScreens = match => [
  { label: 'Models', id: 'models' },
  { label: 'Feature Store', id: 'feature-store' },
  { label: 'Files', id: 'files' },
  { label: 'Jobs', id: 'jobs' },
  { label: 'ML functions', id: 'functions' },
  {
    label: 'Real-time functions',
    id: 'Real-time functions',
    link: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/functions`
  },
  {
    label: 'API gateways',
    id: 'API gateways',
    link: `${window.mlrunConfig.nuclioUiUrl}/projects/${match.params.projectName}/api-gateways`
  }
]

export const generateProjectsList = projects =>
  projects.map(project => ({
    label: project,
    id: project
  }))

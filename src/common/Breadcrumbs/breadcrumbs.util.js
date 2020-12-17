export const generateProjectScreens = match => [
  { label: 'Models', id: 'models' },
  { label: 'Feature Store', id: 'feature-store' },
  { label: 'Files', id: 'files' },
  { label: 'Jobs', id: 'jobs' },
  { label: 'ML functions', id: 'functions' },
  {
    label: 'Real-time functions',
    id: 'Real-time functions',
    link: `${process.env.REACT_APP_NUCLIO_UI_URL}/projects/${match.params.projectName}/functions`
  },
  {
    label: 'API gateways',
    id: 'API gateways',
    link: `${process.env.REACT_APP_NUCLIO_UI_URL}/projects/${match.params.projectName}/api-gateways`
  }
]

export const generateProjectsList = projects =>
  projects.map(project => ({
    label: project.metadata.name,
    id: project.metadata.name
  }))

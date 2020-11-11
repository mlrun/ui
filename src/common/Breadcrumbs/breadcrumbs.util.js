export const generateProjectScreens = match => [
  { label: 'Models', id: 'models' },
  { label: 'Datasets', id: 'datasets' },
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
  projects.map(project => ({ label: project.name, id: project.name }))

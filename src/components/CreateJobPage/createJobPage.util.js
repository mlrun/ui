export const generateProjectsList = (projects, projectName) =>
  projects.map(project => ({
    label: project.name === projectName ? 'Current project' : project.name,
    id: project.name
  }))

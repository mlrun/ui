export const generateProjectsList = (projects, currentProject = '') => {
  return projects.map(project => ({
    label: currentProject === project ? `Current (${project})` : project,
    id: project
  }))
}

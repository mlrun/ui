export const generateProjectsList = (projects, currentProject = '') =>
  projects
    .map(project => {
      return {
        label: currentProject === project ? `Current (${project})` : project,
        id: project
      }
    })
    .sort((prevProject, nextProject) =>
      prevProject.label.localeCompare(nextProject.label)
    )

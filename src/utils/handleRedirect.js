export const isPageTabValid = (pageTab, tabs, navigate, location) => {
  if (!tabs.includes(pageTab)) {
    // Change invalid "tab" part of the link to a valid one
    navigate([...location.pathname.split('/').slice(0, 4)].join('/'))
  }
}

export const isProjectValid = (navigate, projectsNames, currentProjectName) => {
  if (
    projectsNames.length > 0 &&
    !projectsNames.some(project => project === currentProjectName)
  ) {
    navigate('/projects')
  }
}

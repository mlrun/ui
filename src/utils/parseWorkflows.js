export const parseWorkflows = workflows => {
  return workflows.map(workflow => {
    return {
      ...workflow,
      ui: {
        originalContent: workflow
      }
    }
  })
}

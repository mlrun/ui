import getState from './getState'
import { MONITOR_WORKFLOWS_TAB } from '../constants'

export const parseWorkflows = workflows => {
  return workflows.map(workflow => {
    return {
      ...workflow,
      state: getState(
        workflow.status.toLowerCase(),
        MONITOR_WORKFLOWS_TAB,
        'workflow'
      ),
      ui: {
        originalContent: workflow
      }
    }
  })
}

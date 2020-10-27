import { combineReducers } from 'redux'

import jobsStore from './jobReducer'
import artifactsStore from './artifactReducer'
import projectStore from './projectReducer'
import notificationStore from './notificationReducer'
import functionsStore from './functionReducer'
import workflowsStore from './workflowReducer'

export default combineReducers({
  artifactsStore,
  functionsStore,
  jobsStore,
  notificationStore,
  projectStore,
  workflowsStore
})

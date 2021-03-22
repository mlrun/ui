import { combineReducers } from 'redux'

import appStore from './appReducer'
import artifactsStore from './artifactReducer'
import functionsStore from './functionReducer'
import jobsStore from './jobReducer'
import notificationStore from './notificationReducer'
import nuclioStore from './nuclioReducer'
import projectStore from './projectReducer'
import workflowsStore from './workflowReducer'

export default combineReducers({
  appStore,
  artifactsStore,
  functionsStore,
  jobsStore,
  notificationStore,
  nuclioStore,
  projectStore,
  workflowsStore
})

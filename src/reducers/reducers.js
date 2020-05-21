import { combineReducers } from 'redux'

import jobsStore from './jobReducer'
import artifactsStore from './artifactReducer'
import projectStore from './projectReducer'
import notificationDownloadStore from './notificationDownloadReducer'
import functionsStore from './functionReducer'
import workflowsStore from './workflowReducer'

export default combineReducers({
  artifactsStore,
  functionsStore,
  jobsStore,
  notificationDownloadStore,
  projectStore,
  workflowsStore
})

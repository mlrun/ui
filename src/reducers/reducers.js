import { combineReducers } from 'redux'

import jobsStore from './jobReducer'
import artifactsStore from './artifactReducer'
import projectStore from './projectReducer'
import notificationDownloadStore from './notificationDownloadReducer'

export default combineReducers({
  jobsStore,
  artifactsStore,
  projectStore,
  notificationDownloadStore
})

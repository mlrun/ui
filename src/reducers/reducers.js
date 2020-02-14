import { combineReducers } from 'redux'

import jobsStore from './jobReducer'
import artifactsStore from './artifactReducer'
import projectStore from './projectReducer'

export default combineReducers({
  jobsStore,
  artifactsStore,
  projectStore
})

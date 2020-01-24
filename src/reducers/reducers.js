import { combineReducers } from 'redux'

import jobsStore from './jobReducer'
import artifactsStore from './artifactReducer'

export default combineReducers({
  jobsStore,
  artifactsStore
})

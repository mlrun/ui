import { combineReducers } from 'redux'

import artifactsStore from './artifactReducer'
// import featureStore from './featureStoreReducer'
import functionsStore from './functionReducer'
import jobsStore from './jobReducer'
import detailsStore from './detailsReducer'
import notificationStore from './notificationReducer'
import nuclioStore from './nuclioReducer'
import projectStore from './projectReducer'
import workflowsStore from './workflowReducer'
import filtersStore from './filtersReducer'

export default combineReducers({
  artifactsStore,
  // featureStore,
  functionsStore,
  jobsStore,
  detailsStore,
  notificationStore,
  nuclioStore,
  projectStore,
  workflowsStore,
  filtersStore
})

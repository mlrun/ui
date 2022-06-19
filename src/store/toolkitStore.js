import { configureStore } from '@reduxjs/toolkit'

import appStore from '../reducers/appReducer'
import artifactsStore from '../reducers/artifactReducer'
import featureStore from '../reducers/featureStoreReducer'
import functionsStore from '../reducers/functionReducer'
import jobsStore from '../reducers/jobReducer'
import detailsStore from '../reducers/detailsReducer'
import notificationStore from '../reducers/notificationReducer'
import nuclioStore from '../reducers/nuclioReducer'
import projectStore from '../reducers/projectReducer'
import tableStore from '../reducers/tableReducer'
import workflowsStore from '../reducers/workflowReducer'
import filtersStore from '../reducers/filtersReducer'

const toolkitStore = configureStore({
  reducer: {
    appStore,
    artifactsStore,
    featureStore,
    functionsStore,
    jobsStore,
    detailsStore,
    notificationStore,
    nuclioStore,
    projectStore,
    tableStore,
    workflowsStore,
    filtersStore
  },
  //remove this when removed redux and switched to redux-toolkit
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export default toolkitStore

/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
      immutableCheck: false
    })
})

export default toolkitStore

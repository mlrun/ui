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
import React, { useCallback, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { monitorModelEndpoint } from './ModelEndpoints/modelEndpoints.util'
import { toggleYaml } from '../../reducers/appReducer'

export const ModelsPageContext = React.createContext({})

export const ModelsPageProvider = ({ children }) => {
  const dispatch = useDispatch()
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const params = useParams()

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  const handleMonitoring = useCallback(
    item => {
      monitorModelEndpoint(frontendSpec.model_monitoring_dashboard_url, item, params.projectName)
    },
    [frontendSpec.model_monitoring_dashboard_url, params.projectName]
  )

  return (
    <ModelsPageContext.Provider
      value={{
        handleMonitoring,
        toggleConvertedYaml
      }}
    >
      {children}
    </ModelsPageContext.Provider>
  )
}

export const useModelsPage = () => useContext(ModelsPageContext)

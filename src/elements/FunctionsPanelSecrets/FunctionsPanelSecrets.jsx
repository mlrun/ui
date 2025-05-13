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
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FunctionsPanelSecretsView from './FunctionsPanelSecretsView'

import { setNewFunctionSecretSources } from '../../reducers/functionReducer'

const FunctionsPanelSecrets = () => {
  const dispatch = useDispatch()
  const functionsStore = useSelector(store => store.functionsStore)

  const handleAddNewSecretSource = useCallback(
    secretSource => {
      dispatch(
        setNewFunctionSecretSources([
          ...functionsStore.newFunction.spec.secret_sources,
          { kind: secretSource.key, source: secretSource.value }
        ])
      )
    },
    [dispatch, functionsStore.newFunction.spec.secret_sources]
  )

  const handleEditSecretSource = useCallback(
    secretSource => {
      dispatch(
        setNewFunctionSecretSources(
          functionsStore.newFunction.spec.secret_sources.map((item, index) => {
            if (index === secretSource.index) {
              return {
                ...item,
                kind: secretSource.newKey || secretSource.key,
                source: secretSource.value
              }
            }

            return item
          })
        )
      )
    },
    [dispatch, functionsStore.newFunction.spec.secret_sources]
  )

  const handleDeleteSecretSource = useCallback(
    secretSourceIndex => {
      dispatch(
        setNewFunctionSecretSources(
          functionsStore.newFunction.spec.secret_sources.filter(
            (secretSource, index) => index !== secretSourceIndex
          )
        )
      )
    },
    [dispatch, functionsStore.newFunction.spec.secret_sources]
  )

  return (
    <FunctionsPanelSecretsView
      handleAddNewSecretSource={handleAddNewSecretSource}
      handleDeleteSecretSource={handleDeleteSecretSource}
      handleEditSecretSource={handleEditSecretSource}
      secretSources={(functionsStore.newFunction.spec.secret_sources ?? []).map(secretSource => ({
        key: secretSource.kind,
        value: secretSource.source
      }))}
    />
  )
}

export default FunctionsPanelSecrets

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
import { connect } from 'react-redux'

import FunctionsPanelSecretsView from './FunctionsPanelSecretsView'

import functionsActions from '../../actions/functions'

const FunctionsPanelSecrets = ({
  functionsStore,
  setNewFunctionSecretSources
}) => {
  const handleAddNewSecretSource = useCallback(
    secretSource => {
      setNewFunctionSecretSources([
        ...functionsStore.newFunction.spec.secret_sources,
        { kind: secretSource.key, source: secretSource.value }
      ])
    },
    [
      functionsStore.newFunction.spec.secret_sources,
      setNewFunctionSecretSources
    ]
  )

  const handleEditSecretSource = useCallback(
    secretSource => {
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
    },
    [functionsStore.newFunction.spec.secret_sources, setNewFunctionSecretSources]
  )

  const handleDeleteSecretSource = useCallback(
    secretSourceIndex => {
      setNewFunctionSecretSources(
        functionsStore.newFunction.spec.secret_sources.filter(
          (secretSource, index) => index !== secretSourceIndex
        )
      )
    },
    [
      functionsStore.newFunction.spec.secret_sources,
      setNewFunctionSecretSources
    ]
  )

  return (
    <FunctionsPanelSecretsView
      handleAddNewSecretSource={handleAddNewSecretSource}
      handleDeleteSecretSource={handleDeleteSecretSource}
      handleEditSecretSource={handleEditSecretSource}
      secretSources={(functionsStore.newFunction.spec.secret_sources ?? []).map(
        secretSource => ({
          key: secretSource.kind,
          value: secretSource.source
        })
      )}
    />
  )
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  functionsActions
)(FunctionsPanelSecrets)

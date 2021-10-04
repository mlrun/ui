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
            item.kind = secretSource.newKey || secretSource.key
            item.source = secretSource.value
          }

          return item
        })
      )
    },
    [
      functionsStore.newFunction.spec.secret_sources,
      setNewFunctionSecretSources
    ]
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

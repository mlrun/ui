import React from 'react'
import { connect } from 'react-redux'

import FunctionsPanelSecretsView from './FunctionsPanelSecretsView'

import functionsActions from '../../actions/functions'

const FunctionsPanelSecrets = ({
  functionsStore,
  setNewFunctionSecretSources
}) => {
  const handleAddNewSecretSource = secretSource => {
    setNewFunctionSecretSources([
      ...functionsStore.newFunction.spec.env,
      { kind: secretSource.key, source: secretSource.value }
    ])
  }

  const handleEditSecretSource = secretSource => {
    setNewFunctionSecretSources(
      functionsStore.newFunction.spec.secret_sources.map(item => {
        if (item.kind === secretSource.key) {
          item.kind = secretSource.newKey || secretSource.key
          item.source = secretSource.value
        }

        return item
      })
    )
  }

  const handleDeleteSecretSource = secretSourceIndex => {
    setNewFunctionSecretSources(
      functionsStore.newFunction.spec.secret_sources.filter(
        (secretSource, index) => index !== secretSourceIndex
      )
    )
  }

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

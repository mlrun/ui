import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'

import './functionsPanelSecrets.scss'

const FunctionsPanelSecretsView = ({
  handleAddNewSecretSource,
  handleDeleteSecretSource,
  handleEditSecretSource,
  secretSources
}) => {
  const kindOptions = [
    {
      label: 'File',
      id: 'file'
    },
    { label: 'Env', id: 'env' }
  ]

  return (
    <FunctionsPanelSection className="secrets" title="Secrets">
      <KeyValueTable
        addNewItem={handleAddNewSecretSource}
        addNewItemLabel="Add secret"
        className="secrets__table"
        content={secretSources}
        deleteItem={handleDeleteSecretSource}
        editItem={handleEditSecretSource}
        keyHeader="Kind"
        keyLabel="Kind"
        keyOptions={kindOptions}
        keyType="select"
        valueHeader="Value"
        valueLabel="Value"
        withEditMode
      />
    </FunctionsPanelSection>
  )
}

FunctionsPanelSecretsView.propTypes = {
  handleAddNewSecretSource: PropTypes.func.isRequired,
  handleDeleteSecretSource: PropTypes.func.isRequired,
  handleEditSecretSource: PropTypes.func.isRequired,
  secretSources: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
}

export default FunctionsPanelSecretsView

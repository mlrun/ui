import React from 'react'
import PropTypes from 'prop-types'

import PanelSection from '../PanelSection/PanelSection'
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
    <PanelSection className="secrets" title="Secrets">
      <KeyValueTable
        addNewItem={handleAddNewSecretSource}
        addNewItemLabel="Add secret"
        className="secrets__table"
        content={secretSources}
        defaultKeyValue="file"
        deleteItem={handleDeleteSecretSource}
        editItem={handleEditSecretSource}
        keyHeader="Kind"
        keyLabel="Kind"
        keyOptions={kindOptions}
        keyType="select"
        isValueRequired
        valueHeader="Value"
        valueLabel="Value"
        withEditMode
      />
    </PanelSection>
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

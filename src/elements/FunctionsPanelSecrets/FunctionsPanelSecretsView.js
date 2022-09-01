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

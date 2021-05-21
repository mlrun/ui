import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'

import './functionPanelEnviromnetVariables.scss'

const FunctionsPanelEnvironmentVariablesView = ({
  env,
  handleAddNewEnv,
  handleDeleteEnv,
  handleEditEnv
}) => {
  return (
    <div className="functions-panel__item advanced new-item-side-panel__item">
      <FunctionsPanelSection title="Environment Variables">
        <KeyValueTable
          addNewItem={handleAddNewEnv}
          addNewItemLabel="Add variable"
          className="env"
          content={env}
          deleteItem={handleDeleteEnv}
          editItem={handleEditEnv}
          keyHeader="Variable name"
          keyLabel="Name"
          valueHeader="Value"
          valueLabel="Value"
          withEditMode
        />
      </FunctionsPanelSection>
    </div>
  )
}

FunctionsPanelEnvironmentVariablesView.propTypes = {
  env: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  handleAddNewEnv: PropTypes.func.isRequired,
  handleDeleteEnv: PropTypes.func.isRequired,
  handleEditEnv: PropTypes.func.isRequired
}

export default FunctionsPanelEnvironmentVariablesView

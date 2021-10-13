import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import EnvironmentVariables from '../EnvironmentVariables/EnvironmentVariables'

import './functionPanelEnviromnetVariables.scss'
import { isDemoMode } from '../../utils/helper'

const FunctionsPanelEnvironmentVariablesView = ({
  envVariables,
  handleAddNewEnv,
  handleDeleteEnv,
  handleEditEnv,
  location
}) => {
  return isDemoMode(location.search) ? (
    <EnvironmentVariables
      envVariables={envVariables}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
    />
  ) : (
    <div className="functions-panel__item advanced new-item-side-panel__item">
      <FunctionsPanelSection title="Environment Variables">
        <KeyValueTable
          addNewItem={handleAddNewEnv}
          addNewItemLabel="Add variable"
          className="env"
          content={envVariables.map(env => ({
            key: env.name,
            value: env.value
          }))}
          deleteItem={handleDeleteEnv}
          editItem={handleEditEnv}
          isKeyRequired={true}
          isValueRequired={true}
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
  envVariables: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      value_from: PropTypes.shape({
        name: PropTypes.string,
        key: PropTypes.string
      }),
      ui: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    })
  ).isRequired,
  handleAddNewEnv: PropTypes.func.isRequired,
  handleDeleteEnv: PropTypes.func.isRequired,
  handleEditEnv: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
}

export default FunctionsPanelEnvironmentVariablesView

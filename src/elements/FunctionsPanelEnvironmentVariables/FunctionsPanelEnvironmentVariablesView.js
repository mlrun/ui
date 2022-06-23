import React from 'react'
import PropTypes from 'prop-types'

import PanelSection from '../PanelSection/PanelSection'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import EnvironmentVariables from '../EnvironmentVariables/EnvironmentVariables'

import './functionPanelEnviromnetVariables.scss'

const FunctionsPanelEnvironmentVariablesView = ({
  envVariables,
  handleAddNewEnv,
  handleDeleteEnv,
  handleEditEnv,
  isStagingMode
}) => {
  return isStagingMode ? (
    <EnvironmentVariables
      envVariables={envVariables}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
    />
  ) : (
    <div className="functions-panel__item advanced new-item-side-panel__item">
      <PanelSection title="Environment Variables">
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
      </PanelSection>
    </div>
  )
}

FunctionsPanelEnvironmentVariablesView.propTypes = {
  envVariables: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      valueFrom: PropTypes.shape({
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
  isStagingMode: PropTypes.bool.isRequired
}

export default FunctionsPanelEnvironmentVariablesView

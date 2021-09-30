import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { map } from 'lodash'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import EditableFunctionParameterRow from './EditableFunctionParameterRow'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import AddFunctionParameterRow from './AddFunctionParameterRow'

import { tableHeaders } from './functionsPanelParameters.util'

import { ReactComponent as Plus } from '../../images/plus.svg'

import './functionsPanelParameters.scss'

const FunctionsPanelParametersView = ({
  discardChanges,
  editParameter,
  generateActionsMenu,
  handleAddNewParameter,
  newParameter,
  parameters,
  selectedParameter,
  setNewParameter,
  setSelectedParameter,
  setShowAddNewParameterRow,
  setValidation,
  showAddNewParameterRow,
  validation
}) => {
  const tableClassNames = classnames(
    'new-item-side-panel__table',
    'parameters-table',
    showAddNewParameterRow && 'no-border'
  )

  return (
    <FunctionsPanelSection title="Parameters">
      <div className={tableClassNames}>
        <div className="table__header table__row no-hover">
          {tableHeaders.map((header, index) => (
            <div className="table__cell" key={header.id}>
              {header.label}
            </div>
          ))}
          <div className="table__cell-actions" />
        </div>
        {parameters.map((parameter, index) =>
          selectedParameter &&
          selectedParameter.data.name === parameter.data.name ? (
            <EditableFunctionParameterRow
              handleEdit={editParameter}
              key={index}
              parameters={parameters}
              selectedParameter={selectedParameter}
              setSelectedParameter={setSelectedParameter}
              setValidation={setValidation}
              validation={validation}
            />
          ) : (
            <div className="table__row" key={index}>
              {map(parameter.data, (value, property) => {
                return (
                  <div className="table__cell" key={property}>
                    <Tooltip template={<TextTooltipTemplate text={value} />}>
                      {value}
                    </Tooltip>
                  </div>
                )
              })}
              <div className="table__cell table__cell-actions">
                <ActionsMenu
                  dataItem={parameter}
                  menu={generateActionsMenu(parameter)}
                />
              </div>
            </div>
          )
        )}
        {showAddNewParameterRow ? (
          <AddFunctionParameterRow
            discardChanges={discardChanges}
            handleAddNewParameter={handleAddNewParameter}
            newParameter={newParameter}
            parameters={parameters}
            setNewParameter={setNewParameter}
            setValidation={setValidation}
            validation={validation}
          />
        ) : (
          <div className="table__row no-hover">
            <div
              className="table__cell"
              onClick={() => setShowAddNewParameterRow(true)}
            >
              <button className="add-input">
                <Plus />
                Add parameter
              </button>
            </div>
          </div>
        )}
      </div>
    </FunctionsPanelSection>
  )
}

FunctionsPanelParametersView.defaultProps = {
  selectedParameter: null
}

FunctionsPanelParametersView.propTypes = {
  discardChanges: PropTypes.func.isRequired,
  editParameter: PropTypes.func.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  newParameter: PropTypes.shape({}).isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedParameter: PropTypes.shape({}),
  setNewParameter: PropTypes.func.isRequired,
  setSelectedParameter: PropTypes.func.isRequired,
  setShowAddNewParameterRow: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showAddNewParameterRow: PropTypes.bool.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FunctionsPanelParametersView

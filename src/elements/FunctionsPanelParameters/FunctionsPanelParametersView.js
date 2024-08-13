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
import classnames from 'classnames'
import { map } from 'lodash'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import AddFunctionParameterRow from './AddFunctionParameterRow'
import EditableFunctionParameterRow from './EditableFunctionParameterRow'
import PanelSection from '../PanelSection/PanelSection'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { tableHeaders } from './functionsPanelParameters.util'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'

import './functionsPanelParameters.scss'

const FunctionsPanelParametersView = ({
  discardChanges,
  editParameter,
  generateActionsMenu,
  handleAddNewParameter,
  newParameter,
  parameters,
  selectedParameter = null,
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
    <PanelSection title="Parameters">
      <div className={tableClassNames}>
        <div className="table__header table__row no-hover">
          {tableHeaders.map(header => (
            <div className="table__cell" key={header.id}>
              {header.label}
            </div>
          ))}
          <div className="table__cell-actions" />
        </div>
        {parameters.map((parameter, index) =>
          selectedParameter && selectedParameter.data.name === parameter.data.name ? (
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
                    <Tooltip template={<TextTooltipTemplate text={value} />}>{value}</Tooltip>
                  </div>
                )
              })}
              <div className="table__cell table__cell-actions">
                <ActionsMenu dataItem={parameter} menu={generateActionsMenu(parameter)} />
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
            <div className="table__cell" onClick={() => setShowAddNewParameterRow(true)}>
              <button className="add-input">
                <Plus />
                Add parameter
              </button>
            </div>
          </div>
        )}
      </div>
    </PanelSection>
  )
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

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

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import AddEnvironmentVariablesRow from './AddEnvironmentVariablesRow'
import EditableEnvironmentVariablesRow from './EditableEnvironmentVariablesRow'
import PanelSection from '../PanelSection/PanelSection'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { tableHeaders } from './environmentVariables.util'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'

import './enviromnetVariables.scss'

const EnvironmentVariablesView = ({
  addEnvVariable,
  className = '',
  discardChanges,
  editEnvVariable,
  envVariables,
  generateActionsMenu,
  isPanelEditMode = false,
  newEnvVariable,
  selectedEnvVariable = null,
  setNewEnvVariable,
  setSelectedEnvVariable,
  setShowAddNewEnvVariableRow,
  setValidation,
  showAddNewEnvVariableRow,
  validation
}) => {
  const tableClassNames = classnames(
    'env-variables-table',
    showAddNewEnvVariableRow && 'no-border',
    className
  )
  const addBtnClassNames = classnames('add-input', isPanelEditMode && 'disabled')

  return (
    <div className="new-item-side-panel__item">
      <PanelSection title="Environment Variables">
        <div className={tableClassNames}>
          <div className="table__header table__row no-hover">
            {tableHeaders.map(header => {
              const tableHeaderClassNames = classnames('table__cell', header.className)

              return (
                <div className={tableHeaderClassNames} key={header.id}>
                  {header.label}
                </div>
              )
            })}
            <div className="table__cell-actions" />
          </div>
          {envVariables.map((envVariable, index) =>
            selectedEnvVariable &&
            !isPanelEditMode &&
            selectedEnvVariable.name === envVariable.name ? (
              <EditableEnvironmentVariablesRow
                editEnvVariable={editEnvVariable}
                envVariables={envVariables}
                key={index}
                selectedEnvVariable={selectedEnvVariable}
                setSelectedEnvVariable={setSelectedEnvVariable}
              />
            ) : (
              <div className="table__row" key={index}>
                <div className="table__cell table-cell__key">
                  <Tooltip template={<TextTooltipTemplate text={envVariable.name} />}>
                    {envVariable.name}
                  </Tooltip>
                </div>
                <div className="table__cell table-cell__type">
                  <Tooltip template={<TextTooltipTemplate text={envVariable.type} />}>
                    {envVariable.type}
                  </Tooltip>
                </div>
                <div className="table__cell table-cell__value">
                  <Tooltip template={<TextTooltipTemplate text={envVariable.value} />}>
                    {envVariable.value}
                  </Tooltip>
                </div>
                {!isPanelEditMode && (
                  <div className="table__cell table__cell-actions">
                    <ActionsMenu dataItem={envVariable} menu={generateActionsMenu(envVariable)} />
                  </div>
                )}
              </div>
            )
          )}
          {showAddNewEnvVariableRow && !isPanelEditMode ? (
            <AddEnvironmentVariablesRow
              addEnvVariable={addEnvVariable}
              discardChanges={discardChanges}
              envVariables={envVariables}
              newEnvVariable={newEnvVariable}
              setNewEnvVariable={setNewEnvVariable}
              setValidation={setValidation}
              validation={validation}
            />
          ) : (
            <div className="table__row no-hover">
              <div
                className="table__cell"
                onClick={() => !isPanelEditMode && setShowAddNewEnvVariableRow(true)}
              >
                <button className={addBtnClassNames}>
                  <Plus />
                  Add variable
                </button>
              </div>
            </div>
          )}
        </div>
      </PanelSection>
    </div>
  )
}

EnvironmentVariablesView.propTypes = {
  addEnvVariable: PropTypes.func.isRequired,
  className: PropTypes.string,
  discardChanges: PropTypes.func.isRequired,
  editEnvVariable: PropTypes.func.isRequired,
  envVariables: PropTypes.array.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  isPanelEditMode: PropTypes.bool,
  newEnvVariable: PropTypes.object.isRequired,
  selectedEnvVariable: PropTypes.object,
  setNewEnvVariable: PropTypes.func.isRequired,
  setSelectedEnvVariable: PropTypes.func.isRequired,
  setShowAddNewEnvVariableRow: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showAddNewEnvVariableRow: PropTypes.bool.isRequired,
  validation: PropTypes.object.isRequired
}

export default EnvironmentVariablesView

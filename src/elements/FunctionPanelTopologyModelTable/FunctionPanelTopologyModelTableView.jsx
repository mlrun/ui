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
import { map } from 'lodash'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import AddRouteRow from './AddRouteRow'
import EditableRouteRow from './EditableRouteRow'
import { Tooltip, TextTooltipTemplate, ActionsMenu } from 'igz-controls/components'

import { tableHeaders } from './functionPanelTopologyModelTable.util'

import Plus from 'igz-controls/images/plus.svg?react'

import './functionPanelTopologyModelTable.scss'

const FunctionPanelTopologyModelTableView = ({
  addRoute,
  data,
  discardChanges,
  editRoute,
  generateActionsMenu,
  newRoute,
  selectedRoute,
  setNewRoute,
  setSelectedRoute,
  setShowAddNewRouteRow,
  setValidation,
  showAddNewRouteRow,
  validation
}) => {
  const tableClassNames = classnames(
    'new-item-side-panel__table',
    'model-table',
    showAddNewRouteRow && 'no-border'
  )

  return (
    <div className={tableClassNames}>
      <h6 className="model-table__title">Model</h6>
      <div className="table__header table__row no-hover">
        {tableHeaders.map(header => (
          <div className="table__cell" key={header.id}>
            {header.label}
          </div>
        ))}
        <div className="table__cell-actions" />
      </div>
      {data.map((route, index) => {
        if (selectedRoute && selectedRoute.data.name === route.data.name) {
          return (
            <EditableRouteRow
              editRoute={editRoute}
              key={index}
              routes={data}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
              setValidation={setValidation}
              validation={validation}
            />
          )
        } else {
          return (
            <div className="table__row" key={index}>
              {map(route.data, (value, property) => {
                return (
                  <div className="table__cell" key={property}>
                    <Tooltip template={<TextTooltipTemplate text={value} />}>{value}</Tooltip>
                  </div>
                )
              })}
              <div className="table__cell table__cell-actions">
                <ActionsMenu menu={generateActionsMenu(route)} dataItem={route} />
              </div>
            </div>
          )
        }
      })}
      {showAddNewRouteRow ? (
        <AddRouteRow
          addRoute={addRoute}
          data={data}
          discardChanges={discardChanges}
          newRoute={newRoute}
          setNewRoute={setNewRoute}
          setValidation={setValidation}
          validation={validation}
        />
      ) : (
        <div className="table__row no-hover">
          <div className="table__cell" onClick={() => setShowAddNewRouteRow(true)}>
            <button className="add-input">
              <Plus />
              Add route
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

FunctionPanelTopologyModelTableView.propTypes = {
  addRoute: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  discardChanges: PropTypes.func.isRequired,
  editRoute: PropTypes.func.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  newRoute: PropTypes.object.isRequired,
  selectedRoute: PropTypes.object,
  setNewRoute: PropTypes.func.isRequired,
  setSelectedRoute: PropTypes.func.isRequired,
  setShowAddNewRouteRow: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showAddNewRouteRow: PropTypes.bool.isRequired,
  validation: PropTypes.object.isRequired
}

export default FunctionPanelTopologyModelTableView

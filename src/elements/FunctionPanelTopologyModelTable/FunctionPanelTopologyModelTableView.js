import React from 'react'
import { map } from 'lodash'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import EditableRouteRow from './EditableRouteRow'
import AddRouteRow from './AddRouteRow'

import { tableHeaders } from './functionPanelTopologyModelTable.util'

import { ReactComponent as Plus } from '../../images/plus.svg'

import './functionPanelTopologyModelTable.scss'

const FunctionPanelTopologyModelTableView = ({
  addRoute,
  data,
  editRoute,
  generateActionsMenu,
  newRoute,
  selectedRoute,
  setNewRoute,
  setSelectedRoute,
  setShowAddNewRouteRow,
  showAddNewRouteRow
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
        {tableHeaders.map((header, index) => (
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
            />
          )
        } else {
          return (
            <div className="table__row" key={index}>
              {map(route.data, (value, property) => {
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
                  menu={generateActionsMenu(route)}
                  dataItem={route}
                />
              </div>
            </div>
          )
        }
      })}
      {showAddNewRouteRow ? (
        <AddRouteRow
          addRoute={addRoute}
          data={data}
          newRoute={newRoute}
          setNewRoute={setNewRoute}
        />
      ) : (
        <div className="table__row no-hover">
          <div
            className="table__cell"
            onClick={() => setShowAddNewRouteRow(true)}
          >
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
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  editRoute: PropTypes.func.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  newRoute: PropTypes.shape({}).isRequired,
  selectedRoute: PropTypes.shape({}),
  setNewRoute: PropTypes.func.isRequired,
  setSelectedRoute: PropTypes.func.isRequired,
  setShowAddNewRouteRow: PropTypes.func.isRequired,
  showAddNewRouteRow: PropTypes.bool.isRequired
}

export default FunctionPanelTopologyModelTableView

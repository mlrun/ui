import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import {
  isEditableRouteValid,
  isNameNotUnique
} from './functionPanelTopologyModelTable.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableRouteRow = ({
  editRoute,
  routes,
  selectedRoute,
  setSelectedRoute
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={
            selectedRoute.newName !== selectedRoute.data.name &&
            isNameNotUnique(selectedRoute.newName, routes)
          }
          invalidText="Name already exists"
          label="Name"
          onChange={name =>
            setSelectedRoute({
              ...selectedRoute,
              newName: name
            })
          }
          required
          requiredText="This field is required"
          type="text"
          value={selectedRoute.newName ?? selectedRoute.data.name}
        />
      </div>
      <div className="table__cell">
        <Input
          floatingLabel
          label="Class"
          onChange={class_name =>
            setSelectedRoute({
              ...selectedRoute,
              data: {
                ...selectedRoute.data,
                class_name
              }
            })
          }
          required
          requiredText="This field is required"
          type="text"
          value={selectedRoute.data.class_name}
        />
      </div>
      <div className="table__cell">
        <Input
          floatingLabel
          label="Path"
          onChange={model_path =>
            setSelectedRoute({
              ...selectedRoute,
              data: {
                ...selectedRoute.data,
                model_path
              }
            })
          }
          required
          requiredText="This field is required"
          type="text"
          value={selectedRoute.data.model_path}
        />
      </div>
      <div className="table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={!isEditableRouteValid(selectedRoute, routes)}
          onClick={editRoute}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableRouteRow.propTypes = {
  editRoute: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  selectedRoute: PropTypes.shape({}).isRequired,
  setSelectedRoute: PropTypes.func.isRequired
}

export default EditableRouteRow

import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import {
  isEditableRouteValid,
  isNameNotUnique
} from './functionPanelTopologyModelTable.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableRouteRow = ({
  editRoute,
  routes,
  selectedRoute,
  setSelectedRoute,
  setValidation,
  validation
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={
            (selectedRoute.newName !== selectedRoute.data.name &&
              isNameNotUnique(selectedRoute.newName, routes)) ||
            !validation.isEditNameValid
          }
          invalidText={
            isNameNotUnique(selectedRoute.newName, routes)
              ? 'Name already exists'
              : 'This field is invalid'
          }
          label="Name"
          onChange={name =>
            setSelectedRoute({
              ...selectedRoute,
              newName: name
            })
          }
          required
          requiredText="This field is required"
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditNameValid: value
            }))
          }
          type="text"
          value={selectedRoute.newName ?? selectedRoute.data.name}
        />
      </div>
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={!validation.isEditClassNameValid}
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
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditClassNameValid: value
            }))
          }
          type="text"
          value={selectedRoute.data.class_name}
        />
      </div>
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={!validation.isEditModelPathValid}
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
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditModelPathValid: value
            }))
          }
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
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark />
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

EditableRouteRow.propTypes = {
  editRoute: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  selectedRoute: PropTypes.shape({}).isRequired,
  setSelectedRoute: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default EditableRouteRow

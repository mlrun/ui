import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import {
  isNameNotUnique,
  isRouteValid
} from './functionPanelTopologyModelTable.util'

import { ReactComponent as Plus } from '../../images/plus.svg'

const AddRouteRow = ({ addRoute, data, newRoute, setNewRoute }) => {
  return (
    <div className="table__body">
      <div className="table__body-column">
        <div className="input-row-wrapper">
          <Input
            className="input-row__item"
            floatingLabel
            invalid={isNameNotUnique(newRoute.name, data)}
            invalidText="Name already exists"
            label="Name"
            onChange={name => setNewRoute(state => ({ ...state, name }))}
            required
            requiredText="This field is required"
            type="text"
          />
          <Input
            className="input-row__item"
            floatingLabel
            label="Class"
            onChange={class_name =>
              setNewRoute(state => ({ ...state, class_name }))
            }
            required
            requiredText="This field is required"
            type="text"
          />
          <Input
            className="input-row__item"
            floatingLabel
            label="Path"
            onChange={model_path =>
              setNewRoute(state => ({ ...state, model_path }))
            }
            required
            requiredText="This field is required"
            type="text"
          />
        </div>
      </div>
      <button
        className="add-input btn-add"
        disabled={
          isNameNotUnique(newRoute.name, data) || !isRouteValid(newRoute)
        }
        onClick={addRoute}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
    </div>
  )
}

AddRouteRow.propTypes = {
  addRoute: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  newRoute: PropTypes.shape({}).isRequired,
  setNewRoute: PropTypes.func.isRequired
}

export default AddRouteRow

import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { isNameNotUnique } from './functionPanelTopologyModelTable.util'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

const AddRouteRow = ({
  addRoute,
  data,
  discardChanges,
  newRoute,
  setNewRoute,
  setValidation,
  validation
}) => {
  return (
    <div className="table__body">
      <div className="table__body-column">
        <div className="input-row-wrapper">
          <Input
            className="input-row__item"
            floatingLabel
            invalid={
              isNameNotUnique(newRoute.name, data) || !validation.isNameValid
            }
            invalidText={
              isNameNotUnique(newRoute.name, data)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            label="Name"
            onChange={name => setNewRoute(state => ({ ...state, name }))}
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isNameValid: value
              }))
            }
            type="text"
          />
          <Input
            className="input-row__item"
            floatingLabel
            invalid={!validation.isClassNameValid}
            label="Class"
            onChange={class_name =>
              setNewRoute(state => ({ ...state, class_name }))
            }
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isClassNameValid: value
              }))
            }
            type="text"
          />
          <Input
            className="input-row__item"
            floatingLabel
            invalid={!validation.isModelPathValid}
            label="Path"
            onChange={model_path =>
              setNewRoute(state => ({ ...state, model_path }))
            }
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isModelPathValid: value
              }))
            }
            type="text"
          />
        </div>
      </div>
      <button
        className="btn-add"
        disabled={isNameNotUnique(newRoute.name, data)}
        onClick={addRoute}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
      <button onClick={discardChanges}>
        <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
          <Delete />
        </Tooltip>
      </button>
    </div>
  )
}

AddRouteRow.propTypes = {
  addRoute: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  discardChanges: PropTypes.func.isRequired,
  newRoute: PropTypes.shape({}).isRequired,
  setNewRoute: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default AddRouteRow

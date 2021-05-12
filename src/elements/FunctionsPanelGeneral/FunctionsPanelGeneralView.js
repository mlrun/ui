import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import TextArea from '../../common/TextArea/TextArea'
import ChipCell from '../../common/ChipCell/ChipCell'

import { typeOptions } from './functionsPanelGeneral.util'
// import Tooltip from '../../../common/Tooltip/Tooltip'
// import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'

import './functionsPanelGeneral.scss'

const FunctionsPanelGeneralView = ({
  data,
  handleAddLabel,
  handleChangeLabels,
  handleNameChange,
  handleNameOnBlur,
  handleTagChange,
  handleTagOnBlur,
  isNameValid,
  isTagValid,
  setData,
  setNewFunctionDescription,
  setNewFunctionType
}) => {
  const nameValidationTip = (
    <>
      <span>&bull; Valid characters: A-Z, a-z, 0-9, -, _, .</span>
      <br />
      <span>&bull; Must begin and end with: A-Z, a-z, 0-9</span>
      <br />
      <span>&bull; Length - max: 63</span>
    </>
  )

  return (
    <div className="functions-panel__item new-item-side-panel__item general">
      <FunctionsPanelSection title="General">
        <div className="general__required-info">
          <Input
            floatingLabel
            label="Feature Set Name"
            onChange={handleNameChange}
            onBlur={handleNameOnBlur}
            maxLength={63}
            pattern="^(?=[\S\s]{1,63}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$"
            required={!isNameValid}
            requiredText={
              data.name.length === 0
                ? 'This field is required'
                : 'This field is invalid'
            }
            tip={nameValidationTip}
            type="text"
            value={data.name}
            wrapperClassName="name"
          />
          <Select
            className="type"
            floatingLabel
            label="Runtime type"
            onClick={type => {
              setNewFunctionType(type)
              setData(state => ({
                ...state,
                type
              }))
            }}
            options={typeOptions}
            selectedId={data.type}
          />
          <Input
            floatingLabel
            label="Tag"
            onChange={handleTagChange}
            onBlur={handleTagOnBlur}
            required={!isTagValid}
            requiredText="This field is required"
            type="text"
            value={data.version}
            wrapperClassName="tag"
          />
        </div>
        <TextArea
          floatingLabel
          label="Description"
          onChange={description =>
            setData(state => ({
              ...state,
              description
            }))
          }
          onBlur={event => {
            setNewFunctionDescription(event.target.value)
          }}
          type="text"
          value={data.description}
          wrapperClassName="description"
        />
        <div className="general__labels-container">
          <div className="general__labels-text">Labels</div>
          <div className="general__labels-wrapper">
            <ChipCell
              addChip={handleAddLabel}
              className="general__labels-item"
              editChip={handleChangeLabels}
              elements={data.labels}
              isEditMode={true}
              removeChip={handleChangeLabels}
            />
          </div>
        </div>
      </FunctionsPanelSection>
    </div>
  )
}

FunctionsPanelGeneralView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleAddLabel: PropTypes.func.isRequired,
  handleChangeLabels: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleNameOnBlur: PropTypes.func.isRequired,
  handleVersionChange: PropTypes.func.isRequired,
  handleVersionOnBlur: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isTagValid: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFunctionDescription: PropTypes.func.isRequired
}

export default FunctionsPanelGeneralView

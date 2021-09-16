import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import TextArea from '../../common/TextArea/TextArea'
import ChipCell from '../../common/ChipCell/ChipCell'

import './functionsPanelGeneral.scss'

const FunctionsPanelGeneralView = ({
  data,
  handleAddLabel,
  handleChangeLabels,
  handleDescriptionOnBlur,
  setData
}) => {
  return (
    <div className="functions-panel__item new-item-side-panel__item general">
      <FunctionsPanelSection title="General">
        <div className="general__required-info">
          <div className="name">
            Name: <span>{data.name}</span>
          </div>
          <div className="tag">
            Tag: <span>{data.tag || 'latest'}</span>
          </div>
          <div className="runtime">
            Runtime: <span>{data.kind}</span>
          </div>
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
          onBlur={handleDescriptionOnBlur}
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
  handleDescriptionOnBlur: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFunctionDescription: PropTypes.func.isRequired
}

export default FunctionsPanelGeneralView

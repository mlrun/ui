import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import FeatureSetsPanelTable from '../FeatureSetsPanelTable/FeatureSetsPanelTable'
import FeatureSetsPanelTableAddItemRow from '../FeatureSetsPanelTableAddItemRow/FeatureSetsPanelTableAddItemRow'

import { ReactComponent as Plus } from '../../../images/plus.svg'

export const FeatureSetsPanelDataSourceTable = ({
  addNewItem,
  className,
  content,
  handleAddNewItem,
  headers,
  isAttributeNameValid,
  setAddNewItem,
  setNewItemName,
  setNewItemValue
}) => {
  return (
    <FeatureSetsPanelTable
      addNewItem={addNewItem}
      className={className}
      content={content}
      headers={headers}
    >
      {addNewItem ? (
        <div className="table__row-add-item">
          <div className="input-row-wrapper">
            <Input
              onChange={setNewItemName}
              label="Attribute name"
              className="input-row__item"
              floatingLabel
              required={!isAttributeNameValid}
              requiredText="Attribute name already exists"
              type="text"
            />
            <Input
              onChange={setNewItemValue}
              label="Value"
              className="input-row__item input-row__item_edit"
              floatingLabel
              type="text"
            />
          </div>
          <button className="add-input btn-add" onClick={handleAddNewItem}>
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
        </div>
      ) : (
        <FeatureSetsPanelTableAddItemRow
          onClick={() => setAddNewItem(true)}
          text="attribute"
        />
      )}
    </FeatureSetsPanelTable>
  )
}

FeatureSetsPanelDataSourceTable.defaultProps = {
  className: ''
}

FeatureSetsPanelDataSourceTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isAttributeNameValid: PropTypes.bool.isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setNewItemName: PropTypes.func.isRequired,
  setNewItemValue: PropTypes.func.isRequired
}

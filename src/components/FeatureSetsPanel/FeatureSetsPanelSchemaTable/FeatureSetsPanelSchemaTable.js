import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../../common/Input/Input'
import Tooltip from '../../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../../elements/TooltipTemplate/TextTooltipTemplate'
import FeatureSetsPanelTable from '../FeatureSetsPanelTable/FeatureSetsPanelTable'
import FeatureSetsPanelTableAddItemRow from '../FeatureSetsPanelTableAddItemRow/FeatureSetsPanelTableAddItemRow'
import Select from '../../../common/Select/Select'

import { typeOptions } from '../FeatureSetsPanelSchema/featureSetPanelSchema.util'

import { ReactComponent as Delete } from '../../../images/delete.svg'
import { ReactComponent as Plus } from '../../../images/plus.svg'

export const FeatureSetsPanelSchemaTable = ({
  addNewItem,
  className,
  content,
  data,
  handleAddNewItem,
  handleDeleteEntity,
  headers,
  isEntityNameValid,
  setAddNewItem,
  setNewItemName,
  setNewItemValue
}) => {
  return (
    <FeatureSetsPanelTable
      actionButton={{
        className: 'btn_delete',
        label: 'Remove',
        icon: <Delete />,
        onClick: selectedItem => {
          handleDeleteEntity(selectedItem)
        }
      }}
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
              required={!isEntityNameValid}
              requiredText="Entity name already exists"
              type="text"
            />
            <Select
              onClick={setNewItemValue}
              selectedId={data.newEntity.value_type}
              options={typeOptions}
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
          text="entity"
        />
      )}
    </FeatureSetsPanelTable>
  )
}

FeatureSetsPanelSchemaTable.defaultProps = {
  className: '',
  selectedId: ''
}

FeatureSetsPanelSchemaTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.shape({}).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteEntity: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isEntityNameValid: PropTypes.bool.isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setNewItemName: PropTypes.func.isRequired,
  setNewItemValue: PropTypes.func.isRequired
}

import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'

import { ReactComponent as Plus } from '../../images/plus.svg'

export const JobsPanelAdvancedTable = ({
  addNewItem,
  className,
  content,
  handleAddNewItem,
  handleEditItems,
  handleDeleteItems,
  headers,
  match,
  section,
  selectedItem,
  setAddNewItem,
  setNewItemName,
  setNewItemValue,
  setSelectedItem
}) => {
  return (
    <JobsPanelTable
      addNewItem={addNewItem}
      className={className}
      content={content}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      headers={headers}
      match={match}
      section={section}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    >
      {addNewItem ? (
        <div className="table__row-add-item">
          <div className="input-row-wrapper">
            <Input
              onChange={setNewItemName}
              label="Name"
              className="input-row__item"
              floatingLabel
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
          <button
            className="add-input btn-add"
            onClick={() => handleAddNewItem(true)}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
        </div>
      ) : (
        <JobsPanelTableAddItemRow
          onClick={setAddNewItem}
          text="environment variable"
        />
      )}
    </JobsPanelTable>
  )
}

JobsPanelAdvancedTable.defaultProps = {
  className: ''
}

JobsPanelAdvancedTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape).isRequired,
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setNewItemName: PropTypes.func.isRequired,
  setNewItemValue: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired
}

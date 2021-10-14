import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'
import Select from '../../common/Select/Select'

import { selectOptions } from '../../components/JobsPanelAdvanced/jobsPanelAdvanced.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Plus } from '../../images/plus.svg'

export const JobsPanelAdvancedTable = ({
  addNewItem,
  className,
  content,
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handleResetForm,
  headers,
  match,
  newName,
  section,
  selectedId,
  selectedItem,
  setAddNewItem,
  setNewItemName,
  setNewItemValue,
  setSelectedItem,
  setValidation,
  validation
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
      setValidation={setValidation}
      validation={validation}
    >
      {addNewItem ? (
        <div className="table__row-add-item">
          <div className="input-row-wrapper">
            {section.includes('secrets') ? (
              <Select
                density="medium"
                onClick={setNewItemName}
                label={selectedId.length ? selectedId : 'Kind'}
                options={selectOptions.secretKind}
              />
            ) : (
              <Input
                className="input-row__item"
                density="medium"
                floatingLabel
                invalid={
                  isNameNotUnique(newName, content) ||
                  !validation.envVariablesName
                }
                invalidText={
                  isNameNotUnique(newName, content)
                    ? 'Name already exists'
                    : 'This field is invalid'
                }
                label="Name"
                onChange={setNewItemName}
                required
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    envVariablesName: value
                  }))
                }
                type="text"
              />
            )}
            <Input
              className="input-row__item input-row__item_edit"
              density="medium"
              floatingLabel
              invalid={!validation.secretsSourceValue}
              label="Value"
              onChange={setNewItemValue}
              required
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  secretsSourceValue: value
                }))
              }
              type="text"
            />
          </div>
          <button
            className="btn-add"
            disabled={isNameNotUnique(newName, content)}
            onClick={handleAddNewItem}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
          <button onClick={handleResetForm}>
            <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
              <Delete />
            </Tooltip>
          </button>
        </div>
      ) : (
        <JobsPanelTableAddItemRow onClick={setAddNewItem} text="secret" />
      )}
    </JobsPanelTable>
  )
}

JobsPanelAdvancedTable.defaultProps = {
  className: '',
  newName: '',
  selectedId: ''
}

JobsPanelAdvancedTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape).isRequired,
  match: PropTypes.shape({}).isRequired,
  newName: PropTypes.string,
  section: PropTypes.string.isRequired,
  selectedId: PropTypes.string,
  selectedItem: PropTypes.shape({}).isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setNewItemName: PropTypes.func.isRequired,
  setNewItemValue: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

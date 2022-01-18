import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import { selectOptions } from '../../components/JobsPanelAdvanced/jobsPanelAdvanced.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableAdvancedRow = ({
  content,
  handleEdit,
  index,
  selectedItem,
  setEditItem,
  setSelectedItem,
  setValidation,
  table,
  validation
}) => {
  const dataValue = table === 'env' ? 'value' : 'source'
  const validationKey =
    table === 'env' ? 'envVariablesValue' : 'secretsSourceValue'
  const tableRowRef = useRef(null)

  const handleDocumentClick = useCallback(
    event => {
      if (!tableRowRef.current?.contains(event.target)) {
        setEditItem(false)
        setSelectedItem({})
      }
    },
    [setEditItem, setSelectedItem]
  )

  useEffect(() => {
    if (tableRowRef.current) {
      window.addEventListener('click', handleDocumentClick)

      return () => {
        window.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, tableRowRef])

  return (
    <div className="table__row edit-row" ref={tableRowRef}>
      <div className="table__cell table__cell_edit">
        {table === 'env' ? (
          <Input
            density="dense"
            invalid={
              (selectedItem.newName !== selectedItem.data.name &&
                isNameNotUnique(selectedItem.newName, content)) ||
              !validation.envVariablesName
            }
            invalidText={
              isNameNotUnique(selectedItem.newName, content)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            onChange={name =>
              setSelectedItem({
                ...selectedItem,
                newName: name
              })
            }
            required
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                envVariablesName: value
              }))
            }
            type="text"
            value={selectedItem.newName ?? selectedItem.data.name}
          />
        ) : (
          <Select
            density="dense"
            label={
              selectedItem.newKind
                ? selectedItem.newKind
                : selectedItem.data.kind
            }
            onClick={kind =>
              setSelectedItem({
                ...selectedItem,
                newKind: kind
              })
            }
            options={selectOptions.secretKind}
          />
        )}
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          density="dense"
          invalid={!validation[validationKey]}
          onChange={value =>
            setSelectedItem({
              ...selectedItem,
              data: { ...selectedItem.data, [dataValue]: value }
            })
          }
          required
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              [validationKey]: value
            }))
          }
          type="text"
          value={selectedItem.data[dataValue]}
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={
            (selectedItem.newName !== selectedItem.data.name &&
              isNameNotUnique(selectedItem.newName, content)) ||
            (table === 'env' && !validation.envVariablesName) ||
            !validation[validationKey]
          }
          onClick={() => handleEdit(selectedItem.data, index)}
        >
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark />
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

EditableAdvancedRow.propTypes = {
  content: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default EditableAdvancedRow

/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { selectOptions } from '../../components/JobsPanelAdvanced/jobsPanelAdvanced.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'

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
  selectedItem: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default EditableAdvancedRow

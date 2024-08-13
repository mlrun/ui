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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Chip from '../Chip/Chip'

import { deleteUnsafeHtml } from '../../utils'
import { CHIP_INPUT_LIST, CHIP_OPTIONS } from '../../types'

import './chipInput.scss'

const ChipInput = ({
  addChip,
  chipOptions = {
    background: 'grey',
    boldValue: false,
    borderRadius: 'secondary',
    borderColor: 'transparent',
    density: 'dense',
    font: 'primary'
  },
  className,
  elements = [],
  isDeleteMode = true,
  onInputChange,
  placeholder = '',
  removeChip = () => {},
  suggestionList
}) => {
  const [typedValue, setTypedValue] = useState('')
  const [filteredSuggestionList, setFilteredSuggestionList] = useState([])
  const [showSuggestionList, setShowSuggestionList] = useState(false)

  const inputContainerRef = useRef(null)
  const inputRef = useRef(null)

  const inputContainerClassNames = classnames('chips-input-container', className)
  const autoResizeInputClassNames = classnames(
    'auto-resizable-input',
    elements.length === 0 && 'full-width'
  )

  useEffect(() => {
    const filteredList = suggestionList.filter(suggestionItem => {
      return (
        suggestionItem.label.toLowerCase().includes(typedValue.toLowerCase()) &&
        !elements.find(element => element.id === suggestionItem.id)
      )
    })

    setFilteredSuggestionList(filteredList)
  }, [elements, suggestionList, typedValue])

  useEffect(() => {
    setShowSuggestionList(typedValue && filteredSuggestionList.length > 0)
  }, [filteredSuggestionList.length, typedValue])

  const handleAddChip = useCallback(
    suggestionItem => {
      if (!suggestionItem.disabled) {
        addChip(suggestionItem)
        setTypedValue('')
      }
    },
    [addChip]
  )

  const handleInputChange = useCallback(
    event => {
      const newValue = deleteUnsafeHtml(event.target.value)
      event.target.parentNode.dataset.value = event.target.value

      setTypedValue(newValue)
      onInputChange(newValue)
    },
    [onInputChange]
  )

  const handleRemoveChip = useCallback(
    (event, chipIndex) => {
      removeChip(chipIndex)
    },
    [removeChip]
  )

  return (
    <div
      className={inputContainerClassNames}
      ref={inputContainerRef}
      onClick={() => {
        inputRef.current.focus()
      }}
    >
      {elements.map((chip, index) => {
        return (
          <Chip
            chip={{ value: chip.label, id: chip.id }}
            chipIndex={index}
            chipOptions={chipOptions}
            handleRemoveChip={handleRemoveChip}
            isDeleteMode={isDeleteMode}
            key={`${chip.value}${index}`}
            ref={inputContainerRef}
            showChips
          />
        )
      })}
      <div className={autoResizeInputClassNames}>
        <input
          autoComplete="off"
          name="chip-input"
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          placeholder={elements.length === 0 ? placeholder : ''}
          value={typedValue}
        />
      </div>
      {showSuggestionList && (
        <div className="suggestion-list">
          {filteredSuggestionList.map(suggestionItem => {
            const suggestionRowClassNames = classnames(
              'suggestion-row',
              suggestionItem.disabled && 'disabled'
            )
            return (
              <div
                className={suggestionRowClassNames}
                key={suggestionItem.id}
                onClick={() => {
                  handleAddChip(suggestionItem)
                }}
              >
                <div className="suggestion-row-value">
                  {suggestionItem.icon && (
                    <div className="suggestion-row-icon">{suggestionItem.icon}</div>
                  )}
                  <div
                    className="suggestion-row-label"
                    dangerouslySetInnerHTML={{
                      __html: suggestionItem.label.replace(new RegExp(typedValue, 'gi'), match =>
                        match ? `<b>${match}</b>` : match
                      )
                    }}
                  />
                </div>
                {suggestionItem.subLabel && (
                  <div className="suggestion-row-sub-label">{suggestionItem.subLabel}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

ChipInput.propTypes = {
  addChip: PropTypes.func.isRequired,
  chipOptions: CHIP_OPTIONS,
  className: PropTypes.string,
  elements: CHIP_INPUT_LIST,
  isDeleteMode: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  removeChip: PropTypes.func.isRequired,
  suggestionList: CHIP_INPUT_LIST.isRequired
}

export default React.memo(ChipInput)

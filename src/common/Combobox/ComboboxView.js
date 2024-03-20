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
import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { COMBOBOX_MATCHES } from '../../types'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'
import { ReactComponent as SearchIcon } from 'igz-controls/images/search.svg'
import { ReactComponent as ExclamationMarkIcon } from 'igz-controls/images/exclamation-mark.svg'

const ComboboxView = React.forwardRef(
  (
    {
      comboboxClassName,
      disabled,
      dropdownList,
      dropdownStyle,
      handleIconClick,
      handleInputOnChange,
      handleMatchesOptionClick,
      handleSelectOptionOnClick,
      hideSearchInput,
      inputOnFocus,
      inputPlaceholder,
      inputValue,
      invalidText,
      isInvalid,
      matchesSearchOnChange,
      required,
      requiredText,
      searchIsFocused,
      selectDropdownList,
      selectPlaceholder,
      selectValue,
      setSearchIsFocused,
      showMatchesDropdown,
      showSelectDropdown
    },
    ref
  ) => {
    const comboboxClassNames = classnames(
      comboboxClassName,
      'combobox',
      isInvalid && !disabled && 'combobox_invalid',
      disabled && 'combobox_disabled'
    )
    const iconClassNames = classnames(showSelectDropdown && 'combobox-icon_open', 'combobox-icon')
    const selectClassNames = classnames(
      'combobox-select',
      showSelectDropdown && 'combobox-select_open',
      selectValue.id.length <= 5 && selectValue.id.length !== 0 && 'combobox-select_short'
    )
    const dropdownClassNames = classnames(
      'combobox-dropdown',
      showMatchesDropdown &&
        (dropdownList.length > 0 || searchIsFocused) &&
        'combobox-dropdown_visible'
    )
    const { comboboxRef, inputRef } = ref

    return (
      <div className={comboboxClassNames} ref={comboboxRef}>
        <Arrow className={iconClassNames} onClick={handleIconClick} />
        <div className={selectClassNames}>
          <div className="combobox-select__header" onClick={handleIconClick}>
            <span className={`${selectValue.className}`}>{selectValue.id}</span>
            {selectValue.id.length === 0 && (
              <span className="combobox-select__header-label">
                {selectPlaceholder}
                {required && <span className="combobox-select__header-label_mandatory">*</span>}
              </span>
            )}
          </div>
          <div className="combobox-select__body">
            <ul className="combobox-select__body-list combobox-list">
              {selectDropdownList.map(option => (
                <li
                  className={`combobox-list__option ${option.className}`}
                  key={option.id}
                  onClick={() => handleSelectOptionOnClick(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <input
          className="combobox-input"
          disabled={selectValue.id.length === 0 || disabled}
          onChange={handleInputOnChange}
          onFocus={inputOnFocus}
          placeholder={inputPlaceholder}
          ref={inputRef}
          type="text"
          value={inputValue}
        />
        <div
          className={dropdownClassNames}
          style={{
            ...dropdownStyle
          }}
        >
          {!hideSearchInput && (
            <div className="combobox-dropdown__search">
              <input
                className="combobox-dropdown__search-input input border-none"
                onChange={event => matchesSearchOnChange(event)}
                onFocus={() => setSearchIsFocused(true)}
                placeholder="Type to search"
                type="text"
              />
              <SearchIcon />
            </div>
          )}
          <ul className="combobox-dropdown__list combobox-list">
            {searchIsFocused && dropdownList.length === 0 ? (
              <li className="combobox-list__option" key="no data">
                No data
              </li>
            ) : (
              dropdownList.map(value => (
                <li
                  className="combobox-list__option"
                  key={value.id}
                  onClick={() => handleMatchesOptionClick(value)}
                >
                  {value.label}
                </li>
              ))
            )}
          </ul>
        </div>
        {isInvalid && !disabled && (
          <Tooltip
            className="combobox-warning"
            template={
              <TextTooltipTemplate
                text={required && selectValue.id.length === 0 ? requiredText : invalidText}
                warning
              />
            }
          >
            <ExclamationMarkIcon />
          </Tooltip>
        )}
      </div>
    )
  }
)

ComboboxView.propTypes = {
  comboboxClassName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dropdownList: COMBOBOX_MATCHES.isRequired,
  dropdownStyle: PropTypes.shape({}).isRequired,
  handleIconClick: PropTypes.func.isRequired,
  handleInputOnChange: PropTypes.func.isRequired,
  handleMatchesOptionClick: PropTypes.func.isRequired,
  handleSelectOptionOnClick: PropTypes.func.isRequired,
  hideSearchInput: PropTypes.bool.isRequired,
  inputOnFocus: PropTypes.func.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  invalidText: PropTypes.string.isRequired,
  isInvalid: PropTypes.bool.isRequired,
  matchesSearchOnChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  requiredText: PropTypes.string.isRequired,
  searchIsFocused: PropTypes.bool.isRequired,
  selectDropdownList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectPlaceholder: PropTypes.string.isRequired,
  selectValue: PropTypes.shape({}).isRequired,
  setSearchIsFocused: PropTypes.func.isRequired,
  showMatchesDropdown: PropTypes.bool.isRequired,
  showSelectDropdown: PropTypes.bool.isRequired
}

export default ComboboxView

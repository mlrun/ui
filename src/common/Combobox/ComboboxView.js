import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { COMBOBOX_MATCHES } from '../../types'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { ReactComponent as Invalid } from '../../images/invalid.svg'

const ComboboxView = React.forwardRef(
  (
    {
      comboboxClassName,
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
      isInvalid && 'combobox_invalid'
    )
    const iconClassNames = classnames(
      showSelectDropdown && 'combobox-icon_open',
      'combobox-icon'
    )
    const selectClassNames = classnames(
      'combobox-select',
      showSelectDropdown && 'combobox-select_open',
      selectValue.id.length <= 5 &&
        selectValue.id.length !== 0 &&
        'combobox-select_short'
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
                {required && (
                  <span className="combobox-select__header-label_mandatory">
                    *
                  </span>
                )}
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
          disabled={selectValue.id.length === 0}
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
        {isInvalid && (
          <Tooltip
            className="combobox-warning"
            template={
              <TextTooltipTemplate
                text={
                  required && selectValue.id.length === 0
                    ? requiredText
                    : invalidText
                }
                warning
              />
            }
          >
            <Invalid />
          </Tooltip>
        )}
      </div>
    )
  }
)

ComboboxView.propTypes = {
  comboboxClassName: PropTypes.string.isRequired,
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

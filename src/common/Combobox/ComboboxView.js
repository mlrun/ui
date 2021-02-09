import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as SearchIcon } from '../../images/search.svg'

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
      inputOnFocus,
      inputPlaceholder,
      inputValue,
      matchesSearchOnChange,
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
    const comboboxClassNames = classnames(comboboxClassName, 'combobox')
    const iconClassNames = classnames(
      showSelectDropdown && 'combobox-icon_open',
      'combobox-icon'
    )
    const selectClassNames = classnames(
      'combobox-select',
      showSelectDropdown && 'combobox-select_open',
      selectValue.id.length <= 5 && 'combobox-select_short'
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
        <Arrow
          className={iconClassNames}
          onClick={() => {
            handleIconClick()
          }}
        />
        <div className={selectClassNames}>
          <div className="combobox-select__header">
            <span className={`${selectValue.className}`}>{selectValue.id}</span>
            {selectValue.id.length === 0 && (
              <span className="combobox-select__header-label">
                {selectPlaceholder}
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
                  onClick={() => handleMatchesOptionClick(value.id)}
                >
                  {value.label}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    )
  }
)

ComboboxView.propTypes = {
  comboboxClassName: PropTypes.string.isRequired,
  dropdownList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dropdownStyle: PropTypes.shape({}).isRequired,
  handleIconClick: PropTypes.func.isRequired,
  handleInputOnChange: PropTypes.func.isRequired,
  handleMatchesOptionClick: PropTypes.func.isRequired,
  handleSelectOptionOnClick: PropTypes.func.isRequired,
  inputOnFocus: PropTypes.func.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  matchesSearchOnChange: PropTypes.func.isRequired,
  searchIsFocused: PropTypes.bool.isRequired,
  selectDropdownList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectPlaceholder: PropTypes.string.isRequired,
  selectValue: PropTypes.shape({}).isRequired,
  setSearchIsFocused: PropTypes.func.isRequired,
  showMatchesDropdown: PropTypes.bool.isRequired,
  showSelectDropdown: PropTypes.bool.isRequired
}

export default ComboboxView

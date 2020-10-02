import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import ComboboxView from './ComboboxView'

import './combobox.scss'
const Combobox = ({
  comboboxClassName,
  selectDropdownList,
  inputPlaceholder,
  matches,
  inputOnChange,
  selectOnChange,
  selectPlaceholder
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [dropdownStyle, setDropdownStyle] = useState({
    position: 'absolute',
    top: '40px',
    left: 0,
    paddingTop: '10px'
  })
  const [showSelectDropdown, setShowSelectDropdown] = useState(false)
  const [showMatchesDropdown, setShowMatchesDropdown] = useState(false)
  const [dropdownList, setDropdownList] = useState(matches)
  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const comboboxRef = React.createRef()

  useEffect(() => {
    if (!searchIsFocused) {
      if (JSON.stringify(dropdownList) !== JSON.stringify(matches)) {
        setDropdownList(matches)
      }
    }
  }, [dropdownList, matches, searchIsFocused])
  const handleOnBlur = useCallback(
    event => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        if (showSelectDropdown) {
          setShowSelectDropdown(false)
        }

        if (showMatchesDropdown) {
          setShowMatchesDropdown(false)
        }

        if (searchIsFocused) {
          setSearchIsFocused(false)
        }
      }
    },
    [comboboxRef, searchIsFocused, showMatchesDropdown, showSelectDropdown]
  )

  useEffect(() => {
    window.addEventListener('click', handleOnBlur)

    return () => {
      window.removeEventListener('click', handleOnBlur)
    }
  }, [handleOnBlur])

  const handleMatchesOptionClick = option => {
    const inputValueItems = inputValue.split('/')
    inputValueItems[inputValueItems.length - 1] = option

    if (searchIsFocused) {
      setSearchIsFocused(false)
    }

    setInputValue(inputValueItems.join('/'))
    setShowMatchesDropdown(false)
    inputOnChange(inputValueItems.join('/'))
  }

  const handleSelectOptionOnClick = option => {
    if (selectValue.length > 0) {
      setInputValue('')
    }

    setSelectValue(option)
    selectOnChange(option)
    setShowSelectDropdown(false)
  }

  const handleIconClick = () => {
    if (showMatchesDropdown) {
      setShowMatchesDropdown(false)
    }

    setDropdownStyle(state => ({
      ...state,
      left: 0,
      paddingTop: '10px'
    }))
    setShowSelectDropdown(state => !state)
  }

  const inputOnClick = event => {
    if (selectValue.length > 0) {
      handleInputOnChange(event)

      if (showSelectDropdown) {
        setShowSelectDropdown(false)
      }

      setShowMatchesDropdown(true)
    }
  }

  const handleInputOnChange = event => {
    const value = event.target.value
    const div = document.createElement('div')
    div.innerHTML = value
    comboboxRef.current.appendChild(div)

    const rect = div.getBoundingClientRect()

    div.remove()

    setDropdownStyle(state => ({
      ...state,
      left: `${rect.width - 10}px`,
      paddingTop: '0'
    }))

    if (searchIsFocused) {
      setSearchIsFocused(false)
    }

    inputOnChange(value)
    setInputValue(value)
  }
  const matchesSearchOnChange = event => {
    event.persist()
    setDropdownList(() =>
      matches.filter(option => {
        return option.id.startsWith(event.target.value)
      })
    )
  }
  return (
    <ComboboxView
      comboboxClassName={comboboxClassName}
      dropdownList={dropdownList}
      dropdownStyle={dropdownStyle}
      handleIconClick={handleIconClick}
      handleInputOnChange={handleInputOnChange}
      handleMatchesOptionClick={handleMatchesOptionClick}
      handleSelectOptionOnClick={handleSelectOptionOnClick}
      inputOnClick={inputOnClick}
      inputPlaceholder={inputPlaceholder}
      inputValue={inputValue}
      matchesSearchOnChange={matchesSearchOnChange}
      ref={comboboxRef}
      searchIsFocused={searchIsFocused}
      selectDropdownList={selectDropdownList}
      selectPlaceholder={selectPlaceholder}
      selectValue={selectValue}
      setSearchIsFocused={setSearchIsFocused}
      showMatchesDropdown={showMatchesDropdown}
      showSelectDropdown={showSelectDropdown}
    />
  )
}

Combobox.defaultProps = {
  comboboxClassName: '',
  inputPlaceholder: '',
  selectPlaceholder: ''
}

Combobox.propTypes = {
  comboboxClassName: PropTypes.string,
  inputOnChange: PropTypes.func.isRequired,
  inputPlaceholder: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectDropdownList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectOnChange: PropTypes.func.isRequired,
  selectPlaceholder: PropTypes.string
}

export default Combobox

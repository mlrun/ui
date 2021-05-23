import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import ComboboxView from './ComboboxView'

import { COMBOBOX_MATCHES } from '../../types'
import './combobox.scss'

const Combobox = ({
  comboboxClassName,
  inputPlaceholder,
  inputDefaultValue,
  inputOnChange,
  hideSearchInput,
  matches,
  maxSuggestedMatches,
  selectDefaultValue,
  selectDropdownList,
  selectOnChange,
  selectPlaceholder
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState({
    label: '',
    id: '',
    className: ''
  })
  const [dropdownStyle, setDropdownStyle] = useState({
    left: 0,
    paddingTop: '10px'
  })
  const [showSelectDropdown, setShowSelectDropdown] = useState(false)
  const [showMatchesDropdown, setShowMatchesDropdown] = useState(false)
  const [dropdownList, setDropdownList] = useState(matches)
  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const comboboxRef = React.createRef()
  const inputRef = React.createRef()

  useEffect(() => {
    if (
      inputDefaultValue.length > 0 &&
      selectValue.id.length > 0 &&
      inputValue.length === 0
    ) {
      setInputValue(inputDefaultValue)
      inputOnChange(inputDefaultValue)
    }
  }, [
    inputDefaultValue,
    inputOnChange,
    inputValue.length,
    selectValue.id.length
  ])

  useEffect(() => {
    if (
      selectDefaultValue?.label.length > 0 &&
      selectValue.label.length === 0
    ) {
      setSelectValue(selectDefaultValue)
    }
  }, [selectDefaultValue, selectValue.label.length])

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
        event.preventDefault()

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
    const valueIndex = inputValueItems.length - 1
    let formattedValue = option.customDelimiter
      ? inputValueItems[valueIndex].replace(
          new RegExp(`${option.customDelimiter}.*`),
          ''
        ) + option.id
      : option.id

    if (inputValueItems.length <= maxSuggestedMatches - 1) formattedValue += '/'

    inputValueItems[valueIndex] = formattedValue

    if (searchIsFocused) {
      setSearchIsFocused(false)
    }

    if (inputValueItems.join('/') !== inputValue) {
      setInputValue(inputValueItems.join('/'))
    }

    setShowMatchesDropdown(false)
    inputOnChange(inputValueItems.join('/'))
    inputRef.current.focus()
  }

  const handleSelectOptionOnClick = option => {
    if (option.id === selectValue.id) {
      return setShowSelectDropdown(false)
    }

    if (selectValue.id.length > 0) {
      setInputValue('')
    }

    setSelectValue(option)
    selectOnChange(option.id)
    setShowSelectDropdown(false)

    inputRef.current.disabled = false
    inputRef.current.focus()
  }

  const handleIconClick = () => {
    if (showMatchesDropdown) {
      setShowMatchesDropdown(false)
    }

    setDropdownStyle({
      left: 0,
      paddingTop: '10px'
    })
    setShowSelectDropdown(state => !state)
  }

  const inputOnFocus = () => {
    if (showSelectDropdown) {
      setShowSelectDropdown(false)
    }

    setShowMatchesDropdown(true)
  }

  const handleInputOnChange = event => {
    const target = event.target

    inputOnChange(target.value)

    setDropdownStyle({
      left: `${target.selectionStart < 30 ? target.selectionStart : 30}ch`,
      paddingTop: '0'
    })

    if (searchIsFocused) {
      setSearchIsFocused(false)
    }

    setInputValue(target.value)

    if (dropdownList.length > 0) {
      setShowMatchesDropdown(true)
    }
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
      hideSearchInput={hideSearchInput}
      inputOnFocus={inputOnFocus}
      inputPlaceholder={inputPlaceholder}
      inputValue={inputValue}
      matchesSearchOnChange={matchesSearchOnChange}
      ref={{
        comboboxRef: comboboxRef,
        inputRef: inputRef
      }}
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
  inputDefaultValue: '',
  inputPlaceholder: '',
  hideSearchInput: false,
  maxSuggestedMatches: 1,
  selectDefaultValue: null,
  selectPlaceholder: ''
}

Combobox.propTypes = {
  comboboxClassName: PropTypes.string,
  inputDefaultValue: PropTypes.string,
  inputOnChange: PropTypes.func.isRequired,
  inputPlaceholder: PropTypes.string,
  hideSearchInput: PropTypes.bool,
  matches: COMBOBOX_MATCHES.isRequired,
  maxSuggestedMatches: PropTypes.number,
  selectDropdownList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectOnChange: PropTypes.func.isRequired,
  selectDefaultValue: PropTypes.shape({}),
  selectPlaceholder: PropTypes.string
}

export default Combobox

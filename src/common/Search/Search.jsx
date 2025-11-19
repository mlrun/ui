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
import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../Input/Input'
import { SelectOption } from 'igz-controls/elements'
import { PopUpDialog } from 'igz-controls/components'

import { deleteUnsafeHtml } from 'igz-controls/utils/string.util'

import SearchIcon from 'igz-controls/images/search.svg?react'

import './search.scss'

const Search = ({
  className = '',
  disabled = false,
  id = 'search',
  matches = [],
  onChange,
  onFocus = () => {},
  placeholder = '',
  searchWhileTyping = false,
  value = '',
  withoutBorder = false,
  wrapperClassName = ''
}) => {
  const [searchValue, setSearchValue] = useState(value ?? '')
  // const [label, setLabel] = useState('')
  const [inputIsFocused, setInputFocused] = useState(false)
  const [searchWidth, setSearchWidth] = useState(0)
  const [hasMatch, setHasMatch] = useState(false)
  const searchRef = useRef()
  const popUpRef = useRef()
  const searchClassNames = classnames('search-container', className)

  // === Обчислення ширини інпута після монтування ===
  useLayoutEffect(() => {
    if (searchRef.current) {
      const { width } = searchRef.current.getBoundingClientRect()
      setSearchWidth(width)
    }
  }, [])

  const handleSearchOnBlur = useCallback(event => {
    if (
      (event.type === 'click' && searchRef.current && !searchRef.current.contains(event.target)) ||
      (event.type === 'scroll' && popUpRef.current && !popUpRef.current.contains(event.target))
    ) {
      setInputFocused(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('click', handleSearchOnBlur)
    window.addEventListener('scroll', handleSearchOnBlur, true)

    return () => {
      window.removeEventListener('click', handleSearchOnBlur)
      window.removeEventListener('scroll', handleSearchOnBlur, true)
    }
  }, [handleSearchOnBlur])

  // === Основна логіка оновлення значення ===
  const handleSearchChange = value => {
    const cleanValue = deleteUnsafeHtml(value)
    setSearchValue(cleanValue)
    setInputFocused(true)
    onChange(cleanValue)

    const matchExists = matches.some(item =>
      item.toLocaleLowerCase().includes(cleanValue.toLocaleLowerCase())
    )
    setHasMatch(matchExists)
  }

  // === Клік на елемент зі списку ===
  const handleMatchClick = item => {
    setSearchValue(item)
    setHasMatch(false)
    setInputFocused(false)
    onChange(item)
  }

  // === Клік по іконці пошуку ===
  const handleIconClick = event => {
    event.stopPropagation()

    if (searchValue.trim().length > 0) {
      onChange(searchValue)
      setInputFocused(false)
    }
  }

  useEffect(() => {
    if (value !== searchValue) {
      queueMicrotask(() => setSearchValue(value ?? ''))
    }
  }, [searchValue, value])

  const filteredMatches = inputIsFocused
    ? matches.filter(item => item.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
    : []

  return (
    <div
      data-testid="search-container"
      className={searchClassNames}
      ref={searchRef}
      onClick={() => setInputFocused(true)}
    >
      <Input
        className="search-input"
        disabled={disabled}
        id={id}
        wrapperClassName={wrapperClassName}
        density="dense"
        placeholder={placeholder}
        inputIcon={<SearchIcon />}
        iconClass="search-icon"
        iconOnClick={handleIconClick}
        onChange={handleSearchChange}
        onFocus={onFocus}
        focused={inputIsFocused}
        onKeyDown={event => {
          if (event.key === 'Enter' && !searchWhileTyping && searchValue.trim() !== '') {
            onChange(searchValue)
            setInputFocused(false)
          }
        }}
        value={searchValue}
        withoutBorder={withoutBorder}
      />

      {filteredMatches.length > 0 && hasMatch && (
        <PopUpDialog
          ref={popUpRef}
          className="search-dropdown"
          headerIsHidden
          customPosition={{
            element: searchRef,
            position: 'bottom-right'
          }}
          style={{
            maxWidth: `${Math.max(searchWidth, 400)}px`,
            minWidth: `${searchWidth}px`
          }}
        >
          <ul data-testid="search-matches" className="search-matches">
            {filteredMatches.map((item, index) => (
              <SelectOption
                key={item + index}
                item={{
                  id: item,
                  label: item,
                  labelHtml: item.replace(
                    new RegExp(searchValue.toLocaleLowerCase(), 'gi'),
                    match => (match ? `<b>${match}</b>` : match)
                  )
                }}
                name={item}
                onClick={() => handleMatchClick(item)}
                tabIndex={index}
              />
            ))}
          </ul>
        </PopUpDialog>
      )}
    </div>
  )
}

Search.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  searchWhileTyping: PropTypes.bool,
  value: PropTypes.string,
  withoutBorder: PropTypes.bool,
  wrapperClassName: PropTypes.string
}

export default Search

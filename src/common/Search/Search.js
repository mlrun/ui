import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../Input/Input'

import { ReactComponent as SearchIcon } from '../../images/search.svg'

import './search.scss'

const Search = ({
  className,
  matches,
  onChange,
  placeholder,
  searchWhileTyping,
  value
}) => {
  const [searchValue, setSearchValue] = useState(value ?? '')
  const [label, setLabel] = useState('')
  const [inputIsFocused, setInputFocused] = useState(false)
  const searchRef = React.useRef()

  const searchClassNames = classnames('search-container', className)

  const handleSearchOnBlur = useCallback(
    event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setInputFocused(false)
      }
    },
    [searchRef]
  )

  useEffect(() => {
    if (matches.length > 0 && searchValue.length > 0) {
      setLabel(matches.find(item => item.startsWith(searchValue)) ?? '')
    }
  }, [matches, searchValue])

  useEffect(() => {
    window.addEventListener('click', handleSearchOnBlur)

    return () => {
      window.removeEventListener('click', handleSearchOnBlur)
    }
  }, [handleSearchOnBlur])

  const searchOnChange = value => {
    if (value.length === 0 && label.length > 0) {
      setLabel('')
    }

    onChange(value)
    setInputFocused(true)
    setSearchValue(value)
  }

  const matchOnClick = item => {
    setLabel('')
    setSearchValue(item)
    onChange(item)
    setInputFocused(false)
  }

  return (
    <div
      data-testid="search-container"
      className={searchClassNames}
      ref={searchRef}
      onClick={() => {
        setInputFocused(true)
      }}
    >
      <Input
        className="search-input"
        placeholder={placeholder}
        inputIcon={<SearchIcon />}
        iconClass="search-icon"
        onChange={searchOnChange}
        focused={inputIsFocused}
        onKeyDown={event => {
          if (
            event.key === 'Enter' &&
            !searchWhileTyping &&
            searchValue !== ''
          ) {
            onChange(searchValue)
            setInputFocused(false)
          }
        }}
        value={searchValue}
      />

      {label.length > 0 && <label className="search-label">{label}</label>}
      {matches.length > 0 && label.length > 0 && inputIsFocused && (
        <ul data-testid="search-matches" className="search-matches">
          {matches.map((item, index) => {
            return (
              <li
                className="search-matches__item"
                key={item + index}
                onClick={() => matchOnClick(item)}
                tabIndex={index}
                dangerouslySetInnerHTML={{
                  __html: item.replace(new RegExp(searchValue, 'gi'), match =>
                    match ? `<b>${match}</b>` : match
                  )
                }}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}

Search.defaultProps = {
  className: '',
  matches: [],
  placeholder: '',
  searchWhileTyping: false,
  value: ''
}

Search.propTypes = {
  className: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchWhileTyping: PropTypes.bool,
  value: PropTypes.string
}

export default Search

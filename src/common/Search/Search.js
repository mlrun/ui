import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as SearchIcon } from '../../images/search.svg'

import './search.scss'

const Search = ({
  className,
  matches,
  onChange,
  placeholder,
  searchWhileTyping
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [label, setLabel] = useState('')
  const [inputIsFocused, setInputFocused] = useState(false)
  const searchRef = React.createRef()
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
    window.addEventListener('click', handleSearchOnBlur)

    return () => {
      window.removeEventListener('click', handleSearchOnBlur)
    }
  }, [handleSearchOnBlur])

  const searchOnChange = event => {
    if (matches.length > 0) {
      const itemStartsWithValue = matches.find(item =>
        item.startsWith(event.target.value)
      )

      if (itemStartsWithValue && event.target.length > 0) {
        setLabel(itemStartsWithValue)
      } else if (label.length > 0) {
        setLabel('')
      }
    }

    if (event.target.value.length === 0 && label.length > 0) {
      setLabel('')
    }

    onChange(event.target.value)
    setInputFocused(true)
    setSearchValue(event.target.value)
  }

  const matchOnClick = item => {
    setLabel('')
    setSearchValue(item)
    onChange(item)
    setInputFocused(false)
  }

  return (
    <div className={searchClassNames} ref={searchRef}>
      <SearchIcon
        onClick={() => {
          if (searchValue !== '' && !searchWhileTyping) {
            onChange(searchValue)
          }
        }}
      />
      <input
        className="search-input"
        placeholder={placeholder}
        onChange={event => {
          searchOnChange(event)
        }}
        onFocus={() => {
          setInputFocused(true)
        }}
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
      {matches.length > 0 && inputIsFocused && (
        <ul className="search-matches">
          {matches.map((item, index) => {
            const match = item.match(searchValue)

            if (match) {
              const parts = item.split(match[0])

              return (
                <li
                  className="search-matches__item"
                  key={item + index}
                  onClick={() => matchOnClick(item)}
                  tabIndex={index}
                >
                  {parts.map((part, idx) => {
                    if (idx === parts.length - 1) {
                      return part
                    }

                    return (
                      <span key={part + idx}>
                        {part}
                        <b>{match[0]}</b>
                      </span>
                    )
                  })}
                </li>
              )
            } else return null
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
  searchWhileTyping: false
}

Search.propTypes = {
  className: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchWhileTyping: PropTypes.bool
}

export default Search

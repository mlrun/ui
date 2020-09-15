import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as SearchIcon } from '../../images/search.svg'

import './search.scss'

const Search = ({ className, onChange, placeholder, searchWhileTyping }) => {
  const [searchValue, setSearchValue] = useState('')
  const searchClassNames = classnames('search-container', className)
  // const [isSearch, setIsSearch] = useState(false)
  // const [search, setSearch] = useState('')
  // const inputRef = useRef()

  return (
    <div className={searchClassNames}>
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
          setSearchValue(event.target.value)
          onChange(event.target.value)
        }}
        onKeyDown={event => {
          if (
            event.key === 'Enter' &&
            !searchWhileTyping &&
            searchValue !== ''
          ) {
            onChange(searchValue)
          }
        }}
        value={searchValue}
      />
    </div>
  )
}

Search.defaultProps = {
  searchWhileTyping: false
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  searchWhileTyping: PropTypes.bool
}

export default Search

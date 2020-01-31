import React, { useState, useRef } from 'react'
import './search.scss'

const Search = ({ onChange }) => {
  const [isSearch, setIsSearch] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef()
  return (
    <div className="search-container">
      <input
        className={isSearch ? 'activate-search' : 'not-activate-search'}
        value={search}
        onChange={event => setSearch(event.target.value)}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            onChange(search)
            setSearch('')
          }
        }}
        ref={inputRef}
      />
      <button
        onClick={() => {
          setIsSearch(!isSearch)
          if (search !== '') {
            onChange(search)
            setSearch('')
          }
          isSearch === false && inputRef.current.focus()
        }}
      />
    </div>
  )
}

export default Search

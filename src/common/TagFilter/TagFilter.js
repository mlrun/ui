import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import TagFilterDropdown from './TagFilterDropdown'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import { KEY_CODES, TAG_FILTER_LATEST } from '../../constants'

import './tagFilter.scss'

const TagFilter = ({
  label,
  match,
  onChange,
  page,
  tagFilterOptions,
  value
}) => {
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState(TAG_FILTER_LATEST)

  const history = useHistory()
  const tagFilterRef = useRef()

  useEffect(() => {
    setTagFilter(value)
  }, [setTagFilter, match.params.pageTab, value])

  const handlerOverall = useCallback(
    event => {
      if (!event.path.includes(tagFilterRef.current)) {
        if (tagFilter.length <= 0) {
          onChange(TAG_FILTER_LATEST)
          setTagFilter(
            tagFilterOptions.find(tag => tag.id === TAG_FILTER_LATEST).label
          )
        } else {
          const tag = tagFilterOptions.find(tag => tag.id === tagFilter)

          onChange(tag?.id || tagFilter)
          setTagFilter(tag?.label || tagFilter)
        }

        setIsDropDownMenuOpen(false)
      }
    },
    [tagFilter, onChange, tagFilterOptions]
  )

  const handleKeyDown = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      event.preventDefault()

      let searchItem = tagFilterOptions.find(tag => {
        return tagFilter === tag.id
      })

      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}${
            match.params.pageTab ? `/${match.params.pageTab}` : ''
          }`
        )
      }

      setTagFilter(searchItem?.id || event.target.value || TAG_FILTER_LATEST)
      onChange(searchItem?.id || event.target.value || TAG_FILTER_LATEST)
      event.target.blur()
      setIsDropDownMenuOpen(false)
    }
  }

  const handleSelectFilter = tag => {
    if (tag.id !== tagFilter) {
      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }

      setTagFilter(tag.id)
      onChange(tag.id)
    }
  }

  useEffect(() => {
    if (isDropDownMenuOpen) {
      window.addEventListener('mousedown', handlerOverall)
      return () => {
        window.removeEventListener('mousedown', handlerOverall)
      }
    }
  }, [isDropDownMenuOpen, handlerOverall])

  return (
    <div
      className="tag-filter"
      ref={tagFilterRef}
      onClick={() => {
        !isDropDownMenuOpen && setIsDropDownMenuOpen(true)
      }}
    >
      <div className="tag-filter__label">{label}</div>
      <input
        className="tag-filter__input"
        value={tagFilter}
        title={tagFilter?.length >= 14 ? tagFilter : null}
        onChange={event => {
          setTagFilter(event.target.value)
        }}
        onFocus={event => {
          if (event.target.value.length !== 0) {
            event.target.select()
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <div
        className="tag-filter__dropdown-button"
        onClick={() => setIsDropDownMenuOpen(state => !state)}
      >
        <Caret />
      </div>
      {isDropDownMenuOpen && (
        <TagFilterDropdown
          handleSelectFilter={handleSelectFilter}
          setIsDropDownMenuOpen={setIsDropDownMenuOpen}
          tagFilter={tagFilter}
          tagFilterOptions={tagFilterOptions}
        />
      )}
    </div>
  )
}

TagFilter.propTypes = {
  label: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  tagFilterOptions: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired
}

export default TagFilter

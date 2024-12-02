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
import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

import TagFilterDropdown from './TagFilterDropdown'

import { getDefaultCloseDetailsLink } from '../../utils/link-helper.util'
import { KEY_CODES, TAG_FILTER_LATEST } from '../../constants'

import { ReactComponent as Caret } from 'igz-controls/images/dropdown.svg'

import './tagFilter.scss'

const TagFilter = ({ label, onChange, page, tagFilterOptions, value }) => {
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState(TAG_FILTER_LATEST)
  const [tagIsTyped, setTagIsTyped] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const tagFilterRef = useRef()

  useEffect(() => {
    if (tagFilter !== value && !tagIsTyped) {
      setTagFilter(value)
    }
  }, [setTagFilter, value, tagFilter, tagIsTyped])

  const handlerOverall = useCallback(
    event => {
      const elementPath = event.path ?? event.composedPath?.()

      if (!elementPath.includes(tagFilterRef.current)) {
        if (tagFilter.length <= 0) {
          onChange(TAG_FILTER_LATEST)
          setTagFilter(tagFilterOptions.find(tag => tag.id === TAG_FILTER_LATEST).label)
        } else {
          const tag = tagFilterOptions.find(tag => tag.id === tagFilter)

          tagIsTyped && onChange(tag?.id || tagFilter)
          setTagFilter(tag?.label || tagFilter)
        }

        setTagIsTyped(false)
        setIsDropDownMenuOpen(false)
      }
    },
    [tagFilter, onChange, tagFilterOptions, tagIsTyped]
  )

  const handleKeyDown = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      event.preventDefault()

      let searchItem = tagFilterOptions.find(tag => {
        return tagFilter === tag.id
      })

      if (params.jobId || params.name) {
        navigate(getDefaultCloseDetailsLink(params, page))
      }

      setTagFilter(searchItem?.id || event.target.value || TAG_FILTER_LATEST)
      onChange(searchItem?.id || event.target.value || TAG_FILTER_LATEST)
      event.target.blur()
      setIsDropDownMenuOpen(false)
      setTagIsTyped(false)
    }
  }

  const handleSelectFilter = (event, tag) => {
    if (tag.id !== tagFilter) {
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
          setTagIsTyped(true)
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
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  tagFilterOptions: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired
}

export default TagFilter

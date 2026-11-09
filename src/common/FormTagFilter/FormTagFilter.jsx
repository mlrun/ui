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
import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'react-final-form'
import { useSelector } from 'react-redux'
import { isEqual, uniq } from 'lodash-es'
import classnames from 'classnames'

import { PopUpDialog, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getTagFilterOptions } from '../../components/FilterMenuModal/filterMenuModal.settings.js'
import { TAG_FILTER_LATEST } from '../../constants'

import Caret from 'igz-controls/images/dropdown.svg?react'

import './formTagFilters.scss'

const FormTagFilter = ({ content = null, label, name, onlyLatestByDefault = false }) => {
  const { input } = useField(name)
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState(input.value)
  const [listFilter, setListFilter] = useState('')
  const tagFilterRef = useRef()
  const dropdownRef = useRef()
  const previousInputValueRef = useRef(input.value)
  const filtersStore = useSelector(store => store.filtersStore)
  const [dropdownWidth, setDropdownWidth] = useState(200)

  useLayoutEffect(() => {
    if (tagFilterRef?.current) {
      setDropdownWidth(tagFilterRef?.current.getBoundingClientRect().width)
    }
  }, [])

  const options = useMemo(() => {
    const tagFilterOptions = getTagFilterOptions(onlyLatestByDefault)
    let newTagOptions = tagFilterOptions
    let pageTagList = []

    if (filtersStore.tagOptions?.length > 0) {
      const defaultOptionsTags = tagFilterOptions.map(option => option.id)
      pageTagList = [...tagFilterOptions]
      let contentTagList = []

      if (content) {
        contentTagList = uniq(content.map(contentItem => contentItem.tag))
      }

      newTagOptions = [
        ...filtersStore.tagOptions.reduce((acc, tag) => {
          if (!defaultOptionsTags.includes(tag)) {
            if (contentTagList.includes(tag)) {
              pageTagList.push({
                label: tag,
                id: tag
              })
            } else {
              acc.push({
                label: tag,
                id: tag
              })
            }
          }

          return acc
        }, [])
      ]

      if (pageTagList.length > 2) {
        pageTagList[pageTagList.length - 1].className = 'page-tag-list'
      }
    }

    return [...pageTagList, ...newTagOptions]
  }, [content, filtersStore.tagOptions, onlyLatestByDefault])

  const tagOptions = useMemo(() => {
    if (!listFilter) {
      return options
    }

    return options.filter(tag => tag.label.startsWith(listFilter))
  }, [listFilter, options])

  useEffect(() => {
    if (!isEqual(input.value, previousInputValueRef.current)) {
      previousInputValueRef.current = input.value
      setTagFilter(input.value ?? '')
    }
  }, [input.value])

  const handleInputChange = event => {
    const value = event.target.value
    const filteredOptions = options.filter(tag => tag.label.startsWith(value))
    input.onChange(value)
    setTagFilter(value)
    setListFilter(value)
    setIsDropDownMenuOpen(filteredOptions.length !== 0)
  }

  const handleSelectFilter = (event, tag) => {
    event.stopPropagation()

    if (tag.id !== tagFilter) {
      input.onChange(tag.id)
      setTagFilter(tag.id)
    }

    setListFilter('')
    setIsDropDownMenuOpen(false)
  }

  const handlerOverall = useCallback(
    event => {
      const elementPath = event.path ?? event.composedPath?.()
      const tagFilterOptions = getTagFilterOptions(onlyLatestByDefault)

      if (
        !elementPath.includes(tagFilterRef.current) &&
        !dropdownRef.current.contains(event.target)
      ) {
        if (tagFilter.length <= 0) {
          input.onChange(TAG_FILTER_LATEST)
          setTagFilter(tagFilterOptions.find(tag => tag.id === TAG_FILTER_LATEST).label)
        } else {
          const tag = tagFilterOptions.find(tag => tag.id === tagFilter)

          input.onChange(tag?.id || tagFilter)
          setTagFilter(tag?.label || tagFilter)
        }

        setIsDropDownMenuOpen(false)
        setListFilter('')
      }
    },
    [input, onlyLatestByDefault, tagFilter]
  )

  useEffect(() => {
    if (isDropDownMenuOpen) {
      window.addEventListener('mousedown', handlerOverall)
      return () => {
        window.removeEventListener('mousedown', handlerOverall)
      }
    }
  }, [isDropDownMenuOpen, handlerOverall])

  const handleLabelClick = event => {
    event.stopPropagation()
    setIsDropDownMenuOpen(false)
  }

  const toggleDropdown = event => {
    event.stopPropagation()

    if (options.length > 0) {
      setIsDropDownMenuOpen(state => !state)
      setListFilter('')

      if (tagFilter.length === 0) {
        input.onChange(TAG_FILTER_LATEST)
        setTagFilter(
          getTagFilterOptions(onlyLatestByDefault).find(tag => tag.id === TAG_FILTER_LATEST).label
        )
      }
    }
  }

  return (
    <div
      className="form-tag-filter"
      ref={tagFilterRef}
      onClick={() => {
        !isDropDownMenuOpen && options.length > 0 && setIsDropDownMenuOpen(true)
      }}
    >
      <div className="form-tag-filter__label" onClick={handleLabelClick}>
        {label}
      </div>
      <div className="form-tag-filter__input-wrapper">
        <input
          className="form-tag-filter__input"
          value={tagFilter}
          title={tagFilter?.length >= 14 ? tagFilter : null}
          onChange={handleInputChange}
          onFocus={event => {
            if (event.target.value.length !== 0) {
              event.target.select()
            }
          }}
        />
        <div className="form-tag-filter__dropdown-button" onClick={toggleDropdown}>
          <Caret />
        </div>
      </div>
      {isDropDownMenuOpen && (
        <PopUpDialog
          className="form-tag-filter__dropdown"
          headerIsHidden
          customPosition={{
            element: tagFilterRef,
            position: 'bottom-right'
          }}
          ref={dropdownRef}
          style={{ width: `${dropdownWidth}px` }}
        >
          {tagOptions.map(tag => {
            const dropdownItemClassName = classnames(
              'form-tag-filter__dropdown-item',
              tagFilter.length !== 0 &&
                tagFilter === tag.id &&
                'form-tag-filter__dropdown-item_selected',
              tag.className
            )

            return (
              <div
                key={tag.id}
                className={dropdownItemClassName}
                onClick={event => handleSelectFilter(event, tag)}
              >
                <Tooltip template={<TextTooltipTemplate text={tag.label} />}>
                  <span>{tag.label}</span>
                </Tooltip>
              </div>
            )
          })}
        </PopUpDialog>
      )}
    </div>
  )
}

FormTagFilter.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onlyLatestByDefault: PropTypes.bool
}

export default FormTagFilter

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
import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Field, useField } from 'react-final-form'
import { useSelector } from 'react-redux'
import { isEqual } from 'lodash'
import { useParams } from 'react-router-dom'

import TagFilterDropdown from '../TagFilter/TagFilterDropdown'

import { tagFilterOptions } from '../../components/FilterMenu/filterMenu.settings'
import { TAG_FILTER_ALL_ITEMS, TAG_FILTER_LATEST } from '../../constants'

import { ReactComponent as Caret } from 'igz-controls/images/dropdown.svg'

import './formTagFilters.scss'

const FormTagFilter = ({ label, name }) => {
  const { input } = useField(name)
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState(input.value)
  const [tagOptions, setTagOptions] = useState(tagFilterOptions)
  const tagFilterRef = useRef()
  const params = useParams()
  const filtersStore = useSelector(store => store.filtersStore)

  useEffect(() => {
    let newTagOptions = tagFilterOptions

    if (filtersStore.tagOptions?.length > 0) {
      const defaultOptionsTags = tagFilterOptions.map(option => option.id)
      newTagOptions = [
        ...tagFilterOptions,
        ...filtersStore.tagOptions.reduce((acc, tag) => {
          if (!defaultOptionsTags.includes(tag)) {
            acc.push({
              label: tag,
              id: tag
            })
          }

          return acc
        }, [])
      ]
    }

    if (!isEqual(newTagOptions, filtersStore.tagOptions)) {
      setTagOptions(() => newTagOptions)
    }
  }, [filtersStore.tagOptions])

  useEffect(() => {
    if (params.tag && params.tag !== tagFilter && tagFilter !== TAG_FILTER_ALL_ITEMS) {
      setTagFilter(params.tag)
      input.onChange(params.tag)
    }
  }, [input, params.tag, tagFilter])

  const handleInputChange = event => {
    input.onChange(event.target.value)
    setTagFilter(event.target.value)
  }

  const handleSelectFilter = (event, tag) => {
    event.stopPropagation()

    if (tag.id !== tagFilter) {
      input.onChange(tag.id)
      setTagFilter(tag.id)
      setIsDropDownMenuOpen(false)
    }
  }

  const handlerOverall = useCallback(
    event => {
      const elementPath = event.path ?? event.composedPath?.()

      if (!elementPath.includes(tagFilterRef.current)) {
        if (tagFilter.length <= 0) {
          input.onChange(TAG_FILTER_LATEST)
          setTagFilter(tagFilterOptions.find(tag => tag.id === TAG_FILTER_LATEST).label)
        } else {
          const tag = tagFilterOptions.find(tag => tag.id === tagFilter)

          input.onChange(tag?.id || tagFilter)
          setTagFilter(tag?.label || tagFilter)
        }

        setIsDropDownMenuOpen(false)
      }
    },
    [input, tagFilter]
  )

  useEffect(() => {
    if (isDropDownMenuOpen) {
      window.addEventListener('mousedown', handlerOverall)
      return () => {
        window.removeEventListener('mousedown', handlerOverall)
      }
    }
  }, [isDropDownMenuOpen, handlerOverall])

  useEffect(() => {
    if (filtersStore.tagOptions.length > 0) {
      setTagOptions(() => {
        const defaultOptionsTags = tagFilterOptions.map(option => option.id)

        return [
          ...tagFilterOptions,
          ...filtersStore.tagOptions.reduce((acc, tag) => {
            if (!defaultOptionsTags.includes(tag)) {
              acc.push({
                label: tag,
                id: tag
              })
            }

            return acc
          }, [])
        ]
      })
    } else {
      setTagOptions(tagFilterOptions)
    }
  }, [filtersStore.tagOptions])

  return (
    <Field name={name}>
      {({ input, meta }) => (
        <div
          className="form-tag-filter"
          ref={tagFilterRef}
          onClick={() => {
            !isDropDownMenuOpen && setIsDropDownMenuOpen(true)
          }}
        >
          <div className="form-tag-filter__label">{label}</div>
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
            <div
              className="tag-filter__dropdown-button"
              onClick={() => setIsDropDownMenuOpen(state => !state)}
            >
              <Caret />
            </div>
          </div>
          {isDropDownMenuOpen && (
            <TagFilterDropdown
              handleSelectFilter={handleSelectFilter}
              setIsDropDownMenuOpen={setIsDropDownMenuOpen}
              tagFilter={tagFilter}
              tagFilterOptions={tagOptions}
            />
          )}
        </div>
      )}
    </Field>
  )
}

FormTagFilter.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default FormTagFilter

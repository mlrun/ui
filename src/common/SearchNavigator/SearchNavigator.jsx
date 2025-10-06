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
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Search from '../Search/Search'
import { RoundedIcon } from 'igz-controls/components'

import { countMatchesInTemplate, highlightMatches } from './searchNavigator.util'

import Arrow from 'igz-controls/images/arrow.svg?react'
import Close from 'igz-controls/images/close.svg?react'

import './searchNavigator.scss'

const SearchNavigator = ({ promptTemplate, setSearchResult, searchOnChange = null }) => {
  const [matchCount, setMatchCount] = useState(0)
  const [activeMatchIndex, setActiveMatchIndex] = useState(0)
  const [matches, setMatches] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const navigatorCounterClassNames = classnames(
    'search-navigator__counter',
    matchCount > 0 && 'search-navigator__counter_with-divider'
  )

  const clearResults = useCallback(() => {
    setSearchResult(promptTemplate)
    setMatches([])
    setActiveMatchIndex(0)
    setSearchValue('')
    setMatchCount(0)
    searchOnChange?.('')
  }, [promptTemplate, searchOnChange, setSearchResult])

  const searchOnChangeHandler = useCallback(
    value => {
      if (value.length === 0) {
        return clearResults()
      }

      const regex = new RegExp(`(${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      const highlighted = highlightMatches(promptTemplate, regex, 0)
      const jsxMatchCount = countMatchesInTemplate(highlighted, regex)

      setSearchResult(highlighted)
      setMatchCount(jsxMatchCount)
      setMatches(new Array(jsxMatchCount).fill(null))
      setActiveMatchIndex(0)
      setSearchValue(value)
      searchOnChange?.(value)
    },
    [promptTemplate, setSearchResult, searchOnChange, clearResults]
  )

  const highlightMatch = useCallback(
    index => {
      if (!matches.length) return

      const regex = new RegExp(`(${searchValue})`, 'gi')
      const highlighted = highlightMatches(promptTemplate, regex, index)

      setSearchResult(highlighted)
      setActiveMatchIndex(index)
    },
    [matches, promptTemplate, searchValue, setSearchResult]
  )

  const goToPrevMatch = () => {
    if (!matches.length) return

    const prevIndex = (activeMatchIndex - 1 + matchCount) % matchCount

    highlightMatch(prevIndex)
  }

  const goToNextMatch = () => {
    if (!matches.length) return

    const nextIndex = (activeMatchIndex + 1) % matchCount

    highlightMatch(nextIndex)
  }

  useEffect(() => {
    const activeMark = document.querySelector(`mark[data-index="${activeMatchIndex}"]`)

    if (activeMark) {
      activeMark.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [activeMatchIndex])

  return (
    <div className="search-navigator">
      <Search
        onChange={searchOnChangeHandler}
        placeholder="Find in prompt.."
        value={searchValue}
        withoutBorder
      />
      <div className={navigatorCounterClassNames}>
        {matchCount > 0 && `${activeMatchIndex + 1}/${matchCount}`}
      </div>
      {searchValue.length > 0 && (
        <div className="search-navigator__buttons">
          <RoundedIcon
            className="search-navigator__button search-navigator__button_back"
            onClick={goToPrevMatch}
            disabled={matchCount === 0}
          >
            <Arrow />
          </RoundedIcon>
          <RoundedIcon
            className="search-navigator__button search-navigator__button_next"
            onClick={goToNextMatch}
            disabled={matchCount === 0}
          >
            <Arrow />
          </RoundedIcon>
          <RoundedIcon
            className="search-navigator__button search-navigator__button_cancel"
            onClick={clearResults}
            disabled={searchValue.length === 0}
          >
            <Close />
          </RoundedIcon>
        </div>
      )}
    </div>
  )
}

SearchNavigator.propTypes = {
  promptTemplate: PropTypes.array.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  searchOnChange: PropTypes.func
}

export default SearchNavigator

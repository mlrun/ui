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
import { useHistory } from 'react-router-dom'

import ArtifactFilterTreeDropDown from './ArtifactsFilterTreeDropDown'
import { ReactComponent as Caret } from 'igz-controls/images/dropdown.svg'
import { KEY_CODES } from '../../constants'

import './artifactsFilterTree.scss'

const ArtifactFilterTree = ({
  filterTreeOptions,
  label,
  match,
  onChange,
  page,
  value
}) => {
  const [isDropDownMenuOpen, setIsDropDownMenu] = useState(false)
  const [filterTree, setFilterTree] = useState(
    filterTreeOptions.find(tree => tree.id === value)?.label
  )

  const history = useHistory()

  const artifactFilterTreeRef = useRef()

  const handlerOverall = useCallback(
    event => {
      if (!event.path.includes(artifactFilterTreeRef.current)) {
        if (filterTree.length <= 0) {
          onChange('latest')
          setFilterTree(
            filterTreeOptions.find(tree => tree.id === 'latest').label
          )
        } else {
          const tree = filterTreeOptions.find(tree => tree.id === filterTree)
          onChange(tree?.id || filterTree)
          setFilterTree(tree?.label || filterTree)
        }
        setIsDropDownMenu(false)
      }
    },
    [filterTree, onChange, filterTreeOptions]
  )

  const handlerScroll = () => {
    let input = document.getElementsByClassName('artifact_filter_tree')[0]
    setIsDropDownMenu(false)
    input.blur()
  }

  const handleKeyDown = event => {
    if (event.keyCode === KEY_CODES.ENTER) {
      event.preventDefault()

      let searchItem = filterTreeOptions.find(tree => {
        return filterTree.toLowerCase() === tree.id
      })

      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}${
            match.params.pageTab ? `/${match.params.pageTab}` : ''
          }`
        )
      }

      setFilterTree(searchItem?.label || event.target.value || 'latest')
      onChange(searchItem?.id || event.target.value)
      event.target.blur()
      setIsDropDownMenu(false)
    }
  }

  const handleSelectFilter = tree => {
    if (tree.id !== filterTree) {
      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }

      setFilterTree(tree.label)
      onChange(tree.id)
    }
  }

  useEffect(() => {
    if (isDropDownMenuOpen) {
      window.addEventListener('mousedown', handlerOverall)
      window.addEventListener('scroll', handlerScroll)
      return () => {
        window.removeEventListener('scroll', handlerScroll)
        window.removeEventListener('mousedown', handlerOverall)
      }
    }
  }, [isDropDownMenuOpen, handlerOverall])

  return (
    <div
      className="artifact_filter_tree_container"
      ref={artifactFilterTreeRef}
      onClick={() => {
        isDropDownMenuOpen === false && setIsDropDownMenu(true)
      }}
    >
      <div className="artifact_filter_tree_label">{label}</div>
      <input
        className="artifact_filter_tree"
        value={filterTree}
        title={filterTree?.length >= 14 ? filterTree : null}
        onChange={event => {
          setFilterTree(event.target.value)
        }}
        onFocus={event => {
          if (event.target.value.length !== 0) {
            event.target.select()
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <div
        className="drop_down"
        onClick={() => setIsDropDownMenu(!isDropDownMenuOpen)}
      >
        <Caret />
      </div>
      {isDropDownMenuOpen && (
        <ArtifactFilterTreeDropDown
          filterTree={filterTree}
          filterTreeOptions={filterTreeOptions}
          handleSelectFilter={handleSelectFilter}
          setIsDropDownMenu={setIsDropDownMenu}
        />
      )}
    </div>
  )
}

ArtifactFilterTree.propTypes = {
  filterTreeOptions: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default ArtifactFilterTree

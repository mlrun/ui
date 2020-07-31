import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import ArtifactFilterTreeDropDown from './ArtifactsFilterTreeDropDown'
import { ReactComponent as Caret } from '../../images/dropdown.svg'

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
    if (event.keyCode === 13) {
      event.preventDefault()
      const value =
        event.target.value.length > 0 ? event.target.value : 'latest'

      let searchItem = filterTreeOptions.find(tree =>
        RegExp(`^${filterTree}`, 'i').test(tree.id)
      )

      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }

      setFilterTree(searchItem?.label || event.target.value)
      onChange(searchItem?.id || value)
      event.target.blur()
      setIsDropDownMenu(false)
    }
  }

  const handleSelectFilter = tree => {
    if (match.params.jobId || match.params.name) {
      history.push(
        `/projects/${match.params.projectName}/${page.toLowerCase()}`
      )
    }

    setFilterTree(tree.label)
    onChange(tree.id)
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
        title={filterTree.length >= 14 ? filterTree : null}
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

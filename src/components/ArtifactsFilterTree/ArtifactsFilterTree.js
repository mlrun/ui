import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import ArtifactFilterTreeDropDown from './ArtifactsFilterTreeDropDown'
import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './artifactsFilterTree.scss'

const ArtifactFilterTree = ({ items, onChange, value, label, match, page }) => {
  const [isDropDownMenuOpen, setIsDropDownMenu] = useState(false)
  const [filterTree, setFilterTree] = useState(
    items.find(tree => tree.id === value)?.label ?? value
  )

  const history = useHistory()

  const artifactFilterTreeRef = useRef()

  const handlerOverall = event => {
    if (!event.path.includes(artifactFilterTreeRef.current)) {
      setIsDropDownMenu(false)
    }
  }

  const handlerScroll = () => {
    let input = document.getElementsByClassName('artifact_filter_tree')[0]
    setIsDropDownMenu(false)
    input.blur()
  }

  const handleKeyDown = event => {
    if (event.keyCode === 13 && event.target.value.length !== 0) {
      event.preventDefault()

      let searchItem = items.find(tree =>
        RegExp(`^${filterTree}`, 'i').test(tree.id)
      )

      if (match.params.jobId || match.params.name) {
        history.push(
          `/projects/${match.params.projectName}/${page.toLowerCase()}`
        )
      }

      setFilterTree(searchItem?.label || event.target.value)
      onChange(searchItem?.id || event.target.value)
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
  }, [isDropDownMenuOpen])

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
          handleSelectFilter={handleSelectFilter}
          items={items}
          setIsDropDownMenu={setIsDropDownMenu}
          filterTree={filterTree}
        />
      )}
    </div>
  )
}

ArtifactFilterTree.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default ArtifactFilterTree

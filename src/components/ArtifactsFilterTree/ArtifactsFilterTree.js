import React, { useState, useEffect, useRef } from 'react'

import caret from '../../images/caret.png'

import './artifactsfiltertree.scss'

const ArtifactFilterTree = ({ items, onChange, value, label }) => {
  const [isDropDownMenuOpen, setIsDropDownMenu] = useState(false)
  const [filterTree, setFilterTree] = useState(value)

  const artifactFilterTreeRef = useRef()

  const handlerOverall = event => {
    if (!event.path.includes(artifactFilterTreeRef.current)) {
      setIsDropDownMenu(false)
    }
  }

  const handlerScroll = event => {
    let input = document.getElementsByClassName('artifact_filter_tree')[0]
    setIsDropDownMenu(false)
    input.blur()
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
        onKeyDown={event => {
          if (event.keyCode === 13 && event.target.value.length !== 0) {
            event.preventDefault()
            let searchItem = items.filter(item =>
              RegExp(`^${filterTree}`, 'i').test(item)
            )[0]
            setFilterTree(searchItem || event.target.value)
            onChange(searchItem || event.target.value)
            event.target.blur()
            setIsDropDownMenu(false)
          }
        }}
      />
      <div
        className="drop_down"
        onClick={() => setIsDropDownMenu(!isDropDownMenuOpen)}
      >
        <img src={caret} alt="caret" />
      </div>
      {isDropDownMenuOpen && (
        <div
          className="drop_down_menu"
          onClick={() => setIsDropDownMenu(false)}
        >
          {items.map(item => {
            return (
              <div
                key={item}
                className={`drop_down_menu_item
                  ${
                    filterTree.length !== 0
                      ? RegExp(`^${filterTree}`, 'i').test(item) &&
                        ' select_item'
                      : ''
                  }
              `}
                onClick={() => {
                  setFilterTree(item)
                  onChange(item)
                }}
              >
                {item}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ArtifactFilterTree

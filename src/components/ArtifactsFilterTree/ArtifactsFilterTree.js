import React, { useState, useEffect } from 'react'

import caret from '../../images/caret.png'

import './artifactsfiltertree.scss'

const ArtifactFilterTree = ({ items, onChange, value }) => {
  const [isDropDownMenuOpen, setIsDropDownMenu] = useState(false)
  const [filterTree, setFilterTree] = useState(value)

  const handlerOverall = event => {
    if (
      !event.target.parentNode.getAttribute('drop_down') || // if expressions !true it's means user click by drop-down-box
      event.target.parentNode.getAttribute('drop_down') === null //if expressions true it's means user click outside drop-down-box
    ) {
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
      drop_down="true"
      className="artifact_filter_tree_container"
      onClick={() => {
        isDropDownMenuOpen === false && setIsDropDownMenu(true)
      }}
    >
      <div className="artifact_filter_tree_label">Tree :</div>
      <input
        className="artifact_filter_tree"
        value={filterTree}
        onChange={event => {
          setFilterTree(event.target.value)
        }}
        onFocus={event => {
          if (event.target.value.length !== 0) {
            event.target.select()
          }
        }}
        onKeyDown={event => {
          if (event.keyCode === 13) {
            event.preventDefault()
            let searchItem = items.filter(item =>
              RegExp(`^${filterTree}`, 'i').test(item)
            )[0]
            if (searchItem) {
              setFilterTree(searchItem)
              onChange(searchItem)
              event.target.blur()
              setIsDropDownMenu(false)
            }
          }
        }}
      />
      <div
        className="drop_down"
        drop_down="true"
        onClick={() => setIsDropDownMenu(!isDropDownMenuOpen)}
      >
        <img src={caret} alt="caret" />
      </div>
      {isDropDownMenuOpen && (
        <div
          drop_down="true"
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
                      ? RegExp(`^${filterTree}`, 'i').test(item) && ' select'
                      : ''
                  }
              `}
                onClick={event => {
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

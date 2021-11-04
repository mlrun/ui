import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SelectOption from '../../elements/SelectOption/SelectOption'

import { ReactComponent as Caret } from '../../images/dropdown.svg'
import { ReactComponent as Arrow } from '../../images/back-arrow.svg'

import './sort.scss'

const Sort = ({
  isDescendingOrder,
  onSelectOption,
  options,
  selectedId,
  setIsDescendingOrder
}) => {
  const [isBodyOpen, setIsBodyOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState({})
  const labelRef = useRef(null)
  const arrowDirectionClassName = classNames(
    isDescendingOrder ? 'sort_down' : 'sort_up'
  )

  useEffect(() => {
    setSelectedOption(options.find(option => option.id === selectedId))
  }, [options, selectedId])

  const handleDocumentClick = useCallback(
    event => {
      if (
        event.target &&
        !labelRef.current?.contains(event.target) &&
        isBodyOpen
      ) {
        setIsBodyOpen(false)
      }
    },
    [isBodyOpen]
  )

  useEffect(() => {
    if (labelRef.current) {
      document.addEventListener('click', handleDocumentClick)

      return () => {
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, labelRef])

  return (
    <div className="sort">
      <div className="btn-group">
        <button
          className="btn-tertiary btn__sort"
          onClick={() => setIsDescendingOrder(state => !state)}
          ref={labelRef}
        >
          <Arrow className={arrowDirectionClassName} />
          <span>{selectedOption.label}</span>
        </button>
        <button
          className="btn-tertiary btn__dropdown"
          onClick={() => setIsBodyOpen(state => !state)}
        >
          <Caret />
        </button>
      </div>
      {isBodyOpen && (
        <div className="sort__body" onClick={() => setIsBodyOpen(false)}>
          {options.map(option => {
            return (
              <SelectOption
                withSelectedIcon
                item={option}
                key={option.id}
                onClick={onSelectOption}
                selectType=""
                selectedId={selectedOption.id}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

Sort.propTypes = {
  isDescendingOrder: PropTypes.bool.isRequired,
  onSelectOption: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectedId: PropTypes.string.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired
}

export default Sort

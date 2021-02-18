import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SelectOption from '../../elements/SelectOption/SelectOption'

import { ReactComponent as Arrow } from '../../images/back-arrow.svg'

import './sort.scss'

const Sort = ({
  isDescendingOrder,
  onClickHandler,
  options,
  selectedValue,
  setIsDescendingOrder
}) => {
  const [isOpenBody, setOpenBody] = useState(false)
  const labelRef = useRef(null)
  const arrowDirectionClassName = classNames(
    isDescendingOrder && 'sort__down',
    !isDescendingOrder && 'sort__up'
  )

  const handleDocumentClick = useCallback(
    event => {
      if (
        event.target &&
        !labelRef.current?.contains(event.target) &&
        isOpenBody
      ) {
        setOpenBody(false)
      }
    },
    [isOpenBody, labelRef]
  )

  useEffect(() => {
    if (labelRef.current) {
      document.addEventListener('click', handleDocumentClick)

      return () => {
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, labelRef])

  const handleCloseSortBody = useCallback(event => {
    event.stopPropagation()

    setOpenBody(false)
  }, [])

  return (
    <div className="sort">
      <div className="sort__header">
        <div onClick={() => setOpenBody(!isOpenBody)} ref={labelRef}>
          {selectedValue.label}
        </div>
        <button onClick={() => setIsDescendingOrder(!isDescendingOrder)}>
          <Arrow className={arrowDirectionClassName} />
        </button>
      </div>
      {isOpenBody && (
        <>
          <div className="sort__body" onClick={handleCloseSortBody}>
            {options.map(option => {
              return (
                <SelectOption
                  item={option}
                  key={option.id}
                  onClick={selectedOption => onClickHandler(selectedOption)}
                  selectType=""
                  selectedId={selectedValue.id}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

Sort.propTypes = {
  isDescendingOrder: PropTypes.bool.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectedValue: PropTypes.shape({}).isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired
}

export default Sort

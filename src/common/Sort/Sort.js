import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import GroupButton from '../SplitButton/SplitButton'

import { ReactComponent as ArrowIcon } from '../../images/back-arrow.svg'

import './sort.scss'

const Sort = ({
  isDescendingOrder,
  onSelectOption,
  options,
  selectedId,
  setIsDescendingOrder
}) => {
  const [selectedOption, setSelectedOption] = useState({})
  const arrowDirectionClassName = classNames(
    isDescendingOrder ? 'sort_down' : 'sort_up'
  )

  useEffect(() => {
    setSelectedOption(options.find(option => option.id === selectedId))
  }, [options, selectedId])

  const mainButton = {
    icon: ArrowIcon,
    iconClassName: arrowDirectionClassName,
    label: selectedOption?.label || 'Sort',
    onClick: () => setIsDescendingOrder(state => !state)
  }

  return (
    <div className="sort">
      <GroupButton
        mainButton={mainButton}
        additionalButton={{
          onSelectOption,
          options,
          selectedOption
        }}
      />
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

import React, { useEffect, useState, useRef } from 'react'
import { isEmpty } from 'lodash'

import Button from '../Button/Button'
import OptionsMenu from '../OptionsMenu/OptionsMenu'
import SelectOption from '../../elements/SelectOption/SelectOption'

import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'

import { MAIN_SPLIT_BUTTON, ADDITIONAL_SPLIT_BUTTON } from '../../types'
import { TERTIARY_BUTTON } from '../../constants'

import { ReactComponent as CaretIcon } from '../../images/dropdown.svg'

import './splitButton.scss'

const SplitButton = ({ mainButton, additionalButton }) => {
  const { onClick: mainAction, ...mainProps } = mainButton
  const {
    icon,
    options,
    onSelectOption,
    selectedOption,
    ...additionalProps
  } = additionalButton

  const [isBodyOpen, setIsBodyOpen] = useState(false)
  const mainRef = useRef()
  useDetectOutsideClick(mainRef, () => setIsBodyOpen(false))

  const handleScroll = event => {
    if (!event.target.closest('.options-menu')) {
      setIsBodyOpen(false)
    }
  }

  const handleMainAction = () => {
    mainAction()
    setIsBodyOpen(false)
  }

  useEffect(() => {
    if (isBodyOpen) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isBodyOpen])

  return (
    <div className="split-btn" ref={mainRef}>
      <div className="split-btn__header">
        <div className="split-btn__button">
          <Button {...mainProps} onClick={handleMainAction} />
        </div>
        <div className="split-btn__button">
          <Button
            {...additionalProps}
            icon={icon ?? <CaretIcon />}
            onClick={() => setIsBodyOpen(state => !state)}
          />
        </div>
      </div>
      {!isEmpty(options) && (
        <OptionsMenu show={isBodyOpen} ref={mainRef}>
          {options.map(option => {
            return (
              <SelectOption
                withSelectedIcon
                item={option}
                key={option.id}
                onClick={onSelectOption}
                selectType=""
                selectedId={selectedOption?.id}
              />
            )
          })}
        </OptionsMenu>
      )}
    </div>
  )
}

SplitButton.defaultProps = {
  mainButton: {
    label: 'Main',
    onClick: () => {},
    variant: TERTIARY_BUTTON
  },
  additionalButton: {
    icon: <CaretIcon />,
    label: '',
    options: [],
    onSelectOption: () => {},
    selectedOption: {},
    variant: TERTIARY_BUTTON
  }
}

SplitButton.propTypes = {
  mainButton: MAIN_SPLIT_BUTTON,
  additionalButton: ADDITIONAL_SPLIT_BUTTON
}

export default SplitButton

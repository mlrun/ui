import React, { useCallback, useEffect, useState, useRef } from 'react'

import Button from '../Button/Button'
import SelectOption from '../../elements/SelectOption/SelectOption'

import { MAIN_SPLIT_BUTTON, ADDITIONAL_SPLIT_BUTTON } from '../../types'

import { ReactComponent as CaretIcon } from '../../images/dropdown.svg'

import * as classes from './splitButton.module.scss'

const SplitButton = ({ mainButton, additionalButton }, ref) => {
  const {
    icon: Icon,
    iconClassName,
    onClick: mainAction,
    label,
    ...mainProps
  } = mainButton
  const {
    options,
    onSelectOption,
    selectedOption,
    ...additionalProps
  } = additionalButton

  const [isBodyOpen, setIsBodyOpen] = useState(false)
  const mainRef = useRef()

  const handleDocumentClick = useCallback(
    event => {
      if (
        event.target &&
        !mainRef.current?.contains(event.target) &&
        isBodyOpen
      ) {
        setIsBodyOpen(false)
      }
    },
    [isBodyOpen]
  )

  const handleMainAction = () => {
    mainAction()
    setIsBodyOpen(false)
  }

  useEffect(() => {
    if (mainRef.current) {
      document.addEventListener('click', handleDocumentClick)

      return () => {
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, mainRef])

  return (
    <div className={classes['split-btn']} ref={mainRef}>
      <div className={classes['split-btn__header']}>
        <div className={classes['split-btn__button']}>
          <Button {...mainProps} onClick={handleMainAction}>
            {Icon && <Icon className={iconClassName} />}
            <span className={classes['split-btn__button-label']}>{label}</span>
          </Button>
        </div>
        <div className={classes['split-btn__button']}>
          <Button
            {...additionalProps}
            onClick={() => setIsBodyOpen(state => !state)}
          >
            <CaretIcon />
          </Button>
        </div>
      </div>
      {isBodyOpen && (
        <div
          className={classes['split-btn__body']}
          onClick={() => setIsBodyOpen(false)}
        >
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

SplitButton.propTypes = {
  mainButton: MAIN_SPLIT_BUTTON,
  additionalButton: ADDITIONAL_SPLIT_BUTTON
}

export default SplitButton

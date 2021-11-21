import React, { useCallback, useEffect, useState, useRef } from 'react'

import Button from '../Button/Button'
import SelectOption from '../../elements/SelectOption/SelectOption'

import { MAIN_SPLIT_BUTTON, ADDITIONAL_SPLIT_BUTTON } from '../../types'

import './splitButton.scss'

const SplitButton = ({ mainButton, additionalButton }, ref) => {
  const { onClick: mainAction, ...mainProps } = mainButton
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
    <div className="split-btn" ref={mainRef}>
      <div className="split-btn__header">
        <div className="split-btn__button">
          <Button {...mainProps} onClick={handleMainAction} />
        </div>
        <div className="split-btn__button">
          <Button
            {...additionalProps}
            onClick={() => setIsBodyOpen(state => !state)}
          />
        </div>
      </div>
      {isBodyOpen && (
        <div className="split-btn__body" onClick={() => setIsBodyOpen(false)}>
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

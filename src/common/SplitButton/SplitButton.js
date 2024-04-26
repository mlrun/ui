/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useState, useRef } from 'react'
import { isEmpty } from 'lodash'

import { Button } from 'igz-controls/components'
import { OptionsMenu, SelectOption } from 'igz-controls/elements'

import { useDetectOutsideClick } from 'igz-controls/hooks'

import { MAIN_SPLIT_BUTTON, ADDITIONAL_SPLIT_BUTTON } from '../../types'
import { TERTIARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as CaretIcon } from 'igz-controls/images/dropdown.svg'

import './splitButton.scss'
import PropTypes from 'prop-types'

const SplitButton = ({ disabled, mainButton, additionalButton }) => {
  const { onClick: mainAction, ...mainProps } = mainButton
  const { icon, options, onSelectOption, selectedOption, ...additionalProps } = additionalButton

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
          <Button {...mainProps} onClick={handleMainAction} disabled={disabled} />
        </div>
        <div className="split-btn__button">
          <Button
            {...additionalProps}
            disabled={disabled}
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
                name={option.id}
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
  disabled: false,
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
  disabled: PropTypes.bool,
  mainButton: MAIN_SPLIT_BUTTON,
  additionalButton: ADDITIONAL_SPLIT_BUTTON
}

export default SplitButton

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
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { RoundedIcon } from 'igz-controls/components'

import './accordion.scss'

const Accordion = ({
  alwaysOpened = false,
  accordionClassName,
  children,
  closeOnBlur = null,
  icon = null,
  iconClassName,
  openByDefault = false
}) => {
  const [open, setOpen] = useState(openByDefault)
  const accordionRef = React.createRef()

  const handleOnBlur = useCallback(
    event => {
      if (accordionRef.current) {
        if (closeOnBlur && !accordionRef.current.contains(event.target)) {
          setOpen(false)
          closeOnBlur()
        }
      }
    },
    [accordionRef, closeOnBlur]
  )

  useEffect(() => {
    if (accordionRef.current) {
      window.addEventListener('click', handleOnBlur)
    }

    return () => {
      window.removeEventListener('click', handleOnBlur)
    }
  }, [accordionRef, handleOnBlur])

  const handleOpenAccordion = () => {
    !alwaysOpened && setOpen(state => !state)
  }

  const accordionClassNames = classnames('accordion__container', open && 'open', accordionClassName)

  const iconClassNames = classnames('accordion__icon', iconClassName, open && 'open')

  return (
    <div
      data-testid="accordion"
      className={accordionClassNames}
      onClick={!icon ? handleOpenAccordion : null}
      ref={accordionRef}
    >
      {icon && (
        <RoundedIcon id="accordion-btn" onClick={handleOpenAccordion} className={iconClassNames}>
          {icon}
        </RoundedIcon>
      )}
      <div className="accordion__body">{children}</div>
    </div>
  )
}

Accordion.propTypes = {
  accordionClassName: PropTypes.string,
  alwaysOpened: PropTypes.bool,
  closeOnBlur: PropTypes.func,
  icon: PropTypes.element,
  iconClassName: PropTypes.string,
  openByDefault: PropTypes.bool
}

export default Accordion

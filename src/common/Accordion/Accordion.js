import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import RoundedIcon from '../RoundedIcon/RoundedIcon'

import './accordion.scss'

const Accordion = ({
  alwaysOpened,
  accordionClassName,
  children,
  closeOnBlur,
  icon,
  iconClassName,
  openByDefault
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

  const accordionClassNames = classnames(
    'accordion__container',
    open && 'open',
    accordionClassName
  )

  const iconClassNames = classnames(
    'accordion__icon',
    iconClassName,
    open && 'open'
  )

  return (
    <div
      data-testid="accordion"
      className={accordionClassNames}
      onClick={!icon ? handleOpenAccordion : null}
      ref={accordionRef}
    >
      {icon && (
        <RoundedIcon
          data-testid="accordion-btn"
          onClick={handleOpenAccordion}
          className={iconClassNames}
        >
          {icon}
        </RoundedIcon>
      )}
      <div className="accordion__body">{children}</div>
    </div>
  )
}

Accordion.defaultProps = {
  alwaysOpened: false,
  closeOnBlur: null,
  openByDefault: false
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

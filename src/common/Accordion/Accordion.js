import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './accordion.scss'

const Accordion = ({
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
    e => {
      if (accordionRef.current) {
        if (closeOnBlur && !accordionRef.current.contains(e.target)) {
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
      window.addEventListener('click', handleOnBlur)
    }
  }, [accordionRef, handleOnBlur])

  const handleOpenAccordion = () => {
    setOpen(!open)
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
      className={accordionClassNames}
      onClick={!icon ? handleOpenAccordion : null}
      ref={accordionRef}
    >
      {icon && (
        <button onClick={handleOpenAccordion} className={iconClassNames}>
          <span>{icon}</span>
        </button>
      )}
      <div className="accordion__body">{children}</div>
    </div>
  )
}

Accordion.defaultProps = {
  closeOnBlur: null,
  openByDefault: false
}

Accordion.propTypes = {
  accordionClassName: PropTypes.string,
  closeOnBlur: PropTypes.func,
  icon: PropTypes.element,
  iconClassName: PropTypes.string,
  openByDefault: PropTypes.bool
}

export default Accordion

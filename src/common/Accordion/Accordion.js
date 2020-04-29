import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './accordion.scss'

const Accordion = ({
  accordionClassName,
  children,
  icon,
  iconClassName,
  openByDefault
}) => {
  const [open, setOpen] = useState(openByDefault)

  const handleOpenAccordion = () => {
    setOpen(!open)
  }

  return (
    <div
      className={`accordion__container ${open && 'open'} ${accordionClassName}`}
      onClick={!icon ? handleOpenAccordion : null}
    >
      {icon && (
        <button
          onClick={handleOpenAccordion}
          className={`accordion__icon ${iconClassName} ${open && 'open'}`}
        >
          <span>{icon}</span>
        </button>
      )}
      <div className="accordion__body">{children}</div>
    </div>
  )
}

Accordion.defaultProps = {
  openByDefault: false
}

Accordion.propTypes = {
  accordionClassName: PropTypes.string,
  icon: PropTypes.element,
  iconClassName: PropTypes.string,
  openByDefault: PropTypes.bool
}

export default Accordion

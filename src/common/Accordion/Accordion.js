import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './accordion.scss'

const Accordion = ({ icon, children, iconClassName, accordionClassName }) => {
  const [open, setOpen] = useState(false)

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
          className={`${iconClassName} ${open && 'open'}`}
        >
          <span>{icon}</span>
        </button>
      )}
      <div className="accordion__body">{children}</div>
    </div>
  )
}

Accordion.propTypes = {
  accordionClassName: PropTypes.string,
  icon: PropTypes.element,
  iconClassName: PropTypes.string
}

export default Accordion

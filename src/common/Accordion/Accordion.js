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
      onClick={!icon ? handleOpenAccordion : () => {}}
    >
      {icon && (
        <button onClick={handleOpenAccordion} className={iconClassName}>
          <img className={`${open && 'open'}`} src={icon} alt="Icon" />
        </button>
      )}
      <div className="accordion__body">{children}</div>
    </div>
  )
}

Accordion.propTypes = {
  accordionClassName: PropTypes.string,
  icon: PropTypes.string,
  iconClassName: PropTypes.string
}

export default Accordion

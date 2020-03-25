import React, { useState } from 'react'
import PropTypes from 'prop-types'

import arrowIcon from '../../images/arrow.png'

import './accordion.scss'

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false)

  const handleOpenAccordion = () => {
    setOpen(!open)
  }

  return (
    <div className={`accordion_container ${open && 'open'}`}>
      <button onClick={handleOpenAccordion}>
        <img className={`${open && 'open'}`} src={arrowIcon} alt="arrow" />
      </button>
      <div className="accordion_title">
        <div className="title">{title}</div>
      </div>
      <div className="accordion_body">{children}</div>
    </div>
  )
}

Accordion.propTypes = {
  title: PropTypes.string
}

export default Accordion

import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../svg/arrow.svg'

import './accordion.scss'

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false)

  const handleOpenAccordion = () => {
    setOpen(!open)
  }

  return (
    <div className={`accordion_container ${open && 'open'}`}>
      <button onClick={handleOpenAccordion}>
        <Arrow className={`${open && 'open'}`} />
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

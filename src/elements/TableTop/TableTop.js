import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Back } from '../../images/back-arrow.svg'

import './tableTop.scss'

const TableTop = ({ children, link, text }) => {
  return (
    <div className="table-top">
      <div className="link-back">
        <Link to={link} className="link-back__icon">
          <Tooltip template={<TextTooltipTemplate text="Back" />}>
            <Back />
          </Tooltip>
        </Link>
        {text && (
          <div className="link-back__title">
            <Tooltip template={<TextTooltipTemplate text={text} />}>
              {text}
            </Tooltip>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

TableTop.defaultProps = {
  text: ''
}

TableTop.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string
}

export default TableTop

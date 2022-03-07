import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ReactComponent as Back } from '../../images/back-arrow.svg'

import './pageHeader.scss'

const PageHeader = ({ title, description, backLink }) => {
  return (
    <div className="page-header">
      <div className="page-header__title-wrapper">
        {backLink && (
          <Link to={backLink} className="page-header__back-btn">
            <Back />
          </Link>
        )}
        <div className="page-header__title">{title}</div>
      </div>
      <div className="page-header__description">
        {backLink && <div className="page-header__description-placeholder" />}
        {description}
      </div>
    </div>
  )
}

PageHeader.defaultProps = {
  backLink: '',
  description: ''
}

PageHeader.propTypes = {
  backLink: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default PageHeader

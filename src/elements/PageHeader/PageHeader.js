import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import { ReactComponent as Back } from '../../images/back-arrow.svg'

import './pageHeader.scss'

const PageHeader = ({ title, description, backLink }) => {
  return (
    <div className="page-header">
      {backLink && (
        <div className="page-header__back-btn">
          <RoundedIcon>
            <Link to={backLink} className="page-header__back-btn">
              <Back />
            </Link>
          </RoundedIcon>
        </div>
      )}
      <div className="page-header__title-wrapper">
        <div className="page-header__title">{title}</div>
        <div className="page-header__description">{description}</div>
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

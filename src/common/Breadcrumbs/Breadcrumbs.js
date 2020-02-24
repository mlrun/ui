import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { Link } from 'react-router-dom'

import arrow from '../../images/arrow.png'

import './breadcrums.scss'

const Breadcrumbs = ({ match, onClick }) => {
  const pathItems = match.path.slice(1).split('/')
  const urlItems = match.url.slice(1).split('/')

  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        {urlItems.map((item, i) => {
          const param = pathItems && pathItems[i].startsWith(':')
          const label = param
            ? match.params.tab === item
              ? startCase(item)
              : item
            : startCase(item)
          const to = `/${urlItems.slice(0, i + 1).join('/')}`
          const last = i === urlItems.length - 1
          const id =
            urlItems[i] === match.params.jobId ||
            urlItems[i] === match.params.name

          if (last) {
            return (
              <li className="breadcrumbs__list__item" key={`${i}${item}`}>
                {label}
              </li>
            )
          } else if (id) {
            return [
              <li key={`${i}${item}`} className="breadcrumbs__list__item">
                {label}
              </li>,
              <li key={i} className="breadcrumbs__list_separator">
                <img src={arrow} alt="Arrow" />
              </li>
            ]
          } else {
            return [
              <li key={`${i}${item}`} className="breadcrumbs__list__item">
                <Link to={to} onClick={onClick}>
                  {label}
                </Link>
              </li>,
              <li key={i} className="breadcrumbs__list_separator">
                <img src={arrow} alt="Arrow" />
              </li>
            ]
          }
        })}
      </ul>
    </nav>
  )
}

Breadcrumbs.defaultProps = {
  onClick: () => {}
}

Breadcrumbs.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func
}

export default Breadcrumbs

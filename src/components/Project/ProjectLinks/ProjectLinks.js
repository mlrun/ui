import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProjectLinks = ({ links }) => {
  return (
    <div className="general-info__links">
      <div className="general-info__links-label">Quick Links</div>
      {links.map(({ label, link, externalLink }) => {
        if (externalLink) {
          return (
            <a
              href={link}
              target="_top"
              className="general-info__links-link"
              key={label}
            >
              {label}
            </a>
          )
        }

        return (
          <Link key={label} className="general-info__links-link" to={link}>
            {label}
          </Link>
        )
      })}
    </div>
  )
}

ProjectLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default ProjectLinks

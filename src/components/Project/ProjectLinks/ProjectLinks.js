import React from 'react'
import PropTypes from 'prop-types'

import NavbarLink from '../../../elements/NavbarLink/NavbarLink'

const ProjectLinks = ({ links }) => {
  return links.map(link => <NavbarLink key={link.label} {...link} />)
}

ProjectLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default ProjectLinks

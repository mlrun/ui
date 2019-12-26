import React from 'react'

import MuiLink from '@material-ui/core/Link'
import { NavLink } from 'react-router-dom'

const WrappedNavLink = React.forwardRef((props, ref) => (
  <NavLink ref={ref} {...props} />
))

const Link = props => <MuiLink component={WrappedNavLink} {...props} />

export default Link

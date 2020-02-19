import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import PageView from './PageView'

const Page = ({ children, location }) => {
  return <PageView location={location}>{children}</PageView>
}

Page.propTypes = {
  children: PropTypes.element.isRequired
}

export default withRouter(Page)

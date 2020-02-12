import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import PageView from './PageView'
import jobsActions from '../../actions/jobs'
import artifactsAction from '../../actions/artifacts'

const Page = ({ children, location }) => {
  return <PageView location={location}>{children}</PageView>
}

Page.propTypes = {
  children: PropTypes.element.isRequired
}

const mapStateToProps = state => ({
  jobs: state.jobs,
  job: state.selectedJob,
  logs: state.logs,
  jobArtifacts: state.artifacts,
  artifacts: state.artifacts
})

const mapDispatchToProps = dispatch => ({
  jobsActions: bindActionCreators(jobsActions, dispatch),
  artifactsActions: bindActionCreators(artifactsAction, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))

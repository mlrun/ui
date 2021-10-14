import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import PanelCredentialsAccessKey from '../PanelCredentialsAccessKey/PanelCredentialsAccessKey'

import jobsActions from '../../actions/jobs'
import { panelActions } from '../../components/JobsPanel/panelReducer'

import './jobsPanelCredentialsAccessKey.scss'

const JobsPanelCredentialsAccessKey = ({
  isScheduled,
  panelDispatch,
  panelState,
  setNewJobCredentialsAccessKey
}) => {
  const accessKeyClassNames = classnames(
    isScheduled && 'without-padding',
    'job-panel__item'
  )

  const handleSetCredentialsAccessKey = value => {
    panelDispatch({
      type: panelActions.SET_ACCESS_KEY,
      payload: value
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_ACCESS_KEY,
      payload: value
    })
    setNewJobCredentialsAccessKey(value)
  }

  return (
    <PanelCredentialsAccessKey
      className={accessKeyClassNames}
      credentialsAccessKey={panelState.access_key}
      setCredentialsAccessKey={handleSetCredentialsAccessKey}
    />
  )
}

JobsPanelCredentialsAccessKey.defaultProps = {
  isScheduled: false
}

JobsPanelCredentialsAccessKey.propTypes = {
  isScheduled: PropTypes.bool,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobCredentialsAccessKey: PropTypes.func.isRequired
}

export default connect(jobsStore => ({ ...jobsStore }), { ...jobsActions })(
  JobsPanelCredentialsAccessKey
)

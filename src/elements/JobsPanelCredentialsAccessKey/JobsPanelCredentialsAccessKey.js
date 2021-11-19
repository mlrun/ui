import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import PanelCredentialsAccessKey from '../PanelCredentialsAccessKey/PanelCredentialsAccessKey'

import jobsActions from '../../actions/jobs'
import { panelActions } from '../../components/JobsPanel/panelReducer'
import { PANEL_DEFAULT_ACCESS_KEY } from '../../constants'

import './jobsPanelCredentialsAccessKey.scss'

const JobsPanelCredentialsAccessKey = ({
  isScheduled,
  panelDispatch,
  panelState,
  setNewJobCredentialsAccessKey,
  setValidation,
  validation
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
      required={panelState.access_key !== PANEL_DEFAULT_ACCESS_KEY}
      setCredentialsAccessKey={handleSetCredentialsAccessKey}
      setValidation={setValidation}
      validation={validation}
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
  setNewJobCredentialsAccessKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => ({ ...jobsStore }), { ...jobsActions })(
  JobsPanelCredentialsAccessKey
)

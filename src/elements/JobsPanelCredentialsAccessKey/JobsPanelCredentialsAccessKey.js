/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
  isScheduled = false,
  panelDispatch,
  panelState,
  setNewJobCredentialsAccessKey,
  setValidation,
  validation
}) => {
  const accessKeyClassNames = classnames(isScheduled && 'without-padding', 'job-panel__item')

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
      isPanelEditMode={panelState.editMode}
      required={panelState.access_key !== PANEL_DEFAULT_ACCESS_KEY}
      setCredentialsAccessKey={handleSetCredentialsAccessKey}
      setValidation={setValidation}
      validation={validation}
    />
  )
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

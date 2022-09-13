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
import PropTypes from 'prop-types'

import { RoundedIcon } from 'igz-controls/components'

import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'

import './functinsPanelTitle.scss'

const FunctionsPanelTitle = ({ closePanel }) => {
  return (
    <div className="panel-title functions-panel__title">
      <div className="panel-title__container">
        <h5>
          This wizard takes you through the process of deploying a new MLRun
          function in your project.
        </h5>
        <p>
          Functions can be used for data preparation, model training, model
          serving, notification & alerts and etc.
          <a
            href="https://docs.mlrun.org/en/latest/tutorial/01-mlrun-basics.html#gs-tutorial-1-step-create-basic-function"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Read more{' '}
          </a>
          about MLRun functions
        </p>
      </div>
      <RoundedIcon
        onClick={() => closePanel({})}
        className="panel-title__btn_close"
        tooltipText="Close"
        data-testid="pop-up-close-btn"
      >
        <CloseIcon />
      </RoundedIcon>
    </div>
  )
}

FunctionsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired
}

export default FunctionsPanelTitle

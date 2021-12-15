import React from 'react'
import PropTypes from 'prop-types'

import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import { ReactComponent as CloseIcon } from '../../images/close.svg'

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

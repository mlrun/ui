import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'

import closeIcon from '../../images/close.svg'
import runIcon from '../../images/run.png'
import arrowIcon from '../../images/arrow.png'

import './jobspanel.scss'

const JobsPanel = ({ func, close }) => {
  return (
    <div className="job-panel-container">
      <div className="job-panel">
        <div className="job-panel__title">
          <div className="job-panel__name">{func?.metadata?.name}</div>
          <button onClick={() => close({})} className="job-panel__close-button">
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div className="job_panel__body">
          <Accordion icon={arrowIcon} iconClassName="accordion__icon">
            <div className="job-panel__item">Accordion</div>
          </Accordion>
          <Accordion icon={arrowIcon} iconClassName="accordion__icon">
            <JobsPanelDataInputs />
          </Accordion>
          <Accordion icon={arrowIcon} iconClassName="accordion__icon">
            <div className="job-panel__item">Accordion</div>
          </Accordion>
          <div className="job-panel__buttons-container">
            <button className="btn btn__schedule">Schedule for later</button>
            <button className="btn btn__run">
              <img src={runIcon} alt="run" className="btn__icon" />
              Run now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

JobsPanel.propTypes = {
  func: PropTypes.shape({}).isRequired
}

export default JobsPanel

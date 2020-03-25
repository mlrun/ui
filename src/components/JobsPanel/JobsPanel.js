import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'

import closeIcon from '../../images/close.svg'
import runIcon from '../../images/run.png'

import './jobspanel.scss'

const JobsPanel = ({ func, close }) => {
  return (
    <div className="job_panel_container">
      <div className="job_panel">
        <div className="job_panel_title">
          <div className="job_panel_title_name">{func?.metadata?.name}</div>
          <button onClick={() => close({})}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div className="job_panel_body">
          <Accordion title="Parameters">
            <div>Accordion</div>
          </Accordion>
          <Accordion title="Data inputs">
            <div>Accordion</div>
          </Accordion>
          <Accordion title="Resources">
            <div>Accordion</div>
          </Accordion>
          <div className="job_panel_button_container">
            <button className="btn_schedule">Schedule for later</button>
            <button className="btn_run">
              <img src={runIcon} alt="run" />
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

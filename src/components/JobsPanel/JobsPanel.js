import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'

import { ReactComponent as Close } from '../../svg/close.svg'
import { ReactComponent as Run } from '../../svg/run.svg'

import './jobsPanel.scss'

const JobsPanel = ({ func, close }) => {
  const [edit, setEdit] = useState(false)

  const handlerEdit = () => {
    setEdit(!edit)
  }

  return (
    <div className="job_panel_container">
      <div className="job_panel">
        <div className="job_panel_title">
          <div className="job_panel_title_name">{func?.metadata?.name}</div>
          <button onClick={() => close({})}>
            <Close />
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
            {!edit && (
              <button className="btn_edit" onClick={handlerEdit}>
                Edit
              </button>
            )}
            {edit && (
              <>
                <button className="btn_schedule">Schedule for later</button>
                <button className="btn_run">
                  <Run />
                  Run now
                </button>
              </>
            )}
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

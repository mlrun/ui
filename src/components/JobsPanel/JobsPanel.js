import React, { useEffect, useState } from 'react'

import Accordion from '../../common/Accordion/Accordion'

import funcApi from '../../api/functions-api'

import closeIcon from '../../images/cancel.png'
import runIcon from '../../images/run.png'

import './jobspanel.scss'

const JobsPanel = () => {
  const [func, setFunc] = useState({})
  useEffect(() => {
    funcApi.getAll('default').then(({ data }) => {
      console.log(data)

      setFunc(data?.funcs[0])
    })
  }, [])
  console.log(func)

  return (
    <div className="job_panel_container">
      <div className="job_panel">
        <div className="job_panel_title">
          <div className="job_panel_title_name">{func?.metadata?.name}</div>
          <button>
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

export default JobsPanel

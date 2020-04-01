import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Accordion from '../../common/Accordion/Accordion'
import JobsPanelDataInputs from '../JobsPanelDataInputs/JobsPanelDataInputs'

import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Run } from '../../images/run.svg'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import jobsActions from '../../actions/jobs'

import './jobsPanel.scss'

const JobsPanel = ({
  func,
  close,
  setNewJobInputs,
  jobsStore,
  match,
  setNewJob,
  setNewJobVolumes,
  setNewJobVolumeMounts,
  setNewJobInputPath,
  setNewJobOutputPath
}) => {
  const [edit, setEdit] = useState(false)

  const [inputPath, setInputPath] = useState('')
  const [outputPath, setOutputPath] = useState('')

  const handlerEdit = () => {
    setEdit(!edit)
    setNewJob({
      task: {
        spec: {
          parameters: {},
          inputs: {},
          output_path: '',
          input_path: ''
        }
      },
      function: {
        spec: {
          volumes: [],
          resources: {
            limits: {
              cpu: '',
              memory: '',
              nvidia_gpu: ''
            },
            requests: {
              cpu: '',
              memory: ''
            }
          },
          volumeMounts: []
        }
      }
    })
  }

  const handleRunJob = () => {
    setNewJobInputPath(inputPath)
    setNewJobOutputPath(outputPath)
  }

  return (
    <div className="job-panel-container">
      <div className="job-panel">
        <div className="job-panel__title">
          <div className="job-panel__name">{func?.metadata?.name}</div>
          <button onClick={() => close({})} className="job-panel__close-button">
            <Close />
          </button>
        </div>
        <div className="job_panel__body">
          <Accordion icon={<Arrow />} iconClassName="accordion__icon">
            <div className="job-panel__item">Accordion</div>
          </Accordion>
          <Accordion icon={<Arrow />} iconClassName="accordion__icon">
            <JobsPanelDataInputs
              setNewJobInputs={setNewJobInputs}
              inputs={jobsStore.newJob.task.spec.inputs}
              volumes={jobsStore.newJob.function.spec.volumes}
              setNewJobVolumes={setNewJobVolumes}
              setNewJobVolumeMounts={setNewJobVolumeMounts}
              volumeMounts={jobsStore.newJob.function.spec.volumeMounts}
              setInputPath={setInputPath}
              setOutputPath={setOutputPath}
              match={match}
            />
          </Accordion>
          <Accordion icon={<Arrow />} iconClassName="accordion__icon">
            <div className="job-panel__item">Accordion</div>
          </Accordion>
          <div className="job-panel__buttons-container">
            {!edit && (
              <button className="btn btn__edit" onClick={handlerEdit}>
                Edit
              </button>
            )}
            {edit && (
              <>
                <button className="btn btn__schedule">
                  Schedule for later
                </button>
                <button className="btn btn__run" onClick={handleRunJob}>
                  <Run className="btn__icon" />
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

export default connect(jobsStore => jobsStore, jobsActions)(JobsPanel)

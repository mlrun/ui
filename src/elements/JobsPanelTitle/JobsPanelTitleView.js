import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import MethodDescription from '../MethodDescription/MethodDescription'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

import { panelActions } from '../../components/JobsPanel/panelReducer'

const JobsPanelTitleView = ({
  closePanel,
  currentFunctionInfo,
  editMode,
  editTitle,
  handleFinishEdit,
  handleFunctionInfoChange,
  match,
  methodOptions,
  openScheduleJob,
  panelDispatch,
  setEditTitle,
  setOpenScheduleJob,
  versionOptions
}) => {
  const funcTitleClassNames = classnames(
    'job-panel__title-input',
    !editTitle && 'job-panel__title-input_disabled'
  )

  const accordionIconClassNames = classnames(
    'job-panel__title-edit-icon',
    openScheduleJob && 'job-panel__title-edit-icon_disabled'
  )

  return (
    <div className="job-panel__title">
      <div className="job-panel__title-container">
        {openScheduleJob && (
          <div className="job-panel__title-schedule">
            <BackArrow onClick={() => setOpenScheduleJob(false)} />
            <span>Schedule Job</span>
          </div>
        )}
        <Accordion
          accordionClassName="job-panel__title-accordion"
          closeOnBlur={() => {
            setEditTitle(false)
          }}
          icon={
            <Edit
              onClick={() => {
                setEditTitle(true)
              }}
            />
          }
          iconClassName={accordionIconClassNames}
        >
          {openScheduleJob ? (
            <div className="job-panel__title-name">
              {currentFunctionInfo.name}
            </div>
          ) : (
            <>
              <Input
                className={funcTitleClassNames}
                onChange={name =>
                  panelDispatch({
                    type: panelActions.SET_CURRENT_FUNCTION_INFO_NAME,
                    payload: name
                  })
                }
                type="text"
                value={currentFunctionInfo.name}
                wrapperClassName={
                  !editTitle ? 'job-panel__title-input-wrapper' : ''
                }
              />
              <Input
                className="job-panel__title-labels"
                label="Labels: "
                onChange={name =>
                  panelDispatch({
                    type: panelActions.SET_CURRENT_FUNCTION_INFO_LABELS,
                    payload: name.split(/\s*,\s*/)
                  })
                }
                type="text"
                value={currentFunctionInfo.labels.join(',')}
              />
            </>
          )}
        </Accordion>
      </div>
      {!openScheduleJob && (
        <div className="job-panel__title-select-container">
          <Select
            floatingLabel
            label="Version"
            match={match}
            onClick={version => handleFunctionInfoChange(version)}
            options={versionOptions}
            selectedId={currentFunctionInfo.version}
          />
          {methodOptions.length !== 0 && (
            <Select
              className="job-methods"
              floatingLabel
              label="Method"
              match={match}
              onClick={method => handleFunctionInfoChange(method, true)}
              options={methodOptions}
              selectedId={currentFunctionInfo.method}
            />
          )}
        </div>
      )}
      {currentFunctionInfo.methodDescription && (
        <MethodDescription
          description={currentFunctionInfo.methodDescription}
        />
      )}
      {editMode && (
        <div className="job-panel__title-buttons-container">
          <button
            className="btn_default btn_small"
            onClick={event => handleFinishEdit(event, true)}
          >
            Cancel
          </button>
          <button className="btn_primary btn_small" onClick={handleFinishEdit}>
            Done
          </button>
        </div>
      )}
      <button onClick={() => closePanel({})} className="job-panel__btn_close">
        <Close />
      </button>
    </div>
  )
}

JobsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  editMode: PropTypes.bool.isRequired,
  editTitle: PropTypes.bool.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  handleFunctionInfoChange: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  setEditTitle: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView

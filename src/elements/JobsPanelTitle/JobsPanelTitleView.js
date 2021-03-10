import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import MethodDescription from '../MethodDescription/MethodDescription'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'
import ChipCell from '../../common/ChipCell/ChipCell'
import Button from '../../common/Button/Button'

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
  isTitleValid,
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
  const titleValidationTip = editTitle ? (
    <>
      <span>&bull; Valid characters: A-Z, a-z, 0-9, -, _, .</span>
      <br />
      <span>&bull; Must begin and end with: A-Z, a-z, 0-9</span>
      <br />
      <span>&bull; Length - max: 63</span>
    </>
  ) : (
    ''
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
          closeOnBlur={!isTitleValid() ? null : () => setEditTitle(false)}
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
                disabled={!editTitle}
                onChange={name =>
                  panelDispatch({
                    type: panelActions.SET_CURRENT_FUNCTION_INFO_NAME,
                    payload: name
                  })
                }
                maxLength={63}
                pattern="^(?=[\S\s]{1,63}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$"
                required={!isTitleValid()}
                requiredText={
                  currentFunctionInfo.name.length === 0
                    ? 'This field is required'
                    : 'This field is invalid'
                }
                tip={titleValidationTip}
                type="text"
                value={currentFunctionInfo.name}
                wrapperClassName={
                  !editTitle ? 'job-panel__title-input-wrapper' : ''
                }
              />
              {editTitle && (
                <div className="job-labels-container">
                  <div className="job-labels__text">Labels</div>
                  <div className="job-labels-wrapper">
                    <ChipCell
                      addChip={(label, labels) =>
                        panelDispatch({
                          type: panelActions.SET_JOB_LABELS,
                          payload: [...labels, label]
                        })
                      }
                      className="job-labels__item"
                      editChip={chips =>
                        panelDispatch({
                          type: panelActions.EDIT_JOB_LABEL,
                          payload: chips
                        })
                      }
                      elements={currentFunctionInfo.labels}
                      isEditMode={true}
                      removeChip={chips =>
                        panelDispatch({
                          type: panelActions.REMOVE_JOB_LABEL,
                          payload: chips
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </Accordion>
      </div>
      {!openScheduleJob && (
        <div className="job-panel__title-select-container">
          <Select
            floatingLabel
            label="Version"
            onClick={version => handleFunctionInfoChange(version)}
            options={versionOptions}
            selectedId={currentFunctionInfo.version}
          />
          {methodOptions.length !== 0 && (
            <Select
              className="job-methods"
              floatingLabel
              label="Method"
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
          <Button
            variant="tertiary"
            label="Cancel"
            onClick={event => handleFinishEdit(event, true)}
          />
          <Button variant="primary" label="Done" onClick={handleFinishEdit} />
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
  isTitleValid: PropTypes.func.isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  setEditTitle: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView

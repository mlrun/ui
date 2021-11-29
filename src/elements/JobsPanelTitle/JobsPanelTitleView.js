import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import MethodDescription from '../MethodDescription/MethodDescription'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'
import ChipCell from '../../common/ChipCell/ChipCell'
import Button from '../../common/Button/Button'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as CloseIcon } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

import { panelActions } from '../../components/JobsPanel/panelReducer'
import { getChipOptions } from '../../utils/getChipOptions'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../constants'
import { getValidationRules } from '../../utils/validationService'

const JobsPanelTitleView = ({
  closePanel,
  currentFunctionInfo,
  editMode,
  editModeEnabled,
  editTitle,
  handleFinishEdit,
  handleFunctionInfoChange,
  isNameValid,
  methodOptions,
  openScheduleJob,
  panelDispatch,
  setEditTitle,
  setNameValid,
  setOpenScheduleJob,
  versionOptions
}) => {
  const accordionIconClassNames = classnames(
    'job-panel__title-edit-icon',
    openScheduleJob && 'job-panel__title-edit-icon_disabled'
  )
  return (
    <div className="panel-title job-panel__title">
      <div className="panel-title__container">
        {openScheduleJob && (
          <div className="panel-title__schedule">
            <BackArrow onClick={() => setOpenScheduleJob(false)} />
            <span>Schedule Job</span>
          </div>
        )}
        <Accordion
          accordionClassName="job-panel__title-accordion"
          alwaysOpened={!editModeEnabled}
          closeOnBlur={!isNameValid ? null : () => setEditTitle(false)}
          icon={
            editModeEnabled ? (
              <Tooltip template={<TextTooltipTemplate text="Edit" />}>
                <Edit
                  onClick={() => {
                    setEditTitle(true)
                  }}
                />
              </Tooltip>
            ) : null
          }
          iconClassName={accordionIconClassNames}
        >
          {openScheduleJob || !editModeEnabled ? (
            <div className="panel-title__name">{currentFunctionInfo.name}</div>
          ) : (
            <>
              <Input
                className="panel-title__input"
                disabled={!editTitle}
                invalid={!isNameValid}
                invalidText="This field is invalid"
                onChange={name =>
                  panelDispatch({
                    type: panelActions.SET_CURRENT_FUNCTION_INFO_NAME,
                    payload: name
                  })
                }
                validationRules={getValidationRules('jobName')}
                required
                requiredText="This field is required"
                setInvalid={value =>
                  setNameValid(state => ({ ...state, isNameValid: value }))
                }
                type="text"
                value={currentFunctionInfo.name}
                wrapperClassName={
                  !editTitle ? 'panel-title__input-wrapper' : ''
                }
              />
              {editTitle && (
                <div className="panel-title__labels-container">
                  <div className="panel-title__labels-text">Labels</div>
                  <div className="panel-title__labels-wrapper">
                    <ChipCell
                      addChip={(label, labels) =>
                        panelDispatch({
                          type: panelActions.SET_JOB_LABELS,
                          payload: [...labels, label]
                        })
                      }
                      className="panel-title__labels-item"
                      chipOptions={getChipOptions('labels')}
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
      {!openScheduleJob && versionOptions.length !== 0 && (
        <div className="job-panel__title-select-container">
          <Select
            density="chunky"
            floatingLabel
            label="Version"
            onClick={version => handleFunctionInfoChange(version)}
            options={versionOptions}
            selectedId={currentFunctionInfo.version}
          />
          {methodOptions.length !== 0 && (
            <Select
              className="job-methods"
              density="chunky"
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
            label="Cancel"
            onClick={event => handleFinishEdit(event, true)}
            variant={TERTIARY_BUTTON}
          />
          <Button
            variant={PRIMARY_BUTTON}
            label="Done"
            onClick={handleFinishEdit}
          />
        </div>
      )}
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

JobsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  editMode: PropTypes.bool.isRequired,
  editModeEnabled: PropTypes.bool.isRequired,
  editTitle: PropTypes.bool.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  handleFunctionInfoChange: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  setEditTitle: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView

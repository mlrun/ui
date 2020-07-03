import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'

// import JobsPanelTitleEdit from '../JobsPanelTitleEdit/JobsPanelTitleEdit'
// import MethodDescription from '../MethodDescription/MethodDescription'
import Accordion from '../../common/Accordion/Accordion'
import Select from '../../common/Select/Select'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'
import JobsPanelTitleEdit from '../JobsPanelTitleEdit/JobsPanelTitleEdit'

import { panelActions } from '../../components/JobsPanel/panelReducer'

const JobsPanelTitleView = ({
  closePanel,
  currentFunctionInfo,
  editMode,
  handleFinishEdit,
  match,
  methodOptions,
  openScheduleJob,
  panelDispatch,
  setOpenScheduleJob,
  versionOptions
}) => {
  // const jobPanelClassName = classNames(
  //   'job-panel__title-wrapper',
  //   editMode && 'job-panel__title-wrapper_edit',
  //   !openScheduleJob && !editMode && 'job-panel__title-wrapper_hover'
  // )

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
          icon={
            <Edit
              onClick={() => {
                panelDispatch({
                  type: panelActions.SET_EDIT_MODE,
                  payload: true
                })
              }}
            />
          }
          iconClassName="job-panel__title-edit-icon"
        >
          {editMode ? (
            <JobsPanelTitleEdit
              currentFunctionInfo={currentFunctionInfo}
              panelDispatch={panelDispatch}
            />
          ) : (
            <div className="job-panel__name">{currentFunctionInfo.name}</div>
          )}
        </Accordion>
        <div className="job-panel__select-container">
          <Select
            floatingLabel
            label="Version"
            match={match}
            onClick={version =>
              panelDispatch({
                type: panelActions.SET_CURRENT_FUNCTION_INFO_VERSION,
                payload: version
              })
            }
            options={versionOptions}
            selectedId={currentFunctionInfo.version}
          />
          {methodOptions.length !== 0 && (
            <Select
              className="job-methods"
              floatingLabel
              label="Method"
              match={match}
              onClick={method => {
                const methodDescription = methodOptions.find(
                  func => func.id === method
                )

                panelDispatch({
                  type: panelActions.SET_CURRENT_FUNCTION_INFO_METHOD,
                  payload: {
                    method,
                    methodDescription: methodDescription.subLabel
                  }
                })
              }}
              options={methodOptions}
              selectedId={currentFunctionInfo.method}
            />
          )}
        </div>
        {/*  <div className={jobPanelClassName}>*/}
        {/*    {!editMode ? (*/}
        {/*      <>*/}
        {/*        <div className="job-panel__wrapper">*/}

        {/*          {!openScheduleJob && (*/}
        {/*            <>*/}
        {/*              <span className="job-panel__version">*/}
        {/*                Version: {currentFunctionInfo.version === 'latest' && '$'}*/}
        {/*                {currentFunctionInfo.version}*/}
        {/*              </span>*/}
        {/*              {currentFunctionInfo.method && (*/}
        {/*                <span className="job-panel__method">*/}
        {/*                  Method: {currentFunctionInfo.method}*/}
        {/*                </span>*/}
        {/*              )}*/}
        {/*            </>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*        {!openScheduleJob && (*/}
        {/*          <div className="job-panel__button">*/}
        {/*            <Edit*/}
        {/*              className="job-panel__icon"*/}
        {/*              onClick={() => {*/}
        {/*                panelDispatch({*/}
        {/*                  type: panelActions.SET_EDIT_MODE,*/}
        {/*                  payload: true*/}
        {/*                })*/}
        {/*              }}*/}
        {/*            />*/}
        {/*          </div>*/}
        {/*        )}*/}
        {/*      </>*/}
        {/*    ) : (*/}
        {/*      <JobsPanelTitleEdit*/}
        {/*        currentFunctionInfo={currentFunctionInfo}*/}
        {/*        handleFinishEdit={handleFinishEdit}*/}
        {/*        match={match}*/}
        {/*        methodOptions={methodOptions}*/}
        {/*        panelDispatch={panelDispatch}*/}
        {/*        versionOptions={versionOptions}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*  {currentFunctionInfo.methodDescription && !editMode && (*/}
        {/*    <MethodDescription*/}
        {/*      description={currentFunctionInfo.methodDescription}*/}
        {/*    />*/}
        {/*  )}*/}
      </div>
      <button onClick={() => closePanel({})} className="btn-close">
        <Close />
      </button>
    </div>
  )
}

JobsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  editMode: PropTypes.bool.isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView

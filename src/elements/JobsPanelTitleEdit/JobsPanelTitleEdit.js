import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { panelActions } from '../../components/JobsPanel/panelReducer'

const JobsPanelTitleEdit = ({
  currentFunctionInfo,
  handleFinishEdit,
  match,
  methodOptions,
  panelDispatch,
  versionOptions
}) => {
  return (
    <>
      <Input
        onChange={name =>
          panelDispatch({
            type: panelActions.SET_CURRENT_FUNCTION_INFO_NAME,
            payload: name
          })
        }
        type="text"
        value={currentFunctionInfo.name}
      />
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
            onClick={method =>
              panelDispatch({
                type: panelActions.SET_CURRENT_FUNCTION_INFO_METHOD,
                payload: method
              })
            }
            options={methodOptions}
            selectedId={currentFunctionInfo.method}
          />
        )}
      </div>
      <button className="btn btn_primary" onClick={handleFinishEdit}>
        Done
      </button>
    </>
  )
}

JobsPanelTitleEdit.propTypes = {
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  handleFinishEdit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleEdit

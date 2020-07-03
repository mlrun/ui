import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { panelActions } from '../../components/JobsPanel/panelReducer'

const JobsPanelTitleEdit = ({ currentFunctionInfo, panelDispatch }) => {
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
    </>
  )
}

JobsPanelTitleEdit.propTypes = {
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired
}

export default JobsPanelTitleEdit

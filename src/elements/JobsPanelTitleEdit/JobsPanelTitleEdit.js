import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

const JobsPanelTitleEdit = ({
  currentFunctionInfo,
  match,
  methodOptions,
  setCurrentFunctionInfo,
  setIsEdit,
  versionOptions
}) => {
  return (
    <>
      <Input
        onChange={name =>
          setCurrentFunctionInfo(prevState => ({ ...prevState, name }))
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
            setCurrentFunctionInfo(prevState => ({ ...prevState, version }))
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
              setCurrentFunctionInfo(prevState => ({ ...prevState, method }))
            }
            options={methodOptions}
            selectedId={currentFunctionInfo.method}
          />
        )}
      </div>
      <button className="btn btn_primary" onClick={() => setIsEdit(false)}>
        Done
      </button>
    </>
  )
}

JobsPanelTitleEdit.propTypes = {
  currentFunctionInfo: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleEdit

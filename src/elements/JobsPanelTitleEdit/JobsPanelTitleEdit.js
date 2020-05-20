import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

const JobsPanelTitleEdit = ({
  currentFunction,
  handleEditJobTitle,
  match,
  methodOptions,
  setCurrentFunction,
  versionOptions
}) => {
  return (
    <>
      <Input
        onChange={name =>
          setCurrentFunction(prevState => ({ ...prevState, name }))
        }
        type="text"
        value={currentFunction.name}
      />
      <div className="job-panel__select-container">
        <Select
          floatingLabel
          label="Version"
          match={match}
          onClick={version =>
            setCurrentFunction(prevState => ({ ...prevState, version }))
          }
          options={versionOptions}
          selectedId={currentFunction.version}
        />
        {methodOptions.length !== 0 && (
          <Select
            className="job-methods"
            floatingLabel
            label="Method"
            match={match}
            onClick={method =>
              setCurrentFunction(prevState => ({ ...prevState, method }))
            }
            options={methodOptions}
            selectedId={currentFunction.method}
          />
        )}
      </div>
      <button className="btn btn_primary" onClick={handleEditJobTitle}>
        Done
      </button>
    </>
  )
}

JobsPanelTitleEdit.propTypes = {
  currentFunction: PropTypes.shape({}).isRequired,
  handleEditJobTitle: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  setCurrentFunction: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleEdit

import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import './registerArtifactForm.scss'

const RegisterArtifactForm = ({
  onChange,
  registerArtifactData,
  setValidation,
  showType,
  validation
}) => {
  const { description, key, kind, target_path } = registerArtifactData
  const kindOptions = [
    {
      label: 'General',
      id: 'general'
    },
    {
      label: 'Chart',
      id: 'chart'
    },
    {
      label: 'Plot',
      id: 'plot'
    },
    {
      label: 'Table',
      id: 'table'
    }
  ]

  return (
    <div className="artifact-register-form">
      <Input
        className="pop-up-dialog__form-input"
        density="chunky"
        wrapperClassName="mb-3"
        invalid={!validation.isNameValid}
        invalidText="This field is invalid"
        label="Name"
        onChange={value => onChange(prevData => ({ ...prevData, key: value }))}
        required
        requiredText="This field is required"
        setInvalid={value =>
          setValidation(state => ({ ...state, isNameValid: value }))
        }
        tip="Artifact names in the same project must be unique"
        type="text"
        value={key}
      />
      <Input
        className="pop-up-dialog__form-input"
        density="chunky"
        wrapperClassName="mb-3"
        invalid={!validation.isTargetPathValid}
        invalidText="This field is invalid"
        label="Target Path"
        onChange={value =>
          onChange(prevData => ({ ...prevData, target_path: value }))
        }
        required
        requiredText="This field is required"
        setInvalid={value =>
          setValidation(state => ({ ...state, isTargetPathValid: value }))
        }
        type="text"
        value={target_path}
      />
      <Input
        className="pop-up-dialog__form-input"
        density="chunky"
        wrapperClassName="mb-3"
        label="Description"
        onChange={value =>
          onChange(prevData => ({ ...prevData, description: value }))
        }
        type="text"
        value={description}
      />
      {showType && (
        <Select
          density="chunky"
          label="Type:"
          onClick={value =>
            onChange(prevData => ({ ...prevData, kind: value }))
          }
          options={kindOptions}
          selectedId={kind}
        />
      )}
    </div>
  )
}

RegisterArtifactForm.defaultProps = {
  showType: true
}

RegisterArtifactForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  registerArtifactData: PropTypes.shape({}).isRequired,
  setValidation: PropTypes.func.isRequired,
  showType: PropTypes.bool,
  validation: PropTypes.shape({}).isRequired
}

export default RegisterArtifactForm

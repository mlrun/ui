import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import './registerArtifactForm.scss'

const RegisterArtifactForm = ({ onChange, registerArtifactData }) => {
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
      label: 'Dataset',
      id: 'dataset'
    },
    {
      label: 'Model',
      id: 'model'
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
        floatingLabel
        label="Name"
        onChange={value =>
          onChange(prevData => ({
            ...prevData,
            key: { value, required: !value }
          }))
        }
        required={key.required}
        requiredText="This field is required"
        tip="Artifact names in the same project must be unique"
        type="text"
        value={key.value}
      />
      <Input
        className="pop-up-dialog__form-input"
        floatingLabel
        label="Target Path"
        onChange={value =>
          onChange(prevData => ({
            ...prevData,
            target_path: { value, required: !value }
          }))
        }
        required={target_path.required}
        requiredText="This field is required"
        type="text"
        value={target_path.value}
      />
      <Input
        className="pop-up-dialog__form-input"
        floatingLabel
        label="Description"
        onChange={value =>
          onChange(prevData => ({
            ...prevData,
            description: { ...prevData, value }
          }))
        }
        type="text"
        value={description.value}
      />
      <Select
        label="Type:"
        onClick={value =>
          onChange(prevData => ({
            ...prevData,
            kind: {
              ...prevData,
              value
            }
          }))
        }
        options={kindOptions}
        selectedId={kind.value}
      />
    </div>
  )
}

RegisterArtifactForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  registerArtifactData: PropTypes.shape({}).isRequired
}

export default RegisterArtifactForm

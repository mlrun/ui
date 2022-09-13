/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { getValidationRules } from 'igz-controls/utils/validation.util'

import './registerArtifactForm.scss'

const RegisterArtifactForm = ({
  onChange,
  registerArtifactData,
  setValidation,
  showType,
  validation,
  messageByKind
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
      {messageByKind && (
        <div className="msg">
          <p>{messageByKind}</p>
          <div>
            <p>
              All you need to do is enter the name of the artifact and the URL (e.g.
              s3://my-bucket/path).
            </p>
            <a
              href="https://docs.mlrun.org/en/latest/store/artifacts.html"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Read more
            </a>
          </div>
        </div>
      )}
      <Input
        className="pop-up-dialog__form-input"
        density="chunky"
        floatingLabel
        invalid={!validation.isNameValid}
        invalidText="This field is invalid"
        label="Name"
        onChange={value => onChange(prevData => ({ ...prevData, key: value }))}
        required
        requiredText="This field is required"
        setInvalid={value => setValidation(state => ({ ...state, isNameValid: value }))}
        tip="Artifact names in the same project must be unique"
        type="text"
        validationRules={getValidationRules('artifact.name')}
        value={key}
      />
      <Input
        className="pop-up-dialog__form-input"
        density="chunky"
        floatingLabel
        invalid={!validation.isTargetPathValid}
        invalidText="This field is invalid"
        label="Target Path"
        onChange={value => onChange(prevData => ({ ...prevData, target_path: value }))}
        required
        requiredText="This field is required"
        setInvalid={value => setValidation(state => ({ ...state, isTargetPathValid: value }))}
        type="text"
        value={target_path}
      />
      <Input
        className="pop-up-dialog__form-input"
        density="chunky"
        floatingLabel
        label="Description"
        onChange={value => onChange(prevData => ({ ...prevData, description: value }))}
        type="text"
        value={description}
      />
      {showType && (
        <Select
          density="chunky"
          label="Type:"
          onClick={value => onChange(prevData => ({ ...prevData, kind: value }))}
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
  validation: PropTypes.shape({}).isRequired,
  messageByKind: PropTypes.string
}

export default RegisterArtifactForm

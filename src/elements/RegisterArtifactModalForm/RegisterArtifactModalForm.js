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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { FormInput, FormSelect, FormTextarea } from 'igz-controls/components'

import { getValidationRules } from 'igz-controls/utils/validation.util'

const RegisterArtifactModalForm = ({ showType, messageByKind }) => {
  const kindOptions = useMemo(
    () => [
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
    ],
    []
  )

  return (
    <div className="form">
      <div className="form-row">
        {messageByKind && (
          <div className="form-text">
            <span>{messageByKind}</span>
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
      </div>
      <div className="form-row">
        <div className="form-col-2">
          <FormInput
            label="Name"
            name="key"
            required
            tip="Artifact names in the same project must be unique"
            validationRules={getValidationRules('artifact.name')}
          />
        </div>
        {showType && (
          <div className="form-col-1">
            <FormSelect label="Type:" name="kind" options={kindOptions} />
          </div>
        )}
      </div>
      <div className="form-row">
        <FormInput label="Target Path" name="target_path" required />
      </div>
      <div className="form-row">
        <FormTextarea label="Description" name="description" />
      </div>
    </div>
  )
}

RegisterArtifactModalForm.defaultProps = {
  showType: true,
  messageByKind: ''
}

RegisterArtifactModalForm.propTypes = {
  showType: PropTypes.bool,
  messageByKind: PropTypes.string
}

export default RegisterArtifactModalForm

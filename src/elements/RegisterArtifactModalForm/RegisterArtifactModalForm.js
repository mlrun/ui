import React from 'react'
import PropTypes from 'prop-types'

import { FormInput, FormSelect, FormTextarea } from 'igz-controls/components'

import { getValidationRules } from 'igz-controls/utils/validation.util'

const RegisterArtifactModalForm = ({ showType, messageByKind }) => {
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
    <div className="form">
      <div className="form-row">
        {messageByKind && (
          <div className="msg">
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
        <FormInput
          invalidText="This field is invalid"
          label="Name"
          name="key"
          required
          tip="Artifact names in the same project must be unique"
          validationRules={getValidationRules('artifact.name')}
        />
      </div>
      <div className="form-row">
        <FormInput
          invalidText="This field is invalid"
          label="Target Path"
          name="target_path"
          required
        />
      </div>
      <div className="form-row">
        <FormTextarea label="Description" name="description" required />
      </div>
      {showType && <FormSelect label="Type:" name="kind" options={kindOptions} />}
    </div>
  )
}

RegisterArtifactModalForm.defaultProps = {
  showType: true
}

RegisterArtifactModalForm.propTypes = {
  showType: PropTypes.bool,
  messageByKind: PropTypes.string
}

export default RegisterArtifactModalForm

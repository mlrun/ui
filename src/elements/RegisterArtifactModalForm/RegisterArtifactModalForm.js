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

import TargetPath from '../../common/TargetPath/TargetPath'
import { FormChipCell, FormInput, FormSelect, FormTextarea } from 'igz-controls/components'

import { ARTIFACT_TYPE, MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import { getChipOptions } from '../../utils/getChipOptions'
import { getValidationRules } from 'igz-controls/utils/validation.util'

const RegisterArtifactModalForm = ({
  formState,
  initialValues,
  messagesByKind = '',
  params,
  setFieldState,
  showType = true
}) => {
  const kindOptions = useMemo(
    () => [
      {
        label: 'General',
        id: ARTIFACT_TYPE
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
        {messagesByKind?.title && (
          <div className="form-text">
            <span>{messagesByKind.title}</span>
            <div>
              <p>{messagesByKind?.subTitle}</p>
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
            async
            label="Name"
            name="metadata.key"
            required
            validationRules={getValidationRules('artifact.name')}
          />
        </div>
        <div className="form-col-1">
          <FormInput
            label="Tag"
            name="metadata.tag"
            validationRules={getValidationRules('common.tag')}
            placeholder="latest"
          />
        </div>
        {showType && (
          <div className="form-col-1">
            <FormSelect label="Type:" name="kind" options={kindOptions} />
          </div>
        )}
      </div>
      <div className="form-row">
        <FormTextarea label="Description" maxLength={500} name="metadata.description" />
      </div>
      <div className="form-row">
        <TargetPath
          formState={formState}
          formStateFieldInfo="spec.target_path.fieldInfo"
          hiddenSelectOptionsIds={[MLRUN_STORAGE_INPUT_PATH_SCHEME]}
          label="Target Path"
          name="spec.target_path.path"
          params={params}
          required
          selectPlaceholder="Path Scheme"
          setFieldState={setFieldState}
        />
      </div>
      <div className="form-row">
        <FormChipCell
          chipOptions={getChipOptions('metrics')}
          formState={formState}
          initialValues={initialValues}
          isEditable
          label="labels"
          name="metadata.labels"
          shortChips
          visibleChipsMaxLength="2"
          validationRules={{
            key: getValidationRules('common.tag'),
            value: getValidationRules('common.tag')
          }}
        />
      </div>
    </div>
  )
}

RegisterArtifactModalForm.propTypes = {
  formState: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  messagesByKind: PropTypes.object,
  params: PropTypes.shape({}).isRequired,
  setFieldState: PropTypes.func.isRequired,
  showType: PropTypes.bool
}

export default RegisterArtifactModalForm

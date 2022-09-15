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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// import { OnChange } from 'react-final-form-listeners'

import EditorModal from '../../../common/EditorModal/EditorModal'
import {
  Button,
  FormCheckBox,
  FormInput,
  FormRadio,
  FormSelect,
  FormTextarea
} from 'igz-controls/components'

import {
  FUNCTION_TYPE_SERVING,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  TAG_LATEST
} from '../../../constants'

import {
  DEFAULT_ENTRY,
  // DEFAULT_IMAGE,
  EXISTING_IMAGE,
  entryOptions,
  generateCodeOptions,
  NEW_IMAGE
  // sourceCodeInBase64
} from '../newFunctionModal.util'
import { trimSplit } from '../../../utils'

const NewFunctionModalStep2 = ({ appStore, formRef, formState, mode, projectName }) => {
  const [editCode, setEditCode] = useState(false)

  useEffect(() => {
    if (formState.values.extra.imageType === EXISTING_IMAGE) {
      if (mode === PANEL_CREATE_MODE) {
        // formRef.change('')
      }
    } else {
      const buildImage = (appStore.frontendSpec?.function_deployment_target_image_template || '')
        .replace('{project}', projectName)
        .replace('{name}', formState.values.metadata.name)
        .replace('{tag}', formState.values.metadata.tag || TAG_LATEST)

      formRef.change('spec.build.image', formState.initialValues.spec.build.image || buildImage)
      formRef.change(
        'spec.build.commands',
        trimSplit(formState.values.spec.build.commands, '\n').join('\n')
      )
    }
  }, [
    formState.values,
    formState.values.extra.imageType,
    appStore.frontendSpec?.function_deployment_target_image_template,
    formRef,
    formState.initialValues.spec.build.image,
    mode,
    projectName
  ])
  return (
    <>
      <div className="form-row">
        <h5 className="form__step-title">Code</h5>
      </div>
      <div className="form-row">
        <div className="form-col-4">
          <FormSelect label="Code entry" name="extra.entry" options={entryOptions} />
        </div>
        {formState.values.extra.entry === DEFAULT_ENTRY && (
          <Button label="Edit source" onClick={() => setEditCode(true)} />
        )}
      </div>
      <div className="form-row">
        <div className="form-col">
          {formState.values.kind === FUNCTION_TYPE_SERVING ? (
            <FormInput label="Default class" name="spec.default_class" />
          ) : (
            <FormInput
              label="Default handler"
              name="spec.default_handler"
              tip="Enter the function handler name (e.g. for the default sample function the name should be `handler`)"
            />
          )}
        </div>
        {mode === PANEL_EDIT_MODE && <FormCheckBox label="Force build" name="extra.force_build" />}
      </div>
      <div className="form-row">
        {generateCodeOptions.map(element => (
          <div className="form-col-auto" key={element.value}>
            <FormRadio name="extra.imageType" {...element} />
            {/* <OnChange name="extra.imageType">{handleImageTypeChange}</OnChange> */}
          </div>
        ))}
      </div>

      {formState.values.extra.imageType === EXISTING_IMAGE && (
        <FormInput
          label="Image name"
          name="spec.image"
          required
          tip="The name of the function‘s container image"
        />
      )}

      {formState.values.extra.imageType === NEW_IMAGE && (
        <>
          <div className="form-row">
            <FormInput
              label="Resulting Image"
              name="spec.build.image"
              tip="The name of the built container image"
            />
          </div>
          <div className="form-row">
            <FormInput
              label="Base image"
              name="spec.build.base_image"
              required
              tip="The name of a base container image from which to build the function's processor image"
            />
          </div>
          <div className="form-row">
            <FormTextarea label="Build commands" name="spec.build.commands" required />
          </div>
        </>
      )}

      {editCode && (
        <EditorModal
          closeModal={() => setEditCode(false)}
          defaultData={formState.values.spec.build.functionSourceCode}
          handleSaveCode={value => {
            formRef.change('spec.build.functionSourceCode', value)
            setEditCode(false)
          }}
        />
      )}
    </>
  )
}

NewFunctionModalStep2.propTypes = {
  appStore: PropTypes.PropTypes.shape({}).isRequired,
  formRef: PropTypes.PropTypes.shape({}).isRequired,
  formState: PropTypes.PropTypes.shape({}).isRequired,
  projectName: PropTypes.string.isRequired
}

export default NewFunctionModalStep2

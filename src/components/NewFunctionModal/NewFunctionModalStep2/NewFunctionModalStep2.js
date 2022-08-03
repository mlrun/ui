import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

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
  DEFAULT_IMAGE,
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
    if (mode === PANEL_CREATE_MODE && formState.values.extra.imageType.length === 0) {
      if (appStore.frontendSpec.default_function_image_by_kind?.[formState.values.kind]) {
        formRef.current.change(
          'spec.image',
          appStore.frontendSpec?.default_function_image_by_kind[formState.values.kind]
        )
        formRef.current.change('extra.imageType', EXISTING_IMAGE)
      } else {
        const buildImage = (appStore.frontendSpec?.function_deployment_target_image_template || '')
          .replace('{project}', projectName)
          .replace('{name}', formState.values.metadata.name)
          .replace('{tag}', formState.values.metadata.tag || TAG_LATEST)

        formRef.current.change(
          'spec.build.commands',
          trimSplit(appStore.frontendSpec?.function_deployment_mlrun_command, '\n').join('\n')
        )

        formRef.current.change(
          'spec.build.base_image',
          appStore.frontendSpec?.default_function_image_by_kind?.[formState.values.kind]
        )

        formRef.current.change('spec.build.image', buildImage)

        formRef.current.change('extra.imageType', NEW_IMAGE)
      }
    } else if (
      (formState.initialValues.spec.image?.length > 0 ||
        (formState.initialValues.spec.build?.base_image?.length === 0 &&
          formState.initialValues.spec.build?.commands?.length === 0 &&
          formState.initialValues.spec.build?.image?.length === 0 &&
          formState.initialValues.spec.image?.length === 0)) &&
      formState.values.extra.imageType.length === 0
    ) {
      formRef.current.change('spec.image', formState.initialValues.spec.image || DEFAULT_IMAGE)
      formRef.current.change('extra.imageType', EXISTING_IMAGE)
    } else if (formState.values.extra.imageType.length === 0) {
      formRef.current.change('extra.imageType', NEW_IMAGE)
    }
  }, [
    appStore.frontendSpec.default_function_image_by_kind,
    appStore.frontendSpec?.function_deployment_mlrun_command,
    appStore.frontendSpec?.function_deployment_target_image_template,
    formRef,
    formState.initialValues.spec.image,
    formState.initialValues.spec.build?.base_image?.length,
    formState.initialValues.spec.build?.commands?.length,
    formState.initialValues.spec.build?.image?.length,
    formState.values.extra.imageType.length,
    formState.values.kind,
    formState.values.metadata.name,
    formState.values.metadata.tag,
    mode,
    projectName
  ])

  const handleImageTypeChange = event => {
    if (event.target.value === EXISTING_IMAGE) {
      if (mode === PANEL_CREATE_MODE) {
        formRef.current.change('spec.build.base_image', '')
        formRef.current.change('spec.build.commands', '')
        formRef.current.change('spec.build.image', '')
        formRef.current.change(
          'spec.image',
          appStore.frontendSpec?.default_function_image_by_kind?.[formState.values.kind]
        )
      } else {
        formRef.current.change(
          'spec.image',
          formState.values.spec.image ||
            appStore.frontendSpec?.default_function_image_by_kind?.[formState.values.kind]
        )
      }
    } else if (event.target.value === NEW_IMAGE) {
      const buildImage = (appStore.frontendSpec?.function_deployment_target_image_template || '')
        .replace('{project}', projectName)
        .replace('{name}', formState.values.metadata.name)
        .replace('{tag}', formState.values.metadata.tag || TAG_LATEST)

      if (mode === PANEL_CREATE_MODE) {
        formRef.current.change('spec.image', '')
        formRef.current.change(
          'spec.build.commands',
          appStore.frontendSpec?.function_deployment_mlrun_command ?? ''
        )
        formRef.current.change(
          'spec.build.base_image',
          appStore.frontendSpec?.default_function_image_by_kind?.[formState.values.kind]
        )
        formRef.current.change('spec.build.image', buildImage)
      } else {
        formRef.current.change(
          'spec.build.commands',
          formState.values.spec.build.commands ||
            (appStore.frontendSpec?.function_deployment_mlrun_command ?? '')
        )
        formRef.current.change(
          'spec.build.base_image',
          formState.values.spec.build.base_image ||
            appStore.frontendSpec?.default_function_image_by_kind?.[formState.values.kind]
        )
        formRef.current.change(
          'spec.build.image',
          formState.values.spec.build.base_image || buildImage
        )
      }

      formRef.current.change(
        'spec.build.commands',
        formState.values.spec.build.commands.length > 0
          ? trimSplit(formState.values.spec.build.commands, '\n').join('\n')
          : trimSplit(appStore.frontendSpec?.function_deployment_mlrun_command ?? '', '\n').join(
              '\n'
            )
      )
      formRef.current.change(
        'spec.build.base_image',
        formState.values.spec.build.base_image ||
          appStore.frontendSpec?.default_function_image_by_kind?.[formState.values.kind]
      )
      formRef.current.change(
        'spec.build.image',
        formState.values.spec.build.base_image || buildImage
      )
    }

    formRef.current.change('extra.imageType', event.target.value)

    return event
  }

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
        {mode === PANEL_EDIT_MODE && (
          <FormCheckBox label="Force build" name="extra.skip_deployed" />
        )}
      </div>
      <div className="form-row">
        {generateCodeOptions.map(element => (
          <div className="form-col-auto" key={element.value}>
            <FormRadio name="extra.imageType" {...element} onClick={handleImageTypeChange} />
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
            formRef.current.change('spec.build.functionSourceCode', value)
            setEditCode(false)
          }}
        />
      )}
      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
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

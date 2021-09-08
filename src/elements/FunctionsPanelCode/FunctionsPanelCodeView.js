import React from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import Select from '../../common/Select/Select'
import Button from '../../common/Button/Button'
import EditorModal from '../../common/EditorModal/EditorModal'
import Input from '../../common/Input/Input'
import TextArea from '../../common/TextArea/TextArea'
import RadioButtons from '../../common/RadioButtons/RadioButtons'
import { trimSplit } from '../../utils'

import {
  DEFAULT_ENTRY,
  entryOptions,
  codeOptions,
  NEW_IMAGE,
  EXISTING_IMAGE
} from './functionsPanelCode.util'
import { LABEL_BUTTON } from '../../constants'

import { ReactComponent as Edit } from '../../images/edit.svg'

import './functionsPanelCode.scss'

const FunctionsPanelCodeView = ({
  appStore,
  data,
  editCode,
  functionsStore,
  handleHandlerOnBlur,
  handleImageTypeChange,
  imageType,
  setData,
  setEditCode,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionCommands,
  setNewFunctionImage,
  setNewFunctionSourceCode,
  setValidation,
  setNewFunctionWithMlrun,
  validation
}) => {
  return (
    <div className="functions-panel__item new-item-side-panel__item code">
      <FunctionsPanelSection title="Code">
        <div className="code__code-entry">
          <Select
            className="type"
            floatingLabel
            label="Code entry"
            onClick={entry => {
              setData(state => ({
                ...state,
                entry
              }))
            }}
            options={entryOptions}
            selectedId={data.entry}
          />
          {data.entry === DEFAULT_ENTRY && (
            <Button
              className="btn_edit"
              label={
                <span>
                  <Edit /> Edit source
                </span>
              }
              onClick={() => setEditCode(true)}
              variant={LABEL_BUTTON}
            />
          )}
        </div>
        <div className="code__info">
          <div className="code__handler">
            <Input
              floatingLabel
              invalid={!validation.isHandlerValid}
              label="Handler"
              onChange={handler => setData(state => ({ ...state, handler }))}
              onBlur={handleHandlerOnBlur}
              required
              setInvalid={value =>
                setValidation(state => ({ ...state, isHandlerValid: value }))
              }
              tip="Enter the function handler name (e.g. for the default sample function the name should be `handler`)"
              type="text"
              value={data.handler}
              wrapperClassName="handler"
            />
          </div>
          <div className="code__existing-image">
            <RadioButtons
              className="radio-buttons__block"
              elements={codeOptions}
              onChangeCallback={handleImageTypeChange}
              selectedValue={imageType}
            />
            <div className="code__images-inputs">
              <Input
                className="input__wide"
                disabled={imageType !== EXISTING_IMAGE}
                floatingLabel
                invalid={
                  !validation.isCodeImageValid && imageType === EXISTING_IMAGE
                }
                label="Image name"
                onBlur={event => {
                  if (
                    event.target.value !== functionsStore.newFunction.spec.image
                  ) {
                    setNewFunctionImage(data.image)
                  }
                }}
                onChange={image => setData(state => ({ ...state, image }))}
                required={imageType === EXISTING_IMAGE}
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isCodeImageValid: value
                  }))
                }
                tip="The name of the function‘s container image"
                type="text"
                value={data.image}
                wrapperClassName="image-name"
              />
              <Input
                className="input__wide"
                disabled={imageType !== NEW_IMAGE}
                floatingLabel
                label="Resulting Image"
                onBlur={event => {
                  if (
                    event.target.value !==
                    functionsStore.newFunction.spec.build.image
                  ) {
                    setNewFunctionBuildImage(data.build_image)
                  }
                }}
                onChange={build_image =>
                  setData(state => ({ ...state, build_image }))
                }
                tip="The name of the built container image"
                type="text"
                value={data.build_image}
                wrapperClassName="build-image"
              />
              <Input
                className="input__wide"
                disabled={imageType !== NEW_IMAGE}
                floatingLabel
                invalid={
                  !validation.isBaseImageValid && imageType === NEW_IMAGE
                }
                label="Base image"
                onBlur={event => {
                  if (
                    event.target.value !==
                    functionsStore.newFunction.spec.build.base_image
                  ) {
                    setNewFunctionBaseImage(data.base_image)
                  }
                }}
                onChange={base_image =>
                  setData(state => ({ ...state, base_image }))
                }
                required={imageType === NEW_IMAGE}
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isBaseImageValid: value
                  }))
                }
                tip="The name of a base container image from which to build the function's processor image"
                type="text"
                value={data.base_image}
                wrapperClassName="base-image"
              />
            </div>
          </div>
        </div>
        <TextArea
          disabled={imageType !== NEW_IMAGE}
          floatingLabel
          label="Build commands"
          onChange={commands =>
            setData(state => ({
              ...state,
              commands
            }))
          }
          invalid={!validation.isBuildCommandsValid && imageType === NEW_IMAGE}
          onBlur={event => {
            if (
              !isEqual(
                trimSplit(event.target.value, '\n'),
                functionsStore.newFunction.spec.build.commands
              )
            ) {
              setNewFunctionWithMlrun(
                appStore.frontendSpec.function_deployment_mlrun_command ===
                  event.target.value
              )
              setNewFunctionCommands(trimSplit(data.commands, '\n'))
            }
          }}
          required={imageType === NEW_IMAGE}
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isBuildCommandsValid: value
            }))
          }
          type="text"
          value={data.commands}
          wrapperClassName="commands"
        />
        {editCode && (
          <EditorModal
            closeModal={() => setEditCode(false)}
            defaultData={
              functionsStore.newFunction.spec.build.functionSourceCode
            }
            handleSaveCode={value => {
              setEditCode(false)
              setNewFunctionSourceCode(value)
            }}
          />
        )}
      </FunctionsPanelSection>
    </div>
  )
}

FunctionsPanelCodeView.propTypes = {
  appStore: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({}).isRequired,
  editCode: PropTypes.bool.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  handleHandlerOnBlur: PropTypes.func.isRequired,
  handleImageTypeChange: PropTypes.func.isRequired,
  imageType: PropTypes.string.isRequired,
  setData: PropTypes.func.isRequired,
  setEditCode: PropTypes.func.isRequired,
  setNewFunctionBaseImage: PropTypes.func.isRequired,
  setNewFunctionBuildImage: PropTypes.func.isRequired,
  setNewFunctionCommands: PropTypes.func.isRequired,
  setNewFunctionImage: PropTypes.func.isRequired,
  setNewFunctionSourceCode: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FunctionsPanelCodeView

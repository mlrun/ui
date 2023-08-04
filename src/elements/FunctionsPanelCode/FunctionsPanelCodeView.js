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
import { isEqual } from 'lodash'

import CheckBox from '../../common/CheckBox/CheckBox'
import EditorModal from '../../common/EditorModal/EditorModal'
import Input from '../../common/Input/Input'
import PanelSection from '../PanelSection/PanelSection'
import RadioButtons from '../../common/RadioButtons/RadioButtons'
import Select from '../../common/Select/Select'
import TextArea from '../../common/TextArea/TextArea'
import { Button } from 'igz-controls/components'

import { splitTrim, trimSplit } from '../../utils'
import {
  DEFAULT_ENTRY,
  entryOptions,
  generateCodeOptions,
  NEW_IMAGE,
  EXISTING_IMAGE
} from './functionsPanelCode.util'
import { FUNCTION_TYPE_SERVING, PANEL_EDIT_MODE } from '../../constants'
import { LABEL_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'

import './functionsPanelCode.scss'

const FunctionsPanelCodeView = ({
  data,
  editCode,
  functionsStore,
  handleClassOnBlur,
  handleHandlerOnBlur,
  handleImageTypeChange,
  imageType,
  mode,
  setData,
  setEditCode,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionRequirements,
  setNewFunctionCommands,
  setNewFunctionForceBuild,
  setNewFunctionImage,
  setNewFunctionSourceCode,
  setValidation,
  validation
}) => {
  return (
    <div className="functions-panel__item new-item-side-panel__item code">
      <PanelSection title="Code">
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
                <>
                  <Edit />
                  <span>Edit source</span>
                </>
              }
              onClick={() => setEditCode(true)}
              variant={LABEL_BUTTON}
            />
          )}
        </div>
        <div className="code__info">
          <div className="code__info_left">
            {functionsStore.newFunction.kind === FUNCTION_TYPE_SERVING ? (
              <div className="code__default-class">
                <Input
                  floatingLabel
                  invalid={!validation.isDefaultCLassValid}
                  label="Default class"
                  onChange={default_class => setData(state => ({ ...state, default_class }))}
                  onBlur={handleClassOnBlur}
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isDefaultCLassValid: value
                    }))
                  }
                  value={data.default_class}
                />
              </div>
            ) : (
              <div className="code__handler">
                <Input
                  floatingLabel
                  invalid={!validation.isHandlerValid}
                  label="Default handler"
                  onChange={handler => setData(state => ({ ...state, handler }))}
                  onBlur={handleHandlerOnBlur}
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isHandlerValid: value
                    }))
                  }
                  tip="Enter the function handler name (e.g. for the default sample function the name should be `handler`)"
                  value={data.handler}
                  wrapperClassName="handler"
                />
              </div>
            )}
            {mode === PANEL_EDIT_MODE && (
              <div className="code__force-build">
                <CheckBox
                  item={{ id: 'enabled', label: 'Force build' }}
                  onChange={() =>
                    setNewFunctionForceBuild(!functionsStore.newFunction.skip_deployed)
                  }
                  selectedId={functionsStore.newFunction.skip_deployed ? 'enabled' : ''}
                />
              </div>
            )}
          </div>
          <div className="code__info_right">
            <div className="code__existing-image">
              <RadioButtons
                className="radio-buttons__block"
                elements={generateCodeOptions(mode)}
                onChangeCallback={handleImageTypeChange}
                selectedValue={imageType}
              />
              <div className="code__images-inputs">
                <Input
                  className="input__wide"
                  disabled={imageType !== EXISTING_IMAGE}
                  floatingLabel
                  invalid={!validation.isCodeImageValid && imageType === EXISTING_IMAGE}
                  label="Image name"
                  onBlur={event => {
                    if (event.target.value !== functionsStore.newFunction.spec.image) {
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
                  value={data.image}
                  wrapperClassName="image-name"
                />
                <Input
                  className="input__wide"
                  disabled={imageType !== NEW_IMAGE}
                  floatingLabel
                  invalid={!validation.isBuildImageValid}
                  label="Resulting Image"
                  onBlur={event => {
                    if (event.target.value !== functionsStore.newFunction.spec.build.image) {
                      setNewFunctionBuildImage(data.build_image)
                    }
                  }}
                  onChange={build_image => setData(state => ({ ...state, build_image }))}
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isBuildImageValid: value
                    }))
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
                  invalid={!validation.isBaseImageValid && imageType === NEW_IMAGE}
                  label="Base image"
                  onBlur={event => {
                    if (event.target.value !== functionsStore.newFunction.spec.build.base_image) {
                      setNewFunctionBaseImage(data.base_image)
                    }
                  }}
                  onChange={base_image => setData(state => ({ ...state, base_image }))}
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
        </div>
        <div className="code__build">
          <Input
            disabled={imageType !== NEW_IMAGE}
            floatingLabel
            label="Requirements (separate values using comma)"
            onChange={requirements =>
              setData(state => ({
                ...state,
                requirements
              }))
            }
            invalid={!validation.isBuildRequirementValid && imageType === NEW_IMAGE}
            onBlur={event => {
              if (
                !isEqual(
                  splitTrim(event.target.value, ','),
                  functionsStore.newFunction.spec.build.requirements
                )
              ) {
                setNewFunctionRequirements(splitTrim(data.requirements, ','))
              }
            }}
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isBuildRequirementValid: value
              }))
            }
            value={data.requirements}
            wrapperClassName="requirements"
          />
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
                setNewFunctionCommands(trimSplit(data.commands, '\n'))
              }
            }}
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isBuildCommandsValid: value
              }))
            }
            value={data.commands}
            wrapperClassName="commands"
          />
        </div>
        {editCode && (
          <EditorModal
            closeModal={() => setEditCode(false)}
            defaultData={functionsStore.newFunction.spec.build.functionSourceCode}
            handleSaveCode={value => {
              setEditCode(false)
              setNewFunctionSourceCode(value)
            }}
          />
        )}
      </PanelSection>
    </div>
  )
}

FunctionsPanelCodeView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  editCode: PropTypes.bool.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  handleClassOnBlur: PropTypes.func.isRequired,
  handleHandlerOnBlur: PropTypes.func.isRequired,
  handleImageTypeChange: PropTypes.func.isRequired,
  imageType: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  setData: PropTypes.func.isRequired,
  setEditCode: PropTypes.func.isRequired,
  setNewFunctionBaseImage: PropTypes.func.isRequired,
  setNewFunctionBuildImage: PropTypes.func.isRequired,
  setNewFunctionCommands: PropTypes.func.isRequired,
  setNewFunctionForceBuild: PropTypes.func.isRequired,
  setNewFunctionImage: PropTypes.func.isRequired,
  setNewFunctionRequirements: PropTypes.func.isRequired,
  setNewFunctionSourceCode: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FunctionsPanelCodeView

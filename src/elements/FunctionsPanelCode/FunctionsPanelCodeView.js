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

import {
  DEFAULT_ENTRY,
  entryOptions,
  codeOptions,
  NEW_IMAGE,
  EXISTING_IMAGE
} from './functionsPanelCode.util'

import { ReactComponent as Edit } from '../../images/edit.svg'

import './functionsPanelCode.scss'

const FunctionsPanelCodeView = ({
  data,
  editCode,
  functionsStore,
  handleHandlerChange,
  handleHandlerOnBlur,
  imageType,
  isHandlerValid,
  setData,
  setEditCode,
  setImageType,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionCommands,
  setNewFunctionImage,
  setNewFunctionSourceCode
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
              variant="label"
            />
          )}
        </div>
        <div className="code__info">
          <div className="code__handler">
            <Input
              floatingLabel
              invalid={!isHandlerValid}
              invalidText="This field is invalid"
              label="Handler"
              onChange={handleHandlerChange}
              onBlur={event => handleHandlerOnBlur(event)}
              required
              requiredText="This field is required"
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
              onChangeCallback={setImageType}
              selectedValue={imageType}
            />
            <div className="code__images-inputs">
              <Input
                className="input__wide"
                disabled={imageType !== EXISTING_IMAGE}
                floatingLabel
                label="Image name"
                onBlur={event => {
                  if (
                    event.target.value !== functionsStore.newFunction.spec.image
                  ) {
                    setNewFunctionImage(data.image)
                  }
                }}
                onChange={image => setData(state => ({ ...state, image }))}
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
          onBlur={event => {
            if (
              event.target.value.length > 0 &&
              !isEqual(
                event.target.value.split('\n'),
                functionsStore.newFunction.spec.build.commands
              )
            ) {
              setNewFunctionCommands(data.commands.split('\n'))
            }
          }}
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
  data: PropTypes.shape({}).isRequired,
  editCode: PropTypes.bool.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  handleHandlerChange: PropTypes.func.isRequired,
  handleHandlerOnBlur: PropTypes.func.isRequired,
  imageType: PropTypes.string.isRequired,
  isHandlerValid: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  setEditCode: PropTypes.func.isRequired,
  setImageType: PropTypes.func.isRequired,
  setNewFunctionBaseImage: PropTypes.func.isRequired,
  setNewFunctionBuildImage: PropTypes.func.isRequired,
  setNewFunctionCommands: PropTypes.func.isRequired,
  setNewFunctionImage: PropTypes.func.isRequired,
  setNewFunctionSourceCode: PropTypes.func.isRequired
}

export default FunctionsPanelCodeView

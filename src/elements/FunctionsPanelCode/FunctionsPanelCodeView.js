import React from 'react'
import PropTypes from 'prop-types'

import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import Select from '../../common/Select/Select'
import Button from '../../common/Button/Button'
import EditorModal from '../../common/EditorModal/EditorModal'
import Input from '../../common/Input/Input'
import TextArea from '../../common/TextArea/TextArea'

import { DEFAULT_ENTRY, entryOptions } from './functionsPanelCode.util'

import { ReactComponent as Edit } from '../../images/edit.svg'

import './functionsPanelCode.scss'

const FunctionsPanelCodeView = ({
  data,
  editCode,
  functionsStore,
  handleHandlerChange,
  handleHandlerOnBlur,
  isHandlerValid,
  setData,
  setEditCode,
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
          <Input
            floatingLabel
            label="Handler"
            onChange={handleHandlerChange}
            onBlur={handleHandlerOnBlur}
            required={!isHandlerValid}
            requiredText="This field is required"
            type="text"
            value={data.handler}
            wrapperClassName="handler"
          />
          <Input
            disabled={data.base_image.length > 0 || data.build_image.length > 0}
            floatingLabel
            label="Image name"
            onChange={image => setData(state => ({ ...state, image }))}
            onBlur={() => setNewFunctionImage(data.image)}
            type="text"
            value={data.image}
            wrapperClassName="image-name"
          />
          <Input
            disabled={data.image.length > 0}
            floatingLabel
            label="Build image"
            onChange={build_image =>
              setData(state => ({ ...state, build_image }))
            }
            onBlur={() => setNewFunctionBuildImage(data.build_image)}
            type="text"
            value={data.build_image}
            wrapperClassName="build-image"
          />
          <Input
            disabled={data.image.length > 0}
            floatingLabel
            label="Base image"
            onChange={base_image =>
              setData(state => ({ ...state, base_image }))
            }
            onBlur={() => setNewFunctionBaseImage(data.base_image)}
            type="text"
            value={data.base_image}
            wrapperClassName="base-image"
          />
        </div>
        <TextArea
          floatingLabel
          label="Build commands"
          onChange={commands =>
            setData(state => ({
              ...state,
              commands
            }))
          }
          onBlur={() => {
            setNewFunctionCommands(data.commands.split('\n'))
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
  isHandlerValid: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  setEditCode: PropTypes.func.isRequired,
  setNewFunctionBaseImage: PropTypes.func.isRequired,
  setNewFunctionBuildImage: PropTypes.func.isRequired,
  setNewFunctionCommands: PropTypes.func.isRequired,
  setNewFunctionImage: PropTypes.func.isRequired,
  setNewFunctionSourceCode: PropTypes.func.isRequired
}

export default FunctionsPanelCodeView

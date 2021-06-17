import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelCodeView from './FunctionsPanelCodeView'

import functionsActions from '../../actions/functions'
import {
  DEFAULT_ENTRY,
  DEFAULT_HANDLER,
  DEFAULT_IMAGE,
  DEFAULT_SOURCE_CODE,
  EXISTING_IMAGE
} from './functionsPanelCode.util'

const FunctionsPanelCode = ({
  functionsStore,
  isHandlerValid,
  resetNewFunctionCodeCustomImage,
  setHandlerValid,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionCommands,
  setNewFunctionHandler,
  setNewFunctionImage,
  setNewFunctionSourceCode
}) => {
  const [data, setData] = useState({
    entry: DEFAULT_ENTRY,
    handler: DEFAULT_HANDLER,
    image: DEFAULT_IMAGE,
    base_image: '',
    commands: '',
    build_image: ''
  })
  const [editCode, setEditCode] = useState(false)
  const [imageType, setImageType] = useState(EXISTING_IMAGE)

  const handleHandlerChange = handler => {
    if (!isHandlerValid && handler.length > 0) {
      setHandlerValid(true)
    }

    setData(state => ({
      ...state,
      handler
    }))
  }

  const handleHandlerOnBlur = () => {
    if (data.handler.length === 0) {
      setHandlerValid(false)
    } else {
      setNewFunctionHandler(data.handler)
    }
  }

  useEffect(() => {
    if (!functionsStore.newFunction.spec.build.functionSourceCode) {
      setNewFunctionSourceCode(DEFAULT_SOURCE_CODE)
    }
  }, [
    functionsStore.newFunction.spec.build.functionSourceCode,
    setNewFunctionSourceCode
  ])

  useEffect(() => {
    if (!functionsStore.newFunction.spec.default_handler) {
      setNewFunctionHandler(DEFAULT_HANDLER)
    }
  }, [functionsStore.newFunction.spec.default_handler, setNewFunctionHandler])

  useEffect(() => {
    if (imageType === EXISTING_IMAGE) {
      setNewFunctionImage(DEFAULT_IMAGE)
      resetNewFunctionCodeCustomImage()
      setData(state => ({
        ...state,
        base_image: '',
        commands: '',
        build_image: '',
        image: DEFAULT_IMAGE
      }))
    } else {
      setNewFunctionImage('')
      setData(state => ({
        ...state,
        image: ''
      }))
    }
  }, [imageType, resetNewFunctionCodeCustomImage, setNewFunctionImage])

  return (
    <FunctionsPanelCodeView
      data={data}
      editCode={editCode}
      functionsStore={functionsStore}
      handleHandlerChange={handleHandlerChange}
      handleHandlerOnBlur={handleHandlerOnBlur}
      imageType={imageType}
      isHandlerValid={isHandlerValid}
      setData={setData}
      setEditCode={setEditCode}
      setImageType={setImageType}
      setNewFunctionBaseImage={setNewFunctionBaseImage}
      setNewFunctionBuildImage={setNewFunctionBuildImage}
      setNewFunctionCommands={setNewFunctionCommands}
      setNewFunctionImage={setNewFunctionImage}
      setNewFunctionSourceCode={setNewFunctionSourceCode}
    />
  )
}

FunctionsPanelCode.propTypes = {
  isHandlerValid: PropTypes.bool.isRequired,
  setHandlerValid: PropTypes.func.isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelCode)

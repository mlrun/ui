import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import FunctionsPanelCodeView from './FunctionsPanelCodeView'

import functionsActions from '../../actions/functions'
import {
  DEFAULT_ENTRY,
  DEFAULT_HANDLER,
  DEFAULT_IMAGE,
  DEFAULT_SOURCE_CODE,
  EXISTING_IMAGE,
  NEW_IMAGE
} from './functionsPanelCode.util'

const FunctionsPanelCode = ({
  defaultData,
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
    handler: defaultData.default_handler ?? DEFAULT_HANDLER,
    image: defaultData.image ?? DEFAULT_IMAGE,
    base_image: defaultData.build?.base_image ?? '',
    commands: (defaultData.build?.commands || []).join('\n') ?? '',
    build_image: defaultData.build?.image ?? ''
  })
  const [editCode, setEditCode] = useState(false)
  const [imageType, setImageType] = useState(
    defaultData.build?.image || defaultData.build?.base_image
      ? NEW_IMAGE
      : EXISTING_IMAGE
  )

  const handleHandlerOnBlur = event => {
    if (functionsStore.newFunction.spec.default_handler !== data.handler) {
      setNewFunctionHandler(data.handler)
    }
  }

  useEffect(() => {
    if (
      !functionsStore.newFunction.spec.build.functionSourceCode &&
      isNil(defaultData.build?.functionSourceCode)
    ) {
      setNewFunctionSourceCode(DEFAULT_SOURCE_CODE)
    }
  }, [
    defaultData.build,
    functionsStore.newFunction.spec.build.functionSourceCode,
    setNewFunctionSourceCode
  ])

  useEffect(() => {
    if (
      !functionsStore.newFunction.spec.default_handler &&
      isNil(defaultData.default_handler)
    ) {
      setNewFunctionHandler(DEFAULT_HANDLER)
    }
  }, [
    defaultData.default_handler,
    functionsStore.newFunction.spec.default_handler,
    setNewFunctionHandler
  ])

  useEffect(() => {
    if (imageType === EXISTING_IMAGE) {
      setNewFunctionImage(defaultData.image ?? DEFAULT_IMAGE)
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
  }, [
    defaultData.image,
    imageType,
    resetNewFunctionCodeCustomImage,
    setNewFunctionImage
  ])

  return (
    <FunctionsPanelCodeView
      data={data}
      editCode={editCode}
      functionsStore={functionsStore}
      handleHandlerOnBlur={handleHandlerOnBlur}
      imageType={imageType}
      isHandlerValid={isHandlerValid}
      setData={setData}
      setEditCode={setEditCode}
      setHandlerValid={setHandlerValid}
      setImageType={setImageType}
      setNewFunctionBaseImage={setNewFunctionBaseImage}
      setNewFunctionBuildImage={setNewFunctionBuildImage}
      setNewFunctionCommands={setNewFunctionCommands}
      setNewFunctionImage={setNewFunctionImage}
      setNewFunctionSourceCode={setNewFunctionSourceCode}
    />
  )
}

FunctionsPanelCode.defaultProps = {
  defaultData: {}
}

FunctionsPanelCode.propTypes = {
  defaultData: PropTypes.shape({}),
  isHandlerValid: PropTypes.bool.isRequired,
  setHandlerValid: PropTypes.func.isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelCode)

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelCodeView from './FunctionsPanelCodeView'

import functionsActions from '../../actions/functions'
import { DEFAULT_ENTRY } from './functionsPanelCode.util'

const FunctionsPanelCode = ({
  functionsStore,
  isHandlerValid,
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
    handler: '',
    image: '',
    base_image: '',
    commands: '',
    build_image: ''
  })
  const [editCode, setEditCode] = useState(false)

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

  return (
    <FunctionsPanelCodeView
      data={data}
      functionsStore={functionsStore}
      handleHandlerChange={handleHandlerChange}
      handleHandlerOnBlur={handleHandlerOnBlur}
      isHandlerValid={isHandlerValid}
      setData={setData}
      setNewFunctionBaseImage={setNewFunctionBaseImage}
      setNewFunctionBuildImage={setNewFunctionBuildImage}
      setNewFunctionCommands={setNewFunctionCommands}
      setNewFunctionImage={setNewFunctionImage}
      setNewFunctionSourceCode={setNewFunctionSourceCode}
      editCode={editCode}
      setEditCode={setEditCode}
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

import React, { useState } from 'react'
import { connect } from 'react-redux'

import FunctionsPanelCodeView from './FunctionsPanelCodeView'

import functionsActions from '../../actions/functions'
import { DEFAULT_ENTRY } from './functionsPanelCode.util'

const FunctionsPanelCode = ({
  functionsStore,
  setNewFunctionBaseImage,
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
    commands: ''
  })
  const [editCode, setEditCode] = useState(false)

  return (
    <FunctionsPanelCodeView
      data={data}
      functionsStore={functionsStore}
      setData={setData}
      setNewFunctionBaseImage={setNewFunctionBaseImage}
      setNewFunctionCommands={setNewFunctionCommands}
      setNewFunctionHandler={setNewFunctionHandler}
      setNewFunctionImage={setNewFunctionImage}
      setNewFunctionSourceCode={setNewFunctionSourceCode}
      editCode={editCode}
      setEditCode={setEditCode}
    />
  )
}

FunctionsPanelCode.propTypes = {}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelCode)

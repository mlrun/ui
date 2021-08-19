import React, { useState } from 'react'
import { connect } from 'react-redux'

import FunctionsPanelParameters from '../FunctionsPanelParameters/FunctionsPanelParameters'
import FunctionsPanelSection from '../FunctionsPanelSection/FunctionsPanelSection'
import Input from '../../common/Input/Input'

import functionsActions from '../../actions/functions'

const FunctionsPanelAdvanced = ({
  functionsStore,
  setNewFunctionErrorStream
}) => {
  const [data, setData] = useState({
    error_stream: ''
  })

  return (
    <FunctionsPanelSection title="Advanced" className="advanced">
      <FunctionsPanelParameters />
      <Input
        floatingLabel
        label="Stream Path"
        tip=" Enables users to store the function error in a V3IO stream"
        value={data.error_stream}
        onChange={error_stream =>
          setData(state => ({ ...state, error_stream }))
        }
        onBlur={() => {
          if (
            functionsStore.newFunction.spec.error_stream !== data.error_stream
          ) {
            setNewFunctionErrorStream(data.error_stream)
          }
        }}
      />
    </FunctionsPanelSection>
  )
}

export default connect(
  functionsStore => ({
    ...functionsStore
  }),
  { ...functionsActions }
)(FunctionsPanelAdvanced)

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
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelParameters from '../FunctionsPanelParameters/FunctionsPanelParameters'
import PanelSection from '../PanelSection/PanelSection'
import Input from '../../common/Input/Input'

import { setNewFunctionErrorStream } from '../../reducers/functionReducer'

const FunctionsPanelAdvanced = ({ defaultData, setValidation, validation }) => {
  const [data, setData] = useState({
    error_stream: defaultData.error_stream ?? ''
  })
  const dispatch = useDispatch()
  const functionsStore = useSelector(store => store.functionsStore)

  return (
    <PanelSection title="Advanced" className="advanced">
      <FunctionsPanelParameters defaultData={defaultData} />
      <Input
        floatingLabel
        invalid={!validation.isErrorStreamPathValid}
        label="Stream Path"
        tip=" Enables users to store the function error in a V3IO stream"
        value={data.error_stream}
        onChange={error_stream => setData(state => ({ ...state, error_stream }))}
        onBlur={() => {
          if (functionsStore.newFunction.spec.error_stream !== data.error_stream) {
            dispatch(setNewFunctionErrorStream(data.error_stream))
          }
        }}
        setInvalid={value =>
          setValidation(state => ({
            ...state,
            isErrorStreamPathValid: value
          }))
        }
        type="text"
      />
    </PanelSection>
  )
}

FunctionsPanelAdvanced.propTypes = {
  defaultData: PropTypes.object.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default FunctionsPanelAdvanced

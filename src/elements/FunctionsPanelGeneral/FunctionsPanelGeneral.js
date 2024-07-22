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
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelGeneralView from './FunctionsPanelGeneralView'

import functionsActions from '../../actions/functions'

const FunctionsPanelGeneral = ({
  defaultData,
  formState,
  frontendSpec,
  functionsStore,
  setNewFunctionDescription
}) => {
  const [data, setData] = useState({
    description: defaultData.description ?? '',
    kind: defaultData.type ?? functionsStore.newFunction.kind,
    name: defaultData.name ?? functionsStore.newFunction.metadata.name,
    tag: defaultData.tag ?? functionsStore.newFunction.metadata.tag
  })

  const handleDescriptionOnBlur = () => {
    if (functionsStore.newFunction.spec.description !== data.description) {
      setNewFunctionDescription(data.description)
    }
  }

  return (
    <FunctionsPanelGeneralView
      data={data}
      formState={formState}
      frontendSpec={frontendSpec}
      handleDescriptionOnBlur={handleDescriptionOnBlur}
      setData={setData}
      setNewFunctionDescription={setNewFunctionDescription}
    />
  )
}

FunctionsPanelGeneral.defaultProps = {
  defaultData: {}
}

FunctionsPanelGeneral.propTypes = {
  defaultData: PropTypes.shape({})
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelGeneral)

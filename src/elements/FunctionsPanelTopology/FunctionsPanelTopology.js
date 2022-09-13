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
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isNil } from 'lodash'

import FunctionsPanelTopologyView from './FunctionsPanelTopologyView'

import functionsActions from '../../actions/functions'

const FunctionsPanelTopology = ({
  defaultData,
  functionsStore,
  setNewFunctionGraph,
  setNewFunctionTrackModels
}) => {
  const [data, setData] = useState({
    class_name: defaultData.graph?.class_name ?? 'none',
    track_models: defaultData.track_models ? 'trackModels' : ''
  })

  useEffect(() => {
    if (isNil(defaultData)) {
      setNewFunctionGraph({ kind: 'router' })
    }
  }, [defaultData, setNewFunctionGraph])

  const selectRouterType = type => {
    const newFunctionGraph = { ...functionsStore.newFunction.spec.graph }

    if (type === 'none') {
      delete newFunctionGraph.class_name
    } else {
      newFunctionGraph.class_name = type
    }

    setData(state => ({
      ...state,
      class_name: type
    }))
    setNewFunctionGraph(newFunctionGraph)
  }

  const handleTrackModels = id => {
    setData(state => ({
      ...state,
      track_models: id === state.track_models ? '' : id
    }))
    setNewFunctionTrackModels(id !== data.track_models)
  }

  return (
    <FunctionsPanelTopologyView
      data={data}
      defaultData={defaultData}
      handleTrackModels={handleTrackModels}
      selectRouterType={selectRouterType}
    />
  )
}

FunctionsPanelTopology.propTypes = {
  defaultData: PropTypes.shape({}).isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelTopology)

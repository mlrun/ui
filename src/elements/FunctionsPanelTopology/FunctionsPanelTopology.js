import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelTopologyView from './FunctionsPanelTopologyView'

import functionsActions from '../../actions/functions'

const FunctionsPanelTopology = ({
  defaultData,
  functionsStore,
  setNewFunctionGraph,
  setNewFunctionTrackModels
}) => {
  const [data, setData] = useState({
    class_name: defaultData.class_name ?? 'none',
    track_models: defaultData.track_models ?? false
  })

  useEffect(() => {
    setNewFunctionGraph({ kind: 'router' })
  }, [setNewFunctionGraph])

  const selectRouterType = type => {
    const newFunctionGraph = functionsStore.newFunction.spec.graph

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
      handleTrackModels={handleTrackModels}
      selectRouterType={selectRouterType}
    />
  )
}

FunctionsPanelTopology.defaultProps = {
  defaultData: {}
}

FunctionsPanelTopology.propTypes = {
  defaultData: PropTypes.shape({})
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelTopology)

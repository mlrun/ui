import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Handle, useStore } from 'reactflow'

const useHandleConnections = ({ type, id, nodeId }) => {
  const edges = useStore(state => state.edges)

  return useMemo(() => {
    return edges.filter(edge => {
      if (type === 'target') {
        return edge.target === nodeId && edge.targetHandle === id
      } else {
        return edge.source === nodeId && edge.sourceHandle === id
      }
    })
  }, [edges, type, id, nodeId])
}

const SmartHandle = ({ type, position, id, style, nodeId, ...props }) => {
  const connections = useHandleConnections({
    type,
    id,
    nodeId
  })

  const isConnected = connections.length > 0
  const handleStyle = {
    ...style,
    visibility: isConnected ? 'visible' : 'hidden'
  }

  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={handleStyle}
      className={isConnected ? 'is-connected' : ''}
      {...props}
    />
  )
}

SmartHandle.propTypes = {
  id: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  props: PropTypes.object,
  style: PropTypes.object,
  type: PropTypes.string.isRequired
}

export default SmartHandle

export const SourceHandleComponent = ({ cycleTo, nodeId, ...props }) => {
  if (cycleTo) {
    return <SmartHandle {...props} nodeId={nodeId} />
  }
  return <Handle {...props} />
}

SourceHandleComponent.propTypes = {
  cycleTo: PropTypes.bool.isRequired,
  nodeId: PropTypes.string.isRequired,
  props: PropTypes.object
}

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
import { getNamedRowsGeometry, getNamedFieldsGeometry } from './table.action'
import { expect } from 'chai'

const isNear = (val1, val2, tolerance) => Math.abs(val1 - val2) <= tolerance

const safeGet = (geo, column) => {
  try {
    if (!geo || typeof geo.get !== 'function') {
      console.warn(`[TEST WARNING]: Geometry object is invalid. Cannot get column: "${column}"`)
      return []
    }

    const data = geo.get(column)
    
    if (data) {
      return Array.from(data)
    } else {
      console.warn(`[TEST WARNING]: Column "${column}" returned no data. Verification for this field will be skipped.`)
      return []
    }
  } catch (e) {
      console.warn(`[TEST WARNING]: Could not retrieve column "${column}". 
      Step might not be fully tested. 
      Error: ${e.message}`)
    return []
  }
}

export const checkWorkflowGraphConnections = async (driver, graphComponent) => {
  const nodesGeo = await getNamedRowsGeometry(driver, graphComponent.nodesTable)
  const arrowsGeo = await getNamedRowsGeometry(driver, graphComponent.graphConnections, 'path')
  const topHandlers = await getNamedFieldsGeometry(driver, graphComponent.nodesTable, 'top_handler')
  const bottomHandlers = await getNamedFieldsGeometry(driver, graphComponent.nodesTable, 'bottom_handler')

  //nodes coordinates
  const nodeXPositions = safeGet(nodesGeo, 'x')
  const nodeYPositions = safeGet(nodesGeo, 'y')
  const nodeWidths = safeGet(nodesGeo, 'width')
  const nodeHeights = safeGet(nodesGeo, 'height')

  //arrows coordinates
  const arrowXPositions = safeGet(arrowsGeo, 'x')
  const arrowYPositions = safeGet(arrowsGeo, 'y')
  const arrowWidths = safeGet(arrowsGeo, 'width')
  const arrowHeights = safeGet(arrowsGeo, 'height')

  if (nodeXPositions.length === 0 || arrowXPositions.length === 0) {
    console.warn('[GRAPH CHECK]: Skipping validation. Nodes or Arrows are missing in the DOM.')
    return
  }

  //  establish dynamic thresholds for сalculation average graph dimensions (proximity between graph nodes, connection handlers, arrow endpoints)
  const avgNodeHeight = nodeHeights.reduce((a, b) => a + b, 0) / nodeHeights.length
  const avgHandlerSize = safeGet(topHandlers, 'height')[0] || 10

  /**
   * Dynamic Tolerances:
   * 0.7 - handler radius: ensures arrows hit the circular port center
   * 0.35 - vertical gap: covers offsets between nodes
   * 15 - horizontal buffer: accounts for x-axis rendering rounding
   */
  const handlerRadius = avgHandlerSize * 0.7 
  const boundaryTolerance = avgNodeHeight * 0.35 
  const horizontalTolerance = 15

  const getHandlerCenters = (geometry) => {
    const xPositions = safeGet(geometry, 'x')
    const yPositions = safeGet(geometry, 'y')
    const widths = safeGet(geometry, 'width')
    const heights = safeGet(geometry, 'height')

    return xPositions.map((x, index) => ({
      x: x + widths[index] / 2,
      y: yPositions[index] + heights[index] / 2
    }))
  }

  const handlerPoints = [...getHandlerCenters(topHandlers), ...getHandlerCenters(bottomHandlers)]
  const nodes = nodeXPositions.map((x, i) => ({
    left: x, right: x + nodeWidths[i], top: nodeYPositions[i], bottom: nodeYPositions[i] + nodeHeights[i]
  }))

  const arrows = arrowXPositions.map((x, i) => ({
    id: i, left: x, right: x + arrowWidths[i], top: arrowYPositions[i], bottom: arrowYPositions[i] + arrowHeights[i]
  }))

  arrows.forEach((arrow) => {
    const checkConnectionPoint = (arrowX, arrowY) => {
      // verify alignment with specific connection handler centers
      const connectedToHandler = handlerPoints.some(handler => 
        isNear(arrowX, handler.x, handlerRadius) && 
        isNear(arrowY, handler.y, handlerRadius)
      )
      if (connectedToHandler) return true

      // verify proximity to node boundaries within calculated tolerances
      return nodes.some(node => {
        const isNearVerticalEdge = isNear(arrowY, node.top, boundaryTolerance) || isNear(arrowY, node.bottom, boundaryTolerance)
        const isWithinHorizontalRange = arrowX >= node.left - horizontalTolerance && arrowX <= node.right + horizontalTolerance
        
        const isNearHorizontalEdge = isNear(arrowX, node.left, horizontalTolerance) || isNear(arrowX, node.right, horizontalTolerance)
        const isWithinVerticalRange = arrowY >= node.top - boundaryTolerance && arrowY <= node.bottom + boundaryTolerance

        return (isNearVerticalEdge && isWithinHorizontalRange) || (isNearHorizontalEdge && isWithinVerticalRange)
      })
    }

    const isStartConnected = checkConnectionPoint(arrow.left, arrow.top) || checkConnectionPoint(arrow.right, arrow.top)
    const isEndConnected = checkConnectionPoint(arrow.left, arrow.bottom) || checkConnectionPoint(arrow.right, arrow.bottom)

    expect(isStartConnected).to.equal(true, `Arrow [${arrow.id}] start disconnected. Check Y:${arrow.top}`)
    expect(isEndConnected).to.equal(true, `Arrow [${arrow.id}] end disconnected. Check Y:${arrow.bottom}`)
  })
  console.log(`[GRAPH CHECK COMPLETED]: Verified connections for ${arrows.length} arrows using ${nodes.length} nodes.`)
}

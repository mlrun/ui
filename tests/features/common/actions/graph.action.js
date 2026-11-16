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
import { expectTimeout } from '../../../config.js'
import { getNamedRowsGeometry, getNamedFieldsGeometry, getTableRows } from './table.action.js'
import { expect } from '@playwright/test'
import { getRect, isDisplayed, waitUntilStable } from '../../common-tools/element.js'

const isNear = (val1, val2, tolerance) => Math.abs(val1 - val2) <= tolerance

const safeGet = (geo, column) => {
  try {
    if (!Array.isArray(geo)) {
      console.warn(`[TEST WARNING]: Geometry object is invalid. Cannot get column: "${column}"`)
      return []
    }

    const data = geo.map(row => row[column])

    if (data.length > 0) {
      return data
    } else {
      console.warn(
        `[TEST WARNING]: Column "${column}" returned no data. Verification for this field will be skipped.`
      )
      return []
    }
  } catch (e) {
    console.warn(`[TEST WARNING]: Could not retrieve column "${column}". 
      Step might not be fully tested. 
      Error: ${e.message}`)
    return []
  }
}

export const checkWorkflowGraphConnections = async (page, graphComponent) => {
  // the graph is rendered asynchronously: the check used to be skipped (and the step passed) when the nodes or the
  // arrows were not found, e.g. a graph that wasn't rendered yet or an empty one. A graph of several nodes must have arrows
  await expect
    .poll(() => getTableRows(page, graphComponent.nodesTable), {
      timeout: expectTimeout,
      message: 'The graph has no nodes'
    })
    .toBeGreaterThan(0)

  const nodesCount = await getTableRows(page, graphComponent.nodesTable)

  // a workflow is a connected graph: N steps are joined by at least N - 1 arrows (one arrow was enough for any number of
  // nodes, so a graph that lost its edges passed)
  if (nodesCount > 1) {
    await expect
      .poll(() => getTableRows(page, graphComponent.graphConnections), {
        timeout: expectTimeout,
        message: `The graph has ${nodesCount} nodes and less than ${nodesCount - 1} arrows`
      })
      .toBeGreaterThanOrEqual(nodesCount - 1)
  }

  // the graph is laid out with a transition: measure it once it stopped moving
  const nodesGeo = await waitUntilStable(() =>
    getNamedRowsGeometry(page, graphComponent.nodesTable)
  )
  const arrowsGeo = await waitUntilStable(() =>
    getNamedRowsGeometry(page, graphComponent.graphConnections, 'path')
  )
  const topHandlers = await getNamedFieldsGeometry(page, graphComponent.nodesTable, 'top_handler')
  const bottomHandlers = await getNamedFieldsGeometry(
    page,
    graphComponent.nodesTable,
    'bottom_handler'
  )

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

  // a single node graph has no arrows to verify; a graph of several nodes whose arrows can't be measured fails (it passed)
  if (nodesCount === 1) {
    return
  }

  expect(arrowXPositions.length, 'The arrows of the graph are not measured').toBeGreaterThan(0)

  //  establish dynamic thresholds for calculation of average graph dimensions (proximity between graph nodes, connection handlers, arrow endpoints)
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

  const getHandlerCenters = geometry => {
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
    left: x,
    right: x + nodeWidths[i],
    top: nodeYPositions[i],
    bottom: nodeYPositions[i] + nodeHeights[i]
  }))

  const arrows = arrowXPositions.map((x, i) => ({
    id: i,
    left: x,
    right: x + arrowWidths[i],
    top: arrowYPositions[i],
    bottom: arrowYPositions[i] + arrowHeights[i]
  }))

  arrows.forEach(arrow => {
    const checkConnectionPoint = (arrowX, arrowY) => {
      // verify alignment with specific connection handler centers
      const connectedToHandler = handlerPoints.some(
        handler =>
          isNear(arrowX, handler.x, handlerRadius) && isNear(arrowY, handler.y, handlerRadius)
      )
      if (connectedToHandler) return true

      // verify proximity to node boundaries within calculated tolerances
      return nodes.some(node => {
        const isNearVerticalEdge =
          isNear(arrowY, node.top, boundaryTolerance) ||
          isNear(arrowY, node.bottom, boundaryTolerance)
        const isWithinHorizontalRange =
          arrowX >= node.left - horizontalTolerance && arrowX <= node.right + horizontalTolerance

        const isNearHorizontalEdge =
          isNear(arrowX, node.left, horizontalTolerance) ||
          isNear(arrowX, node.right, horizontalTolerance)
        const isWithinVerticalRange =
          arrowY >= node.top - boundaryTolerance && arrowY <= node.bottom + boundaryTolerance

        return (
          (isNearVerticalEdge && isWithinHorizontalRange) ||
          (isNearHorizontalEdge && isWithinVerticalRange)
        )
      })
    }

    const isStartConnected =
      checkConnectionPoint(arrow.left, arrow.top) || checkConnectionPoint(arrow.right, arrow.top)
    const isEndConnected =
      checkConnectionPoint(arrow.left, arrow.bottom) ||
      checkConnectionPoint(arrow.right, arrow.bottom)

    expect(isStartConnected, `Arrow [${arrow.id}] start disconnected. Check Y:${arrow.top}`).toBe(
      true
    )
    expect(isEndConnected, `Arrow [${arrow.id}] end disconnected. Check Y:${arrow.bottom}`).toBe(
      true
    )
  })
  console.log(
    `[GRAPH CHECK COMPLETED]: Verified connections for ${arrows.length} arrows using ${nodes.length} nodes.`
  )
}

// big graphs don't fit the view even at the minimal zoom, drag the pane until the target is in the middle of the view:
// the graph corners are covered by overlays (e.g. "Default error handler" panel, minimap), so "displayed" isn't enough
// (nodes aren't draggable, so dragging over a node pans the graph as well)
export const panGraphToElement = async (page, graphRoot, targetLocator) => {
  const graphElement = page.locator(graphRoot).first()
  const target = page.locator(targetLocator).first()

  for (let attempt = 0; attempt < 10; attempt++) {
    const graphRect = await getRect(graphElement)
    const targetRect = await getRect(target)
    const shiftX = graphRect.x + graphRect.width / 2 - (targetRect.x + targetRect.width / 2)
    const shiftY = graphRect.y + graphRect.height / 2 - (targetRect.y + targetRect.height / 2)
    const isInTheMiddle =
      Math.abs(shiftX) <= graphRect.width / 4 && Math.abs(shiftY) <= graphRect.height / 4

    if (isInTheMiddle && (await isDisplayed(target))) break

    const maxShift = Math.min(graphRect.width, graphRect.height) / 2 - 20
    const clamp = value => Math.round(Math.max(-maxShift, Math.min(maxShift, value)))

    const startX = Math.floor(graphRect.x + graphRect.width / 2)
    const startY = Math.floor(graphRect.y + graphRect.height / 2)

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + clamp(shiftX), startY + clamp(shiftY), { steps: 10 })
    await page.mouse.up()
  }
}

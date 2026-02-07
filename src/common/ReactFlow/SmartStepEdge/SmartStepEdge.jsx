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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { BaseEdge, getSmoothStepPath, useStore } from 'reactflow'

import { getMarkerEnd, onEdgeHover } from '../mlReactFlow.util'
import {
  alignPathToTarget,
  DIRECTION,
  EDGE_CONFIG,
  generateRoundedSvgPath,
  getManhattanElbowPoint,
  MinHeap
} from './smartStepEdge.utils'

/**
 * --- SMART STEP EDGE COMPONENT ---
 * * This component renders an edge that automatically routes around obstacles (nodes)
 * using an A* pathfinding algorithm.
 * * Key Features:
 * 1. Dynamic Grid Alignment: It shifts the mathematical search grid to align exactly
 * with the source node's pixel position. This prevents "notches" or "jogs"
 * at the start of the line.
 * 2. Manhattan Routing: Prefers straight lines and 90-degree turns (L-shapes).
 * 3. Obstacle Avoidance: Reads node positions from the store to avoid overlaps.
 */

export default function SmartStepEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = 'top',
  targetPosition = 'top',
  markerEndId = null,
  style,
  interactionWidth = 20
}) {
  const nodeInternals = useStore(store => store.nodeInternals)

  const markerEndIdConverted = useMemo(() => markerEndId?.replace(' ', '_'), [markerEndId])
  const idConverted = useMemo(() => id?.replace(' ', '_'), [id])
  const markerEnd = useMemo(
    () => getMarkerEnd('arrow', markerEndIdConverted, idConverted),
    [idConverted, markerEndIdConverted]
  )

  // 1. DYNAMIC GRID ALIGNMENT
  // This is the most critical visual fix. We calculate the mathematical "remainder"
  // of the source node's position relative to the grid size.
  // Example: If sourceY is 103 and grid is 10, offset is 3.
  // We shift the entire search grid by 3px. This ensures the line exits straight (at 103)
  // instead of jumping immediately to a global grid line (at 100).
  const gridOffsetX = useMemo(() => sourceX % EDGE_CONFIG.gridSize, [sourceX])
  const gridOffsetY = useMemo(() => sourceY % EDGE_CONFIG.gridSize, [sourceY])

  // Helpers to convert between Pixel Space (Screen) and Dynamic Grid Space (Indices)
  const toGridIndex = (pixelValue, offset) =>
    Math.round((pixelValue - offset) / EDGE_CONFIG.gridSize)
  const toPixelValue = (gridIndex, offset) => gridIndex * EDGE_CONFIG.gridSize + offset

  // 2. CONTEXT PREPARATION
  // We pre-calculate obstacles and search boundaries to avoid doing it inside the render loop.
  const pathContext = useMemo(() => {
    if (!Number.isFinite(sourceX) || !Number.isFinite(targetX)) return null

    // Calculate Bridge Tips (Start/End points extended by "bridgeLength")
    const { bridgeLength } = EDGE_CONFIG
    let bridgeStart = { x: sourceX, y: sourceY }
    let bridgeEnd = { x: targetX, y: targetY }

    if (sourcePosition === 'right') bridgeStart = { x: sourceX + bridgeLength, y: sourceY }
    else if (sourcePosition === 'left') bridgeStart = { x: sourceX - bridgeLength, y: sourceY }
    else if (sourcePosition === 'bottom') bridgeStart = { x: sourceX, y: sourceY + bridgeLength }
    else if (sourcePosition === 'top') bridgeStart = { x: sourceX, y: sourceY - bridgeLength }

    if (targetPosition === 'left') bridgeEnd = { x: targetX - bridgeLength, y: targetY }
    else if (targetPosition === 'right') bridgeEnd = { x: targetX + bridgeLength, y: targetY }
    else if (targetPosition === 'top') bridgeEnd = { x: targetX, y: targetY - bridgeLength }
    else if (targetPosition === 'bottom') bridgeEnd = { x: targetX, y: targetY + bridgeLength }

    // Define Search Zone (Bounding Box + Buffer)
    // We only care about obstacles inside this area to keep performance high.
    const zoneMinX = Math.min(sourceX, targetX) - EDGE_CONFIG.searchBuffer
    const zoneMaxX = Math.max(sourceX, targetX) + EDGE_CONFIG.searchBuffer
    const zoneMinY = Math.min(sourceY, targetY) - EDGE_CONFIG.searchBuffer
    const zoneMaxY = Math.max(sourceY, targetY) + EDGE_CONFIG.searchBuffer

    const obstacles = []

    // Convert React Flow nodes into "Blocked Grid Cells"
    nodeInternals.forEach(node => {
      if (node.hidden || node.id === id) return // Ignore hidden nodes and the edge itself

      // Ignore source/target nodes and group nodes
      if (node.id === source || node.id === target || node.type === 'ml-group-node') return

      const x = node.positionAbsolute?.x ?? node.position?.x ?? 0
      const y = node.positionAbsolute?.y ?? node.position?.y ?? 0
      const w = node.width ?? node.measured?.width ?? 150
      const h = node.height ?? node.measured?.height ?? 50

      // Optimization: Skip nodes far outside the path area
      if (x > zoneMaxX || x + w < zoneMinX || y > zoneMaxY || y + h < zoneMinY) return

      let padding = EDGE_CONFIG.nodeBuffer

      // Map the obstacle boundaries to our Dynamic Grid
      obstacles.push({
        minX: toGridIndex(x - padding, gridOffsetX),
        maxX: toGridIndex(x + w + padding, gridOffsetX),
        minY: toGridIndex(y - padding, gridOffsetY),
        maxY: toGridIndex(y + h + padding, gridOffsetY)
      })
    })

    return { obstacles, bridgeStart, bridgeEnd, zoneMinX, zoneMaxX, zoneMinY, zoneMaxY }
  }, [
    nodeInternals,
    id,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    gridOffsetX,
    gridOffsetY
  ])

  // 3. A* PATHFINDING EXECUTION
  const svgPath = useMemo(() => {
    if (!pathContext) return ''
    const { obstacles, bridgeStart, bridgeEnd, zoneMinX, zoneMaxX, zoneMinY, zoneMaxY } =
      pathContext

    try {
      // Convert start/end points to Grid Indices
      const startGridX = toGridIndex(bridgeStart.x, gridOffsetX)
      const startGridY = toGridIndex(bridgeStart.y, gridOffsetY)
      const targetGridX = toGridIndex(bridgeEnd.x, gridOffsetX)
      const targetGridY = toGridIndex(bridgeEnd.y, gridOffsetY)

      // Convert search bounds to Grid Indices
      const minSearchGridX = toGridIndex(zoneMinX, gridOffsetX)
      const maxSearchGridX = toGridIndex(zoneMaxX, gridOffsetX)
      const minSearchGridY = toGridIndex(zoneMinY, gridOffsetY)
      const maxSearchGridY = toGridIndex(zoneMaxY, gridOffsetY)

      // Helper to check if a cell is blocked
      const getCellCost = (gridX, gridY) => {
        // Always allow the specific start and end points
        if (gridX === startGridX && gridY === startGridY) return 1
        if (gridX === targetGridX && gridY === targetGridY) return 1

        for (const obstacle of obstacles) {
          if (
            gridX >= obstacle.minX &&
            gridX <= obstacle.maxX &&
            gridY >= obstacle.minY &&
            gridY <= obstacle.maxY
          ) {
            return Infinity // Blocked
          }
        }
        return 1 // Walkable
      }

      // Initialize A* Structures
      const heap = new MinHeap()
      const initialDirection =
        sourcePosition === 'left' || sourcePosition === 'right'
          ? DIRECTION.HORIZONTAL
          : DIRECTION.VERTICAL

      // Heuristic: Manhattan distance to target * Weight
      const initialHeuristic =
        (Math.abs(startGridX - targetGridX) + Math.abs(startGridY - targetGridY)) *
        EDGE_CONFIG.heuristicWeight

      heap.push({
        x: startGridX,
        y: startGridY,
        gCost: 0,
        hCost: initialHeuristic,
        fCost: initialHeuristic,
        parent: null,
        dir: initialDirection
      })

      const visitedMap = new Map()
      let finalNode = null
      let iterations = 0

      // --- SEARCH LOOP ---
      while (heap.size() > 0 && iterations < EDGE_CONFIG.maxSearchIterations) {
        iterations++
        const currentNode = heap.pop()

        // Goal Reached
        if (currentNode.x === targetGridX && currentNode.y === targetGridY) {
          finalNode = currentNode
          break
        }

        // Define possible moves (Up, Down, Left, Right)
        const possibleMoves = [
          { dx: 0, dy: -1, dir: DIRECTION.VERTICAL }, // Up
          { dx: 0, dy: 1, dir: DIRECTION.VERTICAL }, // Down
          { dx: -1, dy: 0, dir: DIRECTION.HORIZONTAL }, // Left
          { dx: 1, dy: 0, dir: DIRECTION.HORIZONTAL } // Right
        ]

        for (const move of possibleMoves) {
          const nextX = currentNode.x + move.dx
          const nextY = currentNode.y + move.dy

          // One-Way Valve: Prevent immediate U-turns at the start
          if (currentNode.parent === null) {
            if (sourcePosition === 'right' && move.dx === -1) continue
            if (sourcePosition === 'left' && move.dx === 1) continue
            if (sourcePosition === 'bottom' && move.dy === -1) continue
            if (sourcePosition === 'top' && move.dy === 1) continue
          }

          // Check Bounds
          if (
            nextX < minSearchGridX ||
            nextX > maxSearchGridX ||
            nextY < minSearchGridY ||
            nextY > maxSearchGridY
          )
            continue

          // Check Obstacles
          if (getCellCost(nextX, nextY) === Infinity) continue

          // Cost Calculation
          // Each step costs +1. Straightness preference is handled by MinHeap.compare()
          const newGCost = currentNode.gCost + 1
          const visitedKey = `${nextX},${nextY}`

          // If unvisited or we found a cheaper way here
          if (!visitedMap.has(visitedKey) || visitedMap.get(visitedKey) > newGCost) {
            visitedMap.set(visitedKey, newGCost)
            const newHCost =
              (Math.abs(nextX - targetGridX) + Math.abs(nextY - targetGridY)) *
              EDGE_CONFIG.heuristicWeight

            heap.push({
              x: nextX,
              y: nextY,
              gCost: newGCost,
              hCost: newHCost,
              fCost: newGCost + newHCost,
              parent: currentNode,
              dir: move.dir
            })
          }
        }
      }

      // 4. PATH RECONSTRUCTION
      let svgPoints = [{ x: sourceX, y: sourceY }, bridgeStart]

      if (finalNode) {
        // Convert the Grid Index path back to Pixel Coordinates
        const startGridPixel = {
          x: toPixelValue(startGridX, gridOffsetX),
          y: toPixelValue(startGridY, gridOffsetY)
        }

        // Add "Elbow" point if there is a tiny misalignment (handles float precision issues)
        if (
          Math.abs(bridgeStart.x - startGridPixel.x) > 1 ||
          Math.abs(bridgeStart.y - startGridPixel.y) > 1
        ) {
          svgPoints.push(getManhattanElbowPoint(bridgeStart, startGridPixel, sourcePosition))
        }
        svgPoints.push(startGridPixel)

        // Trace back from Target -> Start
        const pathStack = []
        let nodeTracer = finalNode
        while (nodeTracer.parent) {
          pathStack.push({
            x: toPixelValue(nodeTracer.x, gridOffsetX),
            y: toPixelValue(nodeTracer.y, gridOffsetY)
          })
          nodeTracer = nodeTracer.parent
        }
        // Reverse stack to get Start -> Target order
        while (pathStack.length > 0) {
          svgPoints.push(pathStack.pop())
        }

        const endGridPixel = {
          x: toPixelValue(targetGridX, gridOffsetX),
          y: toPixelValue(targetGridY, gridOffsetY)
        }
        svgPoints.push(getManhattanElbowPoint(bridgeEnd, endGridPixel, targetPosition))
      } else {
        // Fallback: If no path found, connect bridges directly
        svgPoints.push(getManhattanElbowPoint(bridgeStart, bridgeEnd, sourcePosition))
      }

      // Before adding the final bridge point, we align the incoming path
      // to the exact Target axis if it's slightly off-grid.
      svgPoints = alignPathToTarget(svgPoints, targetX, targetY, targetPosition)

      svgPoints.push(bridgeEnd)
      svgPoints.push({ x: targetX, y: targetY })

      return generateRoundedSvgPath(svgPoints, EDGE_CONFIG.cornerRadius)
    } catch {
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        targetPosition,
        sourcePosition,
        borderRadius: EDGE_CONFIG.cornerRadius,
        offset: 20
      })?.[0]
    }
  }, [
    pathContext,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    gridOffsetX,
    gridOffsetY
  ])

  if (!svgPath) return null

  return (
    <>
      <defs>
        <marker
          className="react-flow__arrowhead"
          id={`react-flow__ml-arrow-${idConverted}`}
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="0"
          refY="0"
        >
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            fill="none"
            points="-5,-4 0,0 -5,4"
            style={{ strokeDasharray: 'none' }}
          />
        </marker>
      </defs>

      {/* The actual visible edge */}
      <BaseEdge
        id={idConverted}
        path={svgPath}
        markerEnd={markerEnd}
        style={{ ...style, fill: 'none', pointerEvents: 'none' }}
      />

      {/* Invisible wider edge for easier user interactiong */}
      <path
        d={svgPath}
        fill="none"
        opacity={0}
        stroke="transparent"
        strokeWidth={interactionWidth}
        className="react-flow__edge-interaction"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          strokeWidth: interactionWidth,
          cursor: 'default',
          pointerEvents: 'stroke'
        }}
        onMouseDownCapture={event => {
          event.stopPropagation()
          event.preventDefault()
        }}
        onClickCapture={event => {
          event.stopPropagation()
          event.preventDefault()
        }}
        onMouseOver={onEdgeHover}
      />
    </>
  )
}

SmartStepEdge.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.string,
  targetPosition: PropTypes.string,
  markerEndId: PropTypes.string,
  style: PropTypes.object,
  interactionWidth: PropTypes.number
}

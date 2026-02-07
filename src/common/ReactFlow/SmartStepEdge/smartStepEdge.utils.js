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

/**
 * --- CONFIGURATION ---
 * Centralized settings for pathfinding physics and visual rendering.
 */
export const EDGE_CONFIG = {
  gridSize: 10, // The resolution of the search grid. 10px is a good balance of accuracy vs performance.
  nodeBuffer: 10, // Padding around obstacles (nodes) to prevent the line from touching them.
  bridgeLength: 20, // The fixed length of the straight wire exiting a node before turning.
  cornerRadius: 12, // Radius of the bends (SVG arcs) for smoothness.

  // A* SEARCH SETTINGS
  heuristicWeight: 1.5, // Weight > 1.0 makes the search "Greedy" (faster, prefers direction of target).
  maxSearchIterations: 2500, // Safety cutoff to prevent the browser from freezing on complex graphs.
  searchBuffer: 300 // How far (in pixels) to search outside the bounding box of the start/end nodes.
}

export const DIRECTION = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
}

/**
 * --- BINARY MIN-HEAP ---
 * A specialized Priority Queue for the A* algorithm.
 * It ensures we always process the most promising path segment next.
 */
export class MinHeap {
  constructor() {
    this.heap = []
  }

  push(node) {
    this.heap.push(node)
    this.bubbleUp(this.heap.length - 1)
  }

  pop() {
    if (this.heap.length === 0) return null
    const min = this.heap[0]
    const end = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = end
      this.sinkDown(0)
    }
    return min
  }

  size() {
    return this.heap.length
  }

  /**
   * Defines which node is "better".
   * Priority 1: Lowest Total Cost (fCost = distance traveled + estimated distance left).
   * Priority 2: Straightness (Tie-Breaker). If costs are equal, pick the straight line.
   * Priority 3: Closeness to goal (hCost).
   */
  compare(nodeA, nodeB) {
    // 1. Primary: Total Cost
    // We use a small epsilon (0.001) to handle floating point math imprecision.
    if (Math.abs(nodeA.fCost - nodeB.fCost) > 0.001) return nodeA.fCost < nodeB.fCost

    // 2. Secondary: STRAIGHTNESS PREFERENCE (The "Manhattan" Logic)
    // If two paths cost the same, ALWAYS prefer the one that continues in the same direction.
    // This creates clean L-shapes without needing complex calculation penalties.
    const isNodeAStraight = nodeA.parent && nodeA.dir === nodeA.parent.dir
    const isNodeBStraight = nodeB.parent && nodeB.dir === nodeB.parent.dir

    if (isNodeAStraight && !isNodeBStraight) return true
    if (!isNodeAStraight && isNodeBStraight) return false

    // 3. Tertiary: Distance to goal
    return nodeA.hCost < nodeB.hCost
  }

  bubbleUp(index) {
    const node = this.heap[index]
    while (index > 0) {
      const parentIdx = (index - 1) >>> 1
      const parent = this.heap[parentIdx]
      if (this.compare(node, parent)) {
        this.heap[parentIdx] = node
        this.heap[index] = parent
        index = parentIdx
      } else {
        break
      }
    }
    this.heap[index] = node
  }

  sinkDown(index) {
    const length = this.heap.length
    const node = this.heap[index]
    while (true) {
      const leftChildIdx = (index << 1) + 1
      const rightChildIdx = leftChildIdx + 1
      let swapIdx = null

      if (leftChildIdx < length) {
        if (this.compare(this.heap[leftChildIdx], node)) swapIdx = leftChildIdx
      }
      if (rightChildIdx < length) {
        const rightChild = this.heap[rightChildIdx]
        const candidate = swapIdx === null ? node : this.heap[leftChildIdx]
        if (this.compare(rightChild, candidate)) swapIdx = rightChildIdx
      }
      if (swapIdx === null) break
      this.heap[index] = this.heap[swapIdx]
      this.heap[swapIdx] = node
      index = swapIdx
    }
  }
}

/**
 * --- HELPERS ---
 */

/**
 * Converts a list of points into an SVG path string with rounded corners.
 * Cleans up collinear points (points on a straight line) to reduce DOM complexity.
 */
export const generateRoundedSvgPath = (points, radius) => {
  if (!points || points.length < 2) return ''
  const cleanPoints = [points[0]]

  // Merge collinear points
  for (let i = 1; i < points.length; i++) {
    const prev = cleanPoints[cleanPoints.length - 1]
    const curr = points[i]
    if (Math.abs(curr.x - prev.x) < 1 && Math.abs(curr.y - prev.y) < 1) continue

    if (cleanPoints.length > 1) {
      const prevPrev = cleanPoints[cleanPoints.length - 2]
      const isHorizontal = Math.abs(prev.y - prevPrev.y) < 1 && Math.abs(curr.y - prev.y) < 1
      const isVertical = Math.abs(prev.x - prevPrev.x) < 1 && Math.abs(curr.x - prev.x) < 1
      if (isHorizontal || isVertical) {
        cleanPoints[cleanPoints.length - 1] = curr
        continue
      }
    }
    cleanPoints.push(curr)
  }

  if (cleanPoints.length < 3) {
    return `M ${cleanPoints[0].x} ${cleanPoints[0].y} L ${cleanPoints[1]?.x ?? cleanPoints[0].x} ${cleanPoints[1]?.y ?? cleanPoints[0].y}`
  }

  let d = `M ${cleanPoints[0].x} ${cleanPoints[0].y}`

  for (let i = 1; i < cleanPoints.length - 1; i++) {
    const p0 = cleanPoints[i - 1]
    const p1 = cleanPoints[i]
    const p2 = cleanPoints[i + 1]

    const dist0 = Math.hypot(p1.x - p0.x, p1.y - p0.y)
    const dist2 = Math.hypot(p2.x - p1.x, p2.y - p1.y)
    const maxR = Math.min(dist0 / 2, dist2 / 2, radius)

    //  Handle small segments gracefully
    if (maxR < 2) {
      d += ` L ${p1.x} ${p1.y}`
    } else {
      const v1 = { x: (p0.x - p1.x) / dist0, y: (p0.y - p1.y) / dist0 }
      const v2 = { x: (p2.x - p1.x) / dist2, y: (p2.y - p1.y) / dist2 }
      d += ` L ${p1.x + v1.x * maxR} ${p1.y + v1.y * maxR}`
      d += ` Q ${p1.x} ${p1.y} ${p1.x + v2.x * maxR} ${p1.y + v2.y * maxR}`
    }
  }

  d += ` L ${cleanPoints[cleanPoints.length - 1].x} ${cleanPoints[cleanPoints.length - 1].y}`
  return d
}

export const alignPathToTarget = (points, targetX, targetY, targetPosition) => {
  if (points.length < 2) return points

  // Check strict orientation
  const isHorizontalApproach = targetPosition === 'left' || targetPosition === 'right'

  // Work backwards from the last point (which is the Bridge Tip)
  // We want to align the entire last segment to the Target's Center.
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i]

    if (isHorizontalApproach) {
      // If the point is "close enough" (within grid size) to the target Y axis, snap it.
      // This grabs the bridge tip AND the previous turn point.
      if (Math.abs(point.y - targetY) <= EDGE_CONFIG.gridSize + 1) {
        point.y = targetY
      } else {
        // Once we deviate significantly, stop snapping (we hit the vertical leg)
        break
      }
    } else {
      // Vertical Approach (Top/Bottom)
      if (Math.abs(point.x - targetX) <= EDGE_CONFIG.gridSize + 1) {
        point.x = targetX
      } else {
        break
      }
    }
  }
  return points
}

/**
 * Calculates a transition point (Elbow) to ensure a clean 90-degree entry from off-grid to on-grid.
 */
export const getManhattanElbowPoint = (pixelPoint, gridPoint, orientation) => {
  if (orientation === 'right' || orientation === 'left') {
    return { x: gridPoint.x, y: pixelPoint.y }
  }
  return { x: pixelPoint.x, y: gridPoint.y }
}

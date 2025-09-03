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

import numjs from '@d4c/numjs'
import { expect } from 'chai'

function diffMapper(array0, array1, deviation) {
  const tmpDiff = numjs.abs(
    numjs.subtract(
      numjs.dot(numjs.ones(array0.shape).T, array1),
      numjs.dot(array0.T, numjs.ones(array1.shape))
    )
  )

  for (let i = 0; i < tmpDiff.shape[0]; i++) {
    for (let j = 0; j < tmpDiff.shape[1]; j++) {
      tmpDiff.set(i, j, tmpDiff.get(i, j) < deviation ? 1 : 0)
    }
  }

  return tmpDiff
}

export const checkNodesConnectionsNPandas = async (driver, graphComponent) => {
    const nodesGeometry = await getNamedRowsGeometry(
      driver,
      graphComponent.nodesTable
    )

    const arrowsGeometry = await getNamedRowsGeometry(
      driver,
      graphComponent.graphConnections,
      'path'
    )

    const topConnectorsGeometry = await getNamedFieldsGeometry(
      driver,
      graphComponent.nodesTable,
      'top_handler'
    )

    const bottomConnectorsGeometry = await getNamedFieldsGeometry(
      driver,
      graphComponent.nodesTable,
      'bottom_handler'
    )

    const maxConnectorSide = numjs
      .array([
        ...Array.from(topConnectorsGeometry.get('height')),
        ...Array.from(topConnectorsGeometry.get('width')),
        ...Array.from(bottomConnectorsGeometry.get('height')),
        ...Array.from(bottomConnectorsGeometry.get('width'))
      ])
      .max()

    const nodeTopEdges = numjs.array([Array.from(nodesGeometry.get('y'))])
    const nodeBottomEdges = numjs.add(
      [Array.from(nodesGeometry.get('y'))],
      [Array.from(nodesGeometry.get('height'))]
    )
    const arrowTopEdges = numjs.array([Array.from(arrowsGeometry.get('y'))])
    const arrowBottomEdges = numjs.add(
      [Array.from(arrowsGeometry.get('y'))],
      [Array.from(arrowsGeometry.get('height'))]
    )

    const startArrowsEdges = diffMapper(
      arrowTopEdges,
      nodeBottomEdges,
      maxConnectorSide / 2
    )
    const endArrowsEdges = diffMapper(
      arrowBottomEdges,
      nodeTopEdges,
      maxConnectorSide / 2
    )

    const nodeMidlePoints = numjs.add(
      [Array.from(nodesGeometry.get('x'))],
      [Array.from(nodesGeometry.get('width')).map(item => item / 2)]
    )
    const arrowsNodeLeftEdgesX = numjs.array([
      Array.from(arrowsGeometry.get('x'))
    ])
    const arrowsNodeRightEdgesX = numjs.add(
      [Array.from(arrowsGeometry.get('x'))],
      [Array.from(arrowsGeometry.get('width'))]
    )
    const leftEdgesConnections = diffMapper(
      arrowsNodeLeftEdgesX,
      nodeMidlePoints,
      maxConnectorSide / 2
    )
    const righEdgesConnections = diffMapper(
      arrowsNodeRightEdgesX,
      nodeMidlePoints,
      maxConnectorSide / 2
    )

    const startMarks = numjs.add(
      numjs.multiply(startArrowsEdges, leftEdgesConnections),
      numjs.multiply(startArrowsEdges, righEdgesConnections)
    )
    for (let i = 0; i < arrowsNodeRightEdgesX.length; i++) {
      expect(numjs.sum(startMarks.slice([i]))).equal(true, 'Arrow not started')
    }

    const endMarks = numjs.add(
      numjs.multiply(endArrowsEdges, leftEdgesConnections),
      numjs.multiply(endArrowsEdges, righEdgesConnections)
    )
    for (let i = 0; i < arrowsNodeRightEdgesX.length; i++) {
      expect(numjs.sum(endMarks.slice([i]))).equal(true, 'Arrow not ended')
    }
  }

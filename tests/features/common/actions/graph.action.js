import { getNamedRowsGeometry, getNamedFieldsGeometry } from './table.action'

import numjs from 'numjs'
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

const action = {
  checkNodesConnectionsNPandas: async function(driver, graphComponent) {
    const nodesGeometry = await getNamedRowsGeometry(
      driver,
      graphComponent.nodesTable
    )

    const arrowsGeometry = await getNamedRowsGeometry(
      driver,
      graphComponent.grafConnections,
      'path'
    )

    const topConnectorsGeometry = await getNamedFieldsGeometry(
      driver,
      graphComponent.nodesTable,
      'top_hendler'
    )

    const bottomConnectorsGeometry = await getNamedFieldsGeometry(
      driver,
      graphComponent.nodesTable,
      'bottom_hendler'
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
}

module.exports = action

import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

module.exports = function(graphStructure) {
  const options = locatorBuilder`${0} ${1}`
  const nodesTable = {
    ...graphStructure.elements.workflowGrafNodesTable.structure
  }

  nodesTable.root = options(
    graphStructure.root,
    graphStructure.elements.workflowGrafNodesTable.root
  )

  const grafConnections = {
    ...graphStructure.elements.workflowGrafConnectionsTable.structure
  }

  grafConnections.root = options(
    graphStructure.root,
    graphStructure.elements.workflowGrafConnectionsTable.root
  )

  return {
    root: By.css(graphStructure.root),
    svg: By.css(options(graphStructure.root, graphStructure.elements.svg)),
    zoomPane: By.css(
      options(graphStructure.root, graphStructure.elements.zoomPane)
    ),
    nodesTable: graphStructure.elements.workflowGrafNodesTable.componentType(
      nodesTable
    ),
    grafConnections: graphStructure.elements.workflowGrafNodesTable.componentType(
      grafConnections
    )
  }
}

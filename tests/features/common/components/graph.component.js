import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

module.exports = function(graphStructure) {
  const options = locatorBuilder`${0} ${1}`
  const nodesTable = {
    ...graphStructure.elements.workflowGraphNodesTable.structure
  }

  nodesTable.root = options(
    graphStructure.root,
    graphStructure.elements.workflowGraphNodesTable.root
  )

  const graphConnections = {
    ...graphStructure.elements.workflowGraphConnectionsTable.structure
  }

  graphConnections.root = options(
    graphStructure.root,
    graphStructure.elements.workflowGraphConnectionsTable.root
  )

  return {
    root: By.css(graphStructure.root),
    svg: By.css(options(graphStructure.root, graphStructure.elements.svg)),
    zoomPane: By.css(
      options(graphStructure.root, graphStructure.elements.zoomPane)
    ),
    nodesTable: graphStructure.elements.workflowGraphNodesTable.componentType(
      nodesTable
    ),
    graphConnections: graphStructure.elements.workflowGraphNodesTable.componentType(
      graphConnections
    )
  }
}

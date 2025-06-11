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
import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

export default function(graphStructure) {
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

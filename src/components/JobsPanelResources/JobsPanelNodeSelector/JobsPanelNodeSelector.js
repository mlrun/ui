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
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import KeyValueTable from '../../../common/KeyValueTable/KeyValueTable'

import { panelActions } from '../../JobsPanel/panelReducer'
import jobsActions from '../../../actions/jobs'

const JobsPanelNodeSelector = ({
  jobsStore,
  panelDispatch,
  panelState,
  setNewJobNodeSelector
}) => {
  const handleAddNewNodeSelector = newNodeSelector => {
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR,
      payload: [
        ...panelState.previousPanelData.tableData.node_selector,
        newNodeSelector
      ]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_NODE_SELECTOR,
      payload: [...panelState.tableData.node_selector, newNodeSelector]
    })
    setNewJobNodeSelector({
      ...jobsStore.newJob.function.spec.node_selector,
      [newNodeSelector.key]: newNodeSelector.value
    })
  }

  const handleDeleteNodeSelector = (index, nodeSelector) => {
    const newNodeSelector = { ...jobsStore.newJob.function.spec.node_selector }

    delete newNodeSelector[nodeSelector.key]
    setNewJobNodeSelector(newNodeSelector)
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR,
      payload: [
        ...panelState.previousPanelData.tableData.node_selector.filter(
          item => item.key !== nodeSelector.key
        )
      ]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_NODE_SELECTOR,
      payload: [
        ...panelState.tableData.node_selector.filter(
          item => item.key !== nodeSelector.key
        )
      ]
    })
  }

  const handleEditNodeSelector = nodeSelector => {
    const newNodeSelector = { ...jobsStore.newJob.function.spec.node_selector }
    const newTableData = [...panelState.tableData.node_selector].map(
      dataItem => {
        if (dataItem.key === nodeSelector.key) {
          dataItem.key = nodeSelector.newKey || nodeSelector.key
          dataItem.value = nodeSelector.value
        }

        return dataItem
      }
    )

    if (nodeSelector.newKey) {
      delete newNodeSelector[nodeSelector.key]
    }

    newNodeSelector[nodeSelector.newKey || nodeSelector.key] =
      nodeSelector.value

    setNewJobNodeSelector(newNodeSelector)
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_NODE_SELECTOR,
      payload: newTableData
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_NODE_SELECTOR,
      payload: newTableData
    })
  }

  return (
    <KeyValueTable
      addNewItem={handleAddNewNodeSelector}
      addNewItemLabel="Add entry"
      className="node-selector"
      content={panelState.tableData.node_selector}
      deleteItem={handleDeleteNodeSelector}
      disabled={panelState.editMode}
      editItem={handleEditNodeSelector}
      isKeyRequired
      keyHeader="Key"
      keyType="input"
      valueHeader="Value"
      withEditMode
    />
  )
}

JobsPanelNodeSelector.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, {
  setNewJobNodeSelector: jobsActions.setNewJobNodeSelector
})(JobsPanelNodeSelector)

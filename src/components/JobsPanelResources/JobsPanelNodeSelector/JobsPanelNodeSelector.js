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

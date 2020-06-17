import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import { JobsPanelAdvancedTable } from '../../elements/JobsPanelAdvancedTable/JobsPanelAdvancedTable'

import panelData from '../JobsPanel/panelData'
import { advancedActions } from './jobsPanelAdvancedReducer'

const JobsPanelAdvancedView = ({
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  advancedDispatch,
  advancedState,
  match,
  panelState
}) => {
  return (
    <div className="job-panel__item">
      <JobsPanelSection title="Advanced">
        <div className="item-section__title">
          <h5>Environment Variables</h5>
        </div>
        <JobsPanelAdvancedTable
          addNewItem={advancedState.addNewEnvironmentVariable}
          className="environment-variables"
          content={panelState.tableData.environmentVariables}
          handleAddNewItem={handleAddNewItem}
          handleEditItems={handleEditItems}
          handleDeleteItems={handleDeleteItems}
          headers={panelData['advanced']['table-headers']}
          match={match}
          panelState={panelState}
          section="advanced"
          selectedItem={advancedState.selectedEnvironmentVariable}
          setAddNewItem={value =>
            advancedDispatch({
              type: advancedActions.SET_ADD_NEW_ENVIRONMENT_VARIABLE,
              payload: value
            })
          }
          setNewItemName={name =>
            advancedDispatch({
              type: advancedActions.SET_NEW_ENVIRONMENT_VARIABLE_NAME,
              payload: name
            })
          }
          setNewItemValue={value =>
            advancedDispatch({
              type: advancedActions.SET_NEW_ENVIRONMENT_VARIABLE_VALUE,
              payload: value
            })
          }
          setSelectedItem={selectedItem =>
            advancedDispatch({
              type: advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
              payload: selectedItem
            })
          }
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelAdvancedView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  advancedDispatch: PropTypes.func.isRequired,
  advancedState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired
}

export default JobsPanelAdvancedView

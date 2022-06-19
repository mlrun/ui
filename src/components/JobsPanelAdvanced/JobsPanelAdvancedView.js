import React from 'react'
import PropTypes from 'prop-types'

import PanelSection from '../../elements/PanelSection/PanelSection'
import { JobsPanelAdvancedTable } from '../../elements/JobsPanelAdvancedTable/JobsPanelAdvancedTable'
import JobsPanelEnvironmentVariables from '../../elements/JobsPanelEnvironmentVariables/JobsPanelEnvironmentVariables'

import panelData from '../JobsPanel/panelData'
import { advancedActions } from './jobsPanelAdvancedReducer'

const JobsPanelAdvancedView = ({
  advancedDispatch,
  advancedState,
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handleResetForm,
  isStagingMode,
  panelDispatch,
  panelState,
  setValidation,
  validation
}) => {
  return (
    <div className="job-panel__item advanced new-item-side-panel__item">
      <PanelSection title="Advanced">
        <JobsPanelEnvironmentVariables
          isPanelEditMode={panelState.editMode}
          panelDispatch={panelDispatch}
          panelEnvData={panelState.tableData.environmentVariables}
          previousPanelEnvData={
            panelState.previousPanelData.tableData.environmentVariables
          }
        />
      </PanelSection>

      {isStagingMode && (
        <PanelSection title="Secrets">
          <JobsPanelAdvancedTable
            addNewItem={advancedState.addNewSecret}
            className="advanced secrets"
            content={panelState.tableData.secretSources}
            handleAddNewItem={handleAddNewItem}
            handleEditItems={handleEditItems}
            handleDeleteItems={handleDeleteItems}
            handleResetForm={handleResetForm}
            headers={panelData['secrets']['table-headers']}
            isPanelEditMode={panelState.editMode}
            panelState={panelState}
            section="advanced secrets"
            selectedId={advancedState.newSecret.kind}
            selectedItem={advancedState.selectedSecret}
            setAddNewItem={value =>
              advancedDispatch({
                type: advancedActions.SET_ADD_NEW_SECRET,
                payload: value
              })
            }
            setNewItemName={kind =>
              advancedDispatch({
                type: advancedActions.SET_NEW_SECRET_KIND,
                payload: kind
              })
            }
            setNewItemValue={source =>
              advancedDispatch({
                type: advancedActions.SET_NEW_SECRET_SOURCE,
                payload: source
              })
            }
            setSelectedItem={selectedItem =>
              advancedDispatch({
                type: advancedActions.SET_SELECTED_SECRET,
                payload: selectedItem
              })
            }
            setValidation={setValidation}
            validation={validation}
          />
        </PanelSection>
      )}
    </div>
  )
}

JobsPanelAdvancedView.propTypes = {
  advancedDispatch: PropTypes.func.isRequired,
  advancedState: PropTypes.shape({}).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  isStagingMode: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default JobsPanelAdvancedView

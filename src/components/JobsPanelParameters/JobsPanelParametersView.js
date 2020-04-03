import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'

import { ReactComponent as Plus } from '../../images/plus.svg'
import panelData from '../JobsPanel/panelData'

const JobsPanelParametersView = ({
  edit,
  addNewParameter,
  parameters,
  setNewParameterName,
  setNewParameterType,
  setNewParameterValue,
  handleAddNewItem,
  setAddNewParameter
}) => {
  return (
    <div className="job-panel__item">
      {!edit && <div className="item__overlay" />}
      <JobsPanelSection title="Parameters">
        <JobsPanelTable
          headers={panelData.parameters['table-headers']}
          addNewItem={addNewParameter}
          content={parameters}
        >
          {addNewParameter ? (
            <>
              <div className="input-row-wrapper">
                <Input
                  onChange={setNewParameterName}
                  label="Name"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={setNewParameterType}
                  label="Type"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={setNewParameterValue}
                  label="Value/s"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
              </div>
              <button
                className="add-input btn-add"
                onClick={() => handleAddNewItem(true)}
              >
                <Tooltip template={<TextTooltipTemplate text="Add item" />}>
                  <Plus />
                </Tooltip>
              </button>
            </>
          ) : (
            <JobsPanelTableAddItemRow
              onClick={setAddNewParameter}
              text="input"
            />
          )}
        </JobsPanelTable>
      </JobsPanelSection>
    </div>
  )
}

JobsPanelParametersView.propTypes = {
  edit: PropTypes.bool.isRequired
}

export default JobsPanelParametersView

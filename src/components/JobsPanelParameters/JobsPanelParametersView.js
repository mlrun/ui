import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import Select from '../../common/Select/Select'

import { ReactComponent as Plus } from '../../images/plus.svg'
import panelData from '../JobsPanel/panelData'

const JobsPanelParametersView = ({
  addNewParameter,
  edit,
  handleAddNewItem,
  match,
  newParameter,
  newParameterSimple,
  parameters,
  setAddNewParameter,
  setNewParameter,
  setNewParameterSimple
}) => {
  return (
    <div className="job-panel__item">
      {!edit && <div className="item__overlay" />}
      <JobsPanelSection title="Parameters">
        <JobsPanelTable
          headers={panelData.parameters['table-headers']}
          addNewItem={addNewParameter}
          content={parameters}
          className="parameters"
        >
          {addNewParameter ? (
            <>
              <div className="input-row-wrapper">
                <Input
                  onChange={value =>
                    setNewParameter({ ...newParameter, name: value })
                  }
                  label="Name"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={value =>
                    setNewParameter({ ...newParameter, type: value })
                  }
                  label="Type"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={value =>
                    setNewParameter({ ...newParameter, value: value })
                  }
                  label="Value/s"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Select
                  onClick={setNewParameterSimple}
                  option="parameterType"
                  label={newParameterSimple}
                  match={match}
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
            edit && (
              <JobsPanelTableAddItemRow
                onClick={setAddNewParameter}
                text="parameter"
              />
            )
          )}
        </JobsPanelTable>
        <button className="btn-load">Load file</button>
      </JobsPanelSection>
    </div>
  )
}

JobsPanelParametersView.propTypes = {
  addNewParameter: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  newParameter: PropTypes.shape({}).isRequired,
  newParameterSimple: PropTypes.string.isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setAddNewParameter: PropTypes.func.isRequired,
  setNewParameter: PropTypes.func.isRequired,
  setNewParameterSimple: PropTypes.func.isRequired
}

export default JobsPanelParametersView

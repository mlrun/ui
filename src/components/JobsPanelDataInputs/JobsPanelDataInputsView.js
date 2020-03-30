import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import Input from '../../common/Input/Input'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'

import panelData from '../JobsPanel/panelData'
import { ReactComponent as Plus } from '../../svg/plus.svg'

const JobsPanelDataInputsView = ({
  addNewInput,
  addNewVolume,
  handleAddNewItem,
  inputs,
  setAddNewInput,
  setAddNewVolume,
  setNewAccessKey,
  setNewInputName,
  setNewInputPath,
  setNewResourcePath,
  setNewVolumePath,
  setNewVolumeType,
  volumes
}) => {
  return (
    <div className="job-panel__item">
      <JobsPanelSection title="Data inputs">
        <JobsPanelTable
          headers={panelData['data-inputs']['table-headers']}
          addNewItem={addNewInput}
          content={inputs}
        >
          {addNewInput ? (
            <>
              <div className="input-row-wrapper">
                <Input
                  onChange={e => setNewInputName(e.target.value)}
                  placeholder="Set input name"
                  type="text"
                  className="input-row__item"
                />
                <Input
                  onChange={e => setNewInputPath(e.target.value)}
                  placeholder="Set input path"
                  type="text"
                  className="input-row__item"
                />
              </div>
              <button
                className="add-input btn-add"
                onClick={() => handleAddNewItem(true)}
              >
                <Plus />
              </button>
            </>
          ) : (
            <JobsPanelTableAddItemRow onClick={setAddNewInput} text="input" />
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="Volumes">
        <JobsPanelTable content={volumes} addNewItem={addNewVolume}>
          {addNewVolume ? (
            <>
              <div className="input-row-wrapper no-border">
                <Input
                  onChange={e => setNewVolumeType(e.target.value)}
                  placeholder="Set Type"
                  type="text"
                  className="input-row__item"
                />
                <Input
                  onChange={e => setNewVolumePath(e.target.value)}
                  placeholder="Set path"
                  type="text"
                  className="input-row__item"
                />
              </div>
              <div className="input-row-wrapper">
                <Input
                  onChange={e => setNewAccessKey(e.target.value)}
                  placeholder="Set Access Key"
                  type="text"
                  className="input-row__item"
                />
                <Input
                  onChange={e => setNewResourcePath(e.target.value)}
                  placeholder="Set Resource path"
                  type="text"
                  className="input-row__item"
                />
              </div>
              <button
                className="add-input btn-add"
                onClick={() => handleAddNewItem(null, true)}
              >
                <Plus />
              </button>
            </>
          ) : (
            <JobsPanelTableAddItemRow onClick={setAddNewVolume} text="volume" />
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="General">
        <Input
          placeholder="Default input path"
          type="text"
          className="default-input"
        />
        <Input
          placeholder="Default output path"
          type="text"
          className="default-input"
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelDataInputsView.propTypes = {
  addNewInput: PropTypes.bool.isRequired,
  addNewVolume: PropTypes.bool.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  inputs: PropTypes.shape({}).isRequired,
  setAddNewInput: PropTypes.func.isRequired,
  setAddNewVolume: PropTypes.func.isRequired,
  setNewAccessKey: PropTypes.func.isRequired,
  setNewInputName: PropTypes.func.isRequired,
  setNewInputPath: PropTypes.func.isRequired,
  setNewResourcePath: PropTypes.func.isRequired,
  setNewVolumePath: PropTypes.func.isRequired,
  setNewVolumeType: PropTypes.func.isRequired,
  volumes: PropTypes.shape({}).isRequired
}

export default JobsPanelDataInputsView

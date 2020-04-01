import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import Input from '../../common/Input/Input'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import Select from '../../common/Select/Select'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import panelData from '../JobsPanel/panelData'

import { ReactComponent as Plus } from '../../images/plus.svg'

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
  match,
  newVolumeType,
  volumeMounts,
  setNewVolumeName,
  setNewVolumeTypeName,
  setOutputPath,
  setInputPath
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
                  onChange={setNewInputName}
                  label="Input name"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={setNewInputPath}
                  label="Input path"
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
            <JobsPanelTableAddItemRow onClick={setAddNewInput} text="input" />
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="Volumes">
        <JobsPanelTable
          addNewItem={addNewVolume}
          content={volumeMounts}
          headers={panelData.volumes['table-headers']}
        >
          {addNewVolume ? (
            <>
              <div className="input-row-wrapper no-border">
                <Input
                  onChange={setNewVolumeName}
                  label="Name"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={setNewVolumePath}
                  label="Path"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
              </div>
              <div
                className={`input-row-wrapper${
                  newVolumeType === 'V3IO' ? ' no-border' : ''
                }`}
              >
                <Select
                  onClick={setNewVolumeType}
                  option="volumeType"
                  label={newVolumeType.length > 0 ? newVolumeType : 'Type'}
                  match={match}
                />
                {newVolumeType.length > 0 && (
                  <Input
                    onChange={setNewVolumeTypeName}
                    label={
                      newVolumeType === 'V3IO'
                        ? 'Container'
                        : newVolumeType === 'PVC'
                        ? 'Claim name'
                        : `${newVolumeType} name`
                    }
                    type="text"
                    className="input-row__item"
                    floatingLabel
                  />
                )}
              </div>
              {newVolumeType === 'V3IO' && (
                <div className="input-row-wrapper">
                  <Input
                    onChange={setNewAccessKey}
                    label="Access Key"
                    type="text"
                    className="input-row__item"
                    floatingLabel
                  />
                  <Input
                    onChange={setNewResourcePath}
                    label="Resource path"
                    type="text"
                    className="input-row__item"
                    floatingLabel
                  />
                </div>
              )}

              <button
                className="add-input btn-add"
                onClick={() => handleAddNewItem(null, true)}
              >
                <Tooltip template={<TextTooltipTemplate text="Add item" />}>
                  <Plus />
                </Tooltip>
              </button>
            </>
          ) : (
            <JobsPanelTableAddItemRow onClick={setAddNewVolume} text="volume" />
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="General">
        <Input
          label="Default input path"
          type="text"
          className="default-input"
          onChange={setInputPath}
          floatingLabel
        />
        <Input
          label="Default output path"
          type="text"
          className="default-input"
          onChange={setOutputPath}
          floatingLabel
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
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelDataInputsView

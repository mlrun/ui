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
  edit,
  handleAddNewItem,
  handleEditItems,
  inputs,
  match,
  newInput,
  newVolume,
  selectedVolume,
  setAddNewInput,
  setAddNewVolume,
  setInputPath,
  setNewInput,
  setOutputPath,
  setNewVolume,
  selectedDataInput,
  setSelectedDataInput,
  setSelectedVolume,
  volumes,
  volumeMounts
}) => {
  const volumeTypeNameLabel =
    newVolume.type === 'V3IO'
      ? 'Container'
      : newVolume.type === 'PVC'
      ? 'Claim name'
      : newVolume.type.length > 0
      ? `${newVolume.type} name`
      : ''

  return (
    <div className="job-panel__item">
      {!edit && <div className="item__overlay" />}
      <JobsPanelSection title="Data inputs">
        <JobsPanelTable
          addNewItem={addNewInput}
          className="data-inputs"
          content={inputs}
          handleEditItems={handleEditItems}
          headers={panelData['data-inputs']['table-headers']}
          match={match}
          section="data-inputs"
          selectedItem={selectedDataInput}
          setSelectedDataInput={setSelectedDataInput}
        >
          {addNewInput ? (
            <>
              <div className="input-row-wrapper">
                <Input
                  onChange={name => setNewInput({ ...newInput, name: name })}
                  label="Input name"
                  className="input-row__item"
                  floatingLabel
                  type="text"
                />
                <Input
                  onChange={path => setNewInput({ ...newInput, path: path })}
                  label="Input path"
                  className="input-row__item"
                  floatingLabel
                  type="text"
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
              <JobsPanelTableAddItemRow onClick={setAddNewInput} text="input" />
            )
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="Volumes">
        <JobsPanelTable
          addNewItem={addNewVolume}
          className="data-inputs volumes"
          content={volumeMounts}
          handleEditItems={handleEditItems}
          headers={panelData.volumes['table-headers']}
          match={match}
          section="volumes"
          selectedItem={selectedVolume}
          setSelectedVolume={setSelectedVolume}
          volumes={volumes}
        >
          {addNewVolume ? (
            <>
              <div className="input-row-wrapper no-border">
                <Input
                  onChange={name => setNewVolume({ ...newVolume, name: name })}
                  label="Name"
                  className="input-row__item"
                  floatingLabel
                  type="text"
                />
                <Input
                  onChange={path => setNewVolume({ ...newVolume, path: path })}
                  label="Path"
                  className="input-row__item"
                  floatingLabel
                  type="text"
                />
              </div>
              <div
                className={`input-row-wrapper ${newVolume.type === 'V3IO' &&
                  ' no-border'}`}
              >
                <Select
                  onClick={type => setNewVolume({ ...newVolume, type: type })}
                  option="volumeType"
                  label={newVolume.type.length > 0 ? newVolume.type : 'Type'}
                  match={match}
                />

                <Input
                  onChange={typeName =>
                    setNewVolume({ ...newVolume, typeName: typeName })
                  }
                  label={volumeTypeNameLabel}
                  className="input-row__item"
                  disabled={!newVolume.type.length > 0}
                  floatingLabel
                  type="text"
                />
              </div>
              {newVolume.type === 'V3IO' && (
                <div className="input-row-wrapper">
                  <Input
                    onChange={accessKey =>
                      setNewVolume({ ...newVolume, accessKey: accessKey })
                    }
                    label="Access Key"
                    className="input-row__item"
                    floatingLabel
                    type="text"
                  />
                  <Input
                    onChange={resourcesPath =>
                      setNewVolume({
                        ...newVolume,
                        resourcesPath: resourcesPath
                      })
                    }
                    label="Resource path"
                    className="input-row__item"
                    floatingLabel
                    type="text"
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
            edit && (
              <JobsPanelTableAddItemRow
                onClick={setAddNewVolume}
                text="volume"
              />
            )
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="General">
        <Input
          label="Default input path"
          className="default-input"
          onChange={setInputPath}
          floatingLabel
          type="text"
        />
        <Input
          label="Default output path"
          className="default-input"
          onChange={setOutputPath}
          floatingLabel
          type="text"
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelDataInputsView.propTypes = {
  addNewInput: PropTypes.bool.isRequired,
  addNewVolume: PropTypes.bool.isRequired,
  edit: PropTypes.bool.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  inputs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  newInput: PropTypes.shape({}).isRequired,
  newVolume: PropTypes.shape({}).isRequired,
  setAddNewInput: PropTypes.func.isRequired,
  setAddNewVolume: PropTypes.func.isRequired,
  setInputPath: PropTypes.func.isRequired,
  setNewInput: PropTypes.func.isRequired,
  setOutputPath: PropTypes.func.isRequired,
  setNewVolume: PropTypes.func.isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default JobsPanelDataInputsView

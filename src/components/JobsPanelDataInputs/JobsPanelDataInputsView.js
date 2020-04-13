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
  inputs,
  match,
  newInput,
  newVolume,
  setAddNewInput,
  setAddNewVolume,
  setInputPath,
  setNewInput,
  setOutputPath,
  setNewVolume,
  volumeMounts
}) => {
  return (
    <div className="job-panel__item">
      {!edit && <div className="item__overlay" />}
      <JobsPanelSection title="Data inputs">
        <JobsPanelTable
          headers={panelData['data-inputs']['table-headers']}
          addNewItem={addNewInput}
          content={inputs}
          className="data-inputs"
        >
          {addNewInput ? (
            <>
              <div className="input-row-wrapper">
                <Input
                  onChange={name => setNewInput({ ...newInput, name: name })}
                  label="Input name"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={path => setNewInput({ ...newInput, path: path })}
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
          className="data-inputs"
        >
          {addNewVolume ? (
            <>
              <div className="input-row-wrapper no-border">
                <Input
                  onChange={name => setNewVolume({ ...newVolume, name: name })}
                  label="Name"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
                <Input
                  onChange={path => setNewVolume({ ...newVolume, path: path })}
                  label="Path"
                  type="text"
                  className="input-row__item"
                  floatingLabel
                />
              </div>
              <div
                className={`input-row-wrapper${
                  newVolume.type === 'V3IO' ? ' no-border' : ''
                }`}
              >
                <Select
                  onClick={type => setNewVolume({ ...newVolume, type: type })}
                  option="volumeType"
                  label={newVolume.type.length > 0 ? newVolume.type : 'Type'}
                  match={match}
                />
                {newVolume.type.length > 0 && (
                  <Input
                    onChange={typeName =>
                      setNewVolume({ ...newVolume, typeName: typeName })
                    }
                    label={
                      newVolume.type === 'V3IO'
                        ? 'Container'
                        : newVolume.type === 'PVC'
                        ? 'Claim name'
                        : `${newVolume.type} name`
                    }
                    type="text"
                    className="input-row__item"
                    floatingLabel
                  />
                )}
              </div>
              {newVolume.type === 'V3IO' && (
                <div className="input-row-wrapper">
                  <Input
                    onChange={accessKey =>
                      setNewVolume({ ...newVolume, accessKey: accessKey })
                    }
                    label="Access Key"
                    type="text"
                    className="input-row__item"
                    floatingLabel
                  />
                  <Input
                    onChange={resourcesPath =>
                      setNewVolume({
                        ...newVolume,
                        resourcesPath: resourcesPath
                      })
                    }
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

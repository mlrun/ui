import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './editableVolumesRow.scss'

const EditableVolumesRow = ({
  content,
  handleEdit,
  selectedVolume,
  setSelectedVolume
}) => {
  return (
    <>
      <div className="table__row edit-row">
        <div className="table__cell">{selectedVolume.type.value}</div>
        {selectedVolume.isDefault ? (
          <div className="table__cell">{selectedVolume.data.name}</div>
        ) : (
          <div className="table__cell table__cell-input">
            <Input
              floatingLabel
              invalid={
                selectedVolume.newName !== selectedVolume.data.name &&
                isNameNotUnique(selectedVolume.newName, content)
              }
              invalidText="Name already exists"
              label="Name"
              onChange={name =>
                setSelectedVolume({
                  ...selectedVolume,
                  newName: name
                })
              }
              type="text"
              value={selectedVolume.newName ?? selectedVolume.data.name}
            />
          </div>
        )}
        <div className="table__cell table__cell-input">
          <Input
            floatingLabel
            label="Path"
            onChange={path =>
              setSelectedVolume({
                ...selectedVolume,
                data: { ...selectedVolume.data, mountPath: path }
              })
            }
            type="text"
            value={selectedVolume.data.mountPath}
          />
        </div>
        <div className="table__cell-actions" />
      </div>
      <div className="table__row edit-row flex-row">
        <div className="table__cell table__cell-input">
          <Input
            floatingLabel
            label="Container"
            onChange={typeName =>
              setSelectedVolume({
                ...selectedVolume,
                type: { ...selectedVolume.type, name: typeName }
              })
            }
            type="text"
            value={selectedVolume.type.name}
          />
        </div>
        <div className="table__cell table__cell-actions">
          <button
            className="apply-edit-btn"
            onClick={handleEdit}
            disabled={
              selectedVolume.newName !== selectedVolume.data.name &&
              isNameNotUnique(selectedVolume.newName, content)
            }
          >
            <Checkmark />
          </button>
        </div>
      </div>
      {selectedVolume.type.value === 'V3IO' && (
        <div className="table__row edit-row">
          <div className="table__cell table__cell-input">
            <Input
              floatingLabel
              label="Access Key"
              onChange={accessKey =>
                setSelectedVolume({
                  ...selectedVolume,
                  type: { ...selectedVolume.type, accessKey: accessKey }
                })
              }
              type="text"
              value={selectedVolume.type.accessKey}
            />
          </div>
          <div className="table__cell table__cell-input">
            <Input
              floatingLabel
              label="Resource Path"
              onChange={subPath =>
                setSelectedVolume({
                  ...selectedVolume,
                  type: { ...selectedVolume.type, subPath: subPath }
                })
              }
              type="text"
              value={selectedVolume.type.subPath}
            />
          </div>
          <div className="table__cell-actions" />
        </div>
      )}
    </>
  )
}

EditableVolumesRow.propTypes = {
  content: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  selectedVolume: PropTypes.shape({}).isRequired,
  setSelectedVolume: PropTypes.func.isRequired
}

export default EditableVolumesRow

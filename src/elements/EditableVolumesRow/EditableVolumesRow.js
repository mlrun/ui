import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { forEach } from 'lodash'

import Input from '../../common/Input/Input'

import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'
import {
  getVolumeTypeInput,
  isPathNotUnique,
  V3IO
} from '../VolumesTable/volumesTable.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './editableVolumesRow.scss'

const EditableVolumesRow = ({
  content,
  handleEdit,
  selectedVolume,
  setSelectedVolume
}) => {
  const volumeTypeInput = useMemo(
    () => getVolumeTypeInput(selectedVolume.type.value),
    [selectedVolume.type.value]
  )

  const isVolumeInvalid = selectedVolume => {
    forEach(selectedVolume.data, value => {
      if (!value) {
        return true
      }
    })
    forEach(selectedVolume.type, value => {
      if (!value) {
        return true
      }
    })
  }

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
              required
              requiredText="This field is required"
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
            invalid={
              selectedVolume.newPath !== selectedVolume.data.mountPath &&
              isPathNotUnique(selectedVolume.newPath, content)
            }
            invalidText="Multiple volumes cannot share the same path"
            onChange={path =>
              setSelectedVolume({
                ...selectedVolume,
                newPath: path
              })
            }
            required
            requiredText="This field is required"
            type="text"
            value={selectedVolume.newPath ?? selectedVolume.data.mountPath}
          />
        </div>
        <div className="table__cell-actions" />
      </div>
      <div className="table__row edit-row flex-row">
        <div className="table__cell table__cell-input">
          <Input
            floatingLabel
            label={volumeTypeInput.label}
            required
            requiredText="This field is required"
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
              (selectedVolume.newName !== selectedVolume.data.name &&
                isNameNotUnique(selectedVolume.newName, content)) ||
              (selectedVolume.newPath !== selectedVolume.data.mountPath &&
                isPathNotUnique(selectedVolume.newPath, content)) ||
              isVolumeInvalid(selectedVolume)
            }
          >
            <Checkmark />
          </button>
        </div>
      </div>
      {selectedVolume.type.value === V3IO && (
        <div className="table__row edit-row">
          <div className="table__cell table__cell-input">
            <Input
              floatingLabel
              label="Access Key"
              required
              requiredText="This field is required"
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
              required
              requiredText="This field is required"
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

import React, { useMemo, useState } from 'react'
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
  const [validation, setValidation] = useState({
    isNameValid: true,
    isTypeValid: true,
    isTypeNameValid: true,
    isPathValid: true,
    isAccessKeyValid: true
  })
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
                (selectedVolume.newName !== selectedVolume.data.name &&
                  isNameNotUnique(selectedVolume.newName, content)) ||
                !validation.isNameValid
              }
              invalidText={
                isNameNotUnique(selectedVolume.newName, content)
                  ? 'Name already exists'
                  : 'This field is invalid'
              }
              label="Volume Name"
              onChange={name =>
                setSelectedVolume({
                  ...selectedVolume,
                  newName: name
                })
              }
              required
              requiredText="This field is required"
              setInvalid={value =>
                setValidation(state => ({ ...state, isNameValid: value }))
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
              (selectedVolume.newPath !== selectedVolume.data.mountPath &&
                isPathNotUnique(selectedVolume.newPath, content)) ||
              !validation.isPathValid
            }
            invalidText={
              isPathNotUnique(selectedVolume.newPath, content)
                ? 'Multiple volumes cannot share the same path'
                : 'This field is invalid'
            }
            onChange={path =>
              setSelectedVolume({
                ...selectedVolume,
                newPath: path
              })
            }
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({ ...state, isPathValid: value }))
            }
            type="text"
            value={selectedVolume.newPath ?? selectedVolume.data.mountPath}
          />
        </div>
        <div className="table__cell-actions" />
      </div>
      <div className="table__row edit-row flex-row no-border_top">
        <div className="table__cell table__cell-input">
          <Input
            floatingLabel
            invalid={!validation.isTypeNameValid}
            invalidText="This field is invalid"
            label={volumeTypeInput.label}
            onChange={typeName =>
              setSelectedVolume({
                ...selectedVolume,
                type: { ...selectedVolume.type, name: typeName }
              })
            }
            required={selectedVolume.type.value !== V3IO}
            requiredText="This field is invalid"
            setInvalid={value =>
              setValidation(state => ({ ...state, isTypeNameValid: value }))
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
              isVolumeInvalid(selectedVolume) ||
              !validation.isNameValid ||
              !validation.isPathValid ||
              !validation.isTypeValid ||
              !validation.isTypeNameValid ||
              !validation.isAccessKeyValid
            }
          >
            <Checkmark />
          </button>
        </div>
      </div>
      {selectedVolume.type.value === V3IO && (
        <div className="table__row edit-row no-border_top">
          <div className="table__cell table__cell-input">
            <Input
              floatingLabel
              invalid={!validation.isAccessKeyValid}
              invalidText="This field is invalid"
              label="Access Key"
              onChange={accessKey =>
                setSelectedVolume({
                  ...selectedVolume,
                  type: { ...selectedVolume.type, accessKey: accessKey }
                })
              }
              required
              requiredText="This field is required"
              setInvalid={value =>
                setValidation(state => ({ ...state, isAccessKeyValid: value }))
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

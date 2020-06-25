import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './editableVolumesRow.scss'

const EditableVolumesRow = ({
  handleEdit,
  selectedVolume,
  setSelectedVolume
}) => {
  return (
    <>
      <div className="table__row edit-row">
        <div className="table__cell">
          <div className="data-ellipsis">{selectedVolume.data.name}</div>
        </div>
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
      <div className="table__row edit-row">
        <div className="table__cell">{selectedVolume.type.value}</div>
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
          <button className="apply-edit-btn" onClick={handleEdit}>
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
  handleEdit: PropTypes.func.isRequired,
  selectedVolume: PropTypes.shape({}).isRequired,
  setSelectedVolume: PropTypes.func.isRequired
}

export default EditableVolumesRow

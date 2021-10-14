import React, { useMemo } from 'react'
import { find, has, map } from 'lodash'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import EditableVolumesRow from '../EditableVolumesRow/EditableVolumesRow'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tip from '../../common/Tip/Tip'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import {
  getVolumeTypeInput,
  isPathNotUnique,
  selectTypeOptions,
  tableHeaders,
  V3IO
} from './volumesTable.util'
import { joinDataOfArrayOrObject } from '../../utils'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './volumesTable.scss'

const VolumesTableView = ({
  addVolume,
  className,
  editVolume,
  generateActionsMenu,
  newVolume,
  volumeMounts,
  resetVolumesData,
  selectedVolume,
  setNewVolume,
  setSelectedVolume,
  setShowAddNewVolumeRow,
  setValidation,
  showAddNewVolumeRow,
  validation
}) => {
  const volumeTypeInput = useMemo(() => getVolumeTypeInput(newVolume.type), [
    newVolume.type
  ])
  const tableClassNames = classnames(
    'new-item-side-panel__table',
    'volumes-table',
    showAddNewVolumeRow && 'no-border',
    className
  )
  const volumeTypeInputRowWrapperClassNames = classnames(
    'input-row-wrapper',
    newVolume.type === V3IO && 'no-border'
  )

  return (
    <div className={tableClassNames}>
      <div className="table__header table__row no-hover">
        {tableHeaders.map((header, index) => (
          <div className="table__cell" key={index}>
            {header.label}
          </div>
        ))}
        <div className="table__cell-actions" />
      </div>
      {volumeMounts?.map((contentItem, index) => {
        if (
          selectedVolume &&
          selectedVolume.data.name === contentItem.data.name
        ) {
          return (
            <EditableVolumesRow
              content={volumeMounts}
              handleEdit={editVolume}
              key={index}
              selectedVolume={selectedVolume}
              setSelectedVolume={setSelectedVolume}
            />
          )
        } else {
          return (
            <div className="table__row" key={index}>
              {map(contentItem.data, (value, property) => {
                const tableCellClassName = classnames(
                  'table__cell',
                  ((property === 'name' && has(contentItem.data, 'value')) ||
                    property === 'valueType') &&
                    contentItem.isDefault &&
                    'table__cell_disabled'
                )
                const tooltipClassNames = classnames(
                  property === 'name' && 'parameter-name'
                )

                return (
                  <div className={tableCellClassName} key={property}>
                    <Tooltip
                      className={tooltipClassNames}
                      template={
                        <TextTooltipTemplate
                          text={joinDataOfArrayOrObject(value, ', ')}
                        />
                      }
                    >
                      {joinDataOfArrayOrObject(value, ', ')}
                    </Tooltip>
                    {property === 'name' && contentItem.doc && (
                      <Tip text={contentItem.doc} />
                    )}
                  </div>
                )
              })}
              <div className="table__cell table__cell-actions">
                <ActionsMenu
                  menu={generateActionsMenu(contentItem)}
                  dataItem={contentItem}
                />
              </div>
            </div>
          )
        }
      })}
      {showAddNewVolumeRow ? (
        <div className="table__body">
          <div className="table__body-column">
            <div className="input-row-wrapper no-border">
              <Select
                onClick={type => {
                  setNewVolume(state => ({
                    ...state,
                    type: find(selectTypeOptions.volumeType, ['id', type]).id
                  }))
                  setValidation(state => ({
                    ...state,
                    isTypeValid: true,
                    isAccessKeyValid: true
                  }))
                }}
                options={selectTypeOptions.volumeType}
                selectedId={newVolume.type}
              />
              <Input
                className="input-row__item"
                floatingLabel
                invalid={
                  isNameNotUnique(newVolume.name, volumeMounts) ||
                  !validation.isNameValid
                }
                invalidText={
                  isNameNotUnique(newVolume.name, volumeMounts)
                    ? 'Name already exists'
                    : 'This field is invalid'
                }
                label="Volume Name"
                onChange={name => setNewVolume(state => ({ ...state, name }))}
                required
                requiredText="This field is required"
                setInvalid={value =>
                  setValidation(state => ({ ...state, isNameValid: value }))
                }
                type="text"
              />
              <Input
                className="input-row__item input-row__item_edit"
                floatingLabel
                invalid={
                  isPathNotUnique(newVolume.path, volumeMounts) ||
                  !validation.isPathValid
                }
                invalidText={
                  isPathNotUnique(newVolume.path, volumeMounts)
                    ? 'Multiple volumes cannot share the same path'
                    : 'This field is invalid'
                }
                label="Path"
                onChange={path => setNewVolume(state => ({ ...state, path }))}
                required
                requiredText="This field is required"
                setInvalid={value =>
                  setValidation(state => ({ ...state, isPathValid: value }))
                }
                tip="A mount path for referencing the data from the function"
                type="text"
              />
            </div>
            <div className={volumeTypeInputRowWrapperClassNames}>
              <Input
                className="input-row__item"
                disabled={newVolume.type.length === 0}
                floatingLabel
                invalid={!validation.isTypeNameValid}
                label={volumeTypeInput.label}
                onChange={typeName =>
                  setNewVolume(state => ({ ...state, typeName }))
                }
                required={newVolume.type !== V3IO}
                requiredText="This field is required"
                setInvalid={value =>
                  setValidation(state => ({ ...state, isTypeNameValid: value }))
                }
                tip={volumeTypeInput.tip}
                type="text"
              />
              {newVolume.type === V3IO && (
                <Input
                  className="input-row__item"
                  floatingLabel
                  invalid={!validation.isAccessKeyValid}
                  label="Access Key"
                  onChange={accessKey =>
                    setNewVolume(state => ({ ...state, accessKey }))
                  }
                  required
                  requiredText="This field is required"
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isAccessKeyValid: value
                    }))
                  }
                  tip="A platform data-access key"
                  type="text"
                />
              )}
            </div>
            {newVolume.type === V3IO && (
              <div className="input-row-wrapper">
                <Input
                  className="input-row__item"
                  floatingLabel
                  label="Resource path"
                  onChange={subPath =>
                    setNewVolume(state => ({ ...state, subPath }))
                  }
                  tip="A relative directory path within the data container"
                  type="text"
                />
              </div>
            )}
          </div>
          <button
            className="btn-add"
            disabled={
              isNameNotUnique(newVolume.name, volumeMounts) ||
              isPathNotUnique(newVolume.path, volumeMounts)
            }
            onClick={addVolume}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
          <button onClick={resetVolumesData}>
            <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
              <Delete />
            </Tooltip>
          </button>
        </div>
      ) : (
        <div className="table__row no-hover">
          <div
            className="table__cell"
            onClick={() => setShowAddNewVolumeRow(true)}
          >
            <button className="add-input">
              <Plus />
              Add volume
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

VolumesTableView.propTypes = {
  addVolume: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  editVolume: PropTypes.func.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  newVolume: PropTypes.shape({}).isRequired,
  volumeMounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  resetVolumesData: PropTypes.func.isRequired,
  selectedVolume: PropTypes.shape({}),
  setNewVolume: PropTypes.func.isRequired,
  setSelectedVolume: PropTypes.func.isRequired,
  setShowAddNewVolumeRow: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showAddNewVolumeRow: PropTypes.bool.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default VolumesTableView

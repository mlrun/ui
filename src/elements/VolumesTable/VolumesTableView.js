/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useMemo } from 'react'
import { find, has, map } from 'lodash'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import EditableVolumesRow from '../EditableVolumesRow/EditableVolumesRow'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import {
  getVolumeTypeInput,
  isNameNotUnique,
  isPathNotUnique,
  selectTypeOptions,
  tableHeaders,
  V3IO
} from './volumesTable.util'
import { joinDataOfArrayOrObject } from '../../utils'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

import './volumesTable.scss'

const VolumesTableView = ({
  addVolume,
  className,
  editVolume,
  generateActionsMenu,
  isPanelEditMode,
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
  const volumeTypeInput = useMemo(() => getVolumeTypeInput(newVolume.type), [newVolume.type])
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

  const addVolumeButtonClassNames = classnames(isPanelEditMode && 'disabled', 'add-input')

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
          selectedVolume.data.name === contentItem.data.name &&
          !isPanelEditMode
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
                const tooltipClassNames = classnames(property === 'name' && 'parameter-name')

                return (
                  <div className={tableCellClassName} key={property}>
                    <Tooltip
                      className={tooltipClassNames}
                      template={<TextTooltipTemplate text={joinDataOfArrayOrObject(value, ', ')} />}
                    >
                      {joinDataOfArrayOrObject(value, ', ')}
                    </Tooltip>
                    {property === 'name' && contentItem.doc && <Tip text={contentItem.doc} />}
                  </div>
                )
              })}
              {!isPanelEditMode && (
                <div className="table__cell table__cell-actions">
                  <ActionsMenu menu={generateActionsMenu(contentItem)} dataItem={contentItem} />
                </div>
              )}
            </div>
          )
        }
      })}
      {showAddNewVolumeRow && !isPanelEditMode ? (
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
                invalid={isNameNotUnique(newVolume.name, volumeMounts) || !validation.isNameValid}
                invalidText={
                  isNameNotUnique(newVolume.name, volumeMounts)
                    ? 'Name already exists'
                    : 'This field is invalid'
                }
                label="Volume Name"
                onChange={name => setNewVolume(state => ({ ...state, name }))}
                required
                requiredText="This field is required"
                setInvalid={value => setValidation(state => ({ ...state, isNameValid: value }))}
                type="text"
              />
              <Input
                className="input-row__item input-row__item_edit"
                floatingLabel
                invalid={isPathNotUnique(newVolume.path, volumeMounts) || !validation.isPathValid}
                invalidText={
                  isPathNotUnique(newVolume.path, volumeMounts)
                    ? 'Multiple volumes cannot share the same path'
                    : 'This field is invalid'
                }
                label="Path"
                onChange={path => setNewVolume(state => ({ ...state, path }))}
                required
                requiredText="This field is required"
                setInvalid={value => setValidation(state => ({ ...state, isPathValid: value }))}
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
                onChange={typeName => setNewVolume(state => ({ ...state, typeName }))}
                required={newVolume.type !== V3IO}
                requiredText="This field is required"
                setInvalid={value => setValidation(state => ({ ...state, isTypeNameValid: value }))}
                tip={volumeTypeInput.tip}
                type="text"
              />
              {newVolume.type === V3IO && (
                <Input
                  className="input-row__item"
                  floatingLabel
                  invalid={!validation.isAccessKeyValid}
                  label="Access Key"
                  onChange={accessKey => setNewVolume(state => ({ ...state, accessKey }))}
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
                  onChange={subPath => setNewVolume(state => ({ ...state, subPath }))}
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
            onClick={() => !isPanelEditMode && setShowAddNewVolumeRow(true)}
          >
            <button className={addVolumeButtonClassNames}>
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
  isPanelEditMode: PropTypes.bool.isRequired,
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

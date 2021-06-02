import React from 'react'
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

import { selectTypeOptions, tableHeaders } from './volumesTable.util'
import { joinDataOfArrayOrObject } from '../../utils'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Plus } from '../../images/plus.svg'

import './volumesTable.scss'

const VolumesTableView = ({
  addVolume,
  className,
  editVolume,
  generateActionsMenu,
  newVolume,
  volumeMounts,
  selectedVolume,
  setNewVolume,
  setSelectedVolume,
  setShowAddNewVolumeRow,
  showAddNewVolumeRow
}) => {
  const volumeTypeNameLabel =
    newVolume.type === 'V3IO'
      ? 'Container'
      : newVolume.type === 'PVC'
      ? 'Claim name'
      : newVolume.type.length > 0
      ? `${newVolume.type} name`
      : ''
  const tableClassNames = classnames(
    'new-item-side-panel__table',
    'volumes-table',
    showAddNewVolumeRow && 'no-border',
    className
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
              <Input
                onChange={name => setNewVolume(state => ({ ...state, name }))}
                label="Name"
                className="input-row__item"
                floatingLabel
                required={isNameNotUnique(newVolume.name, volumeMounts)}
                requiredText="Name already exists"
                type="text"
              />
              <Input
                onChange={path => setNewVolume(state => ({ ...state, path }))}
                label="Path"
                className="input-row__item input-row__item_edit"
                floatingLabel
                type="text"
              />
            </div>
            <div
              className={`input-row-wrapper
                  ${newVolume.type === 'V3IO' && 'no-border'}`}
            >
              <Select
                onClick={type => {
                  setNewVolume(state => ({
                    ...state,
                    type: find(selectTypeOptions.volumeType, ['id', type]).id
                  }))
                }}
                options={selectTypeOptions.volumeType}
                label={newVolume.type.length ? newVolume.type : 'Type'}
              />
              <Input
                onChange={typeName =>
                  setNewVolume(state => ({ ...state, typeName }))
                }
                label={volumeTypeNameLabel}
                className="input-row__item input-row__item_edit"
                disabled={newVolume.type.length === 0}
                floatingLabel
                type="text"
              />
            </div>
            {newVolume.type === 'V3IO' && (
              <div className="input-row-wrapper">
                <Input
                  onChange={accessKey =>
                    setNewVolume(state => ({ ...state, accessKey }))
                  }
                  label="Access Key"
                  className="input-row__item"
                  floatingLabel
                  type="text"
                />
                <Input
                  onChange={subPath =>
                    setNewVolume(state => ({ ...state, subPath }))
                  }
                  label="Resource path"
                  className="input-row__item input-row__item_edit"
                  floatingLabel
                  type="text"
                />
              </div>
            )}
          </div>
          <button
            className="add-input btn-add"
            disabled={isNameNotUnique(newVolume.name, volumeMounts)}
            onClick={addVolume}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
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
  selectedVolume: PropTypes.shape({}),
  setNewVolume: PropTypes.func.isRequired,
  setSelectedVolume: PropTypes.func.isRequired,
  setShowAddNewVolumeRow: PropTypes.func.isRequired,
  showAddNewVolumeRow: PropTypes.bool.isRequired
}

export default VolumesTableView

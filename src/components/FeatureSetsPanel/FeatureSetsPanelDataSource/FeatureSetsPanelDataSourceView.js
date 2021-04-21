import React from 'react'
import PropTypes from 'prop-types'
import cronstrue from 'cronstrue'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'
import { FeatureSetsPanelDataSourceTable } from '../FeatureSetsPanelDataSourceTable/FeatureSetsPanelDataSourceTable'
import Button from '../../../common/Button/Button'
import ScheduleFeatureSet from '../ScheduleFeatureSet/ScheduleFeatureSet'

import { kindOptions, tableHeaders } from './featureSetsPanelDataSource.util'

import { ReactComponent as Pencil } from '../../../images/edit.svg'

import './featureSetsPanelDataSource.scss'

const FeatureSetsPanelDataSourceView = ({
  addNewItem,
  data,
  handleAddNewItem,
  handleUrlOnBlur,
  handleUrlOnChange,
  isAttributeNameValid,
  isUrlValid,
  setAddNewItem,
  setData,
  setNewFeatureSetDataSourceKey,
  setNewFeatureSetDataSourceKind,
  setNewFeatureSetDataSourceTime,
  setShowSchedule,
  showSchedule,
  setNewFeatureSetSchedule
}) => {
  const httpKind = 'http'
  return (
    <div className="feature-set-panel__item new-item-side-panel__item data-source">
      <FeatureSetsPanelSection title="Data Source">
        <div className="data-source__inputs">
          <Select
            className="data-source__inputs-item"
            floatingLabel
            label="Kind"
            onClick={kind => {
              setNewFeatureSetDataSourceKind(kind)
              setData(state => ({
                ...state,
                kind
              }))
            }}
            options={kindOptions}
            selectedId={data.kind}
          />
          <Input
            className="data-source__inputs-item data-source__inputs-item_url"
            floatingLabel
            label="URL"
            onBlur={handleUrlOnBlur}
            onChange={handleUrlOnChange}
            required={!isUrlValid}
            requiredText="URL is required"
            type="text"
            value={data.url}
            wrapperClassName="inputs-item-wrapper"
          />
          <Input
            className="data-source__inputs-item"
            floatingLabel
            label="Key field"
            onBlur={event => {
              setNewFeatureSetDataSourceKey(event.target.value)
            }}
            onChange={key => {
              setData(state => ({
                ...state,
                key
              }))
            }}
            type="text"
            value={data.key}
            wrapperClassName="inputs-item-wrapper"
          />
          <Input
            className="data-source__inputs-item"
            floatingLabel
            label="Time field"
            onBlur={event => {
              setNewFeatureSetDataSourceTime(event.target.value)
            }}
            onChange={time => {
              setData(state => ({
                ...state,
                time
              }))
            }}
            type="text"
            value={data.time}
            wrapperClassName="inputs-item-wrapper"
          />
        </div>
        {data.kind !== httpKind && (
          <div className="schedule-content">
            <Button
              className="schedule-tumbler"
              label={
                <>
                  {data.schedule
                    ? cronstrue.toString(data.schedule)
                    : 'Schedule'}
                  <Pencil className="schedule-tumbler__icon" />
                </>
              }
              onClick={() => setShowSchedule(state => !state)}
              variant="secondary"
            />
            {showSchedule && (
              <ScheduleFeatureSet
                setNewFeatureSetSchedule={cron => {
                  setNewFeatureSetSchedule(cron)
                  setData(state => ({ ...state, schedule: cron }))
                }}
                setShowSchedule={setShowSchedule}
              />
            )}
          </div>
        )}
        <FeatureSetsPanelDataSourceTable
          addNewItem={addNewItem}
          className="data-source__table"
          content={data.attributes}
          handleAddNewItem={handleAddNewItem}
          headers={tableHeaders}
          isAttributeNameValid={isAttributeNameValid}
          setAddNewItem={setAddNewItem}
          setNewItemName={key => {
            setData(state => ({
              ...state,
              newAttribute: {
                ...state.newAttribute,
                key
              }
            }))
          }}
          setNewItemValue={value => {
            setData(state => ({
              ...state,
              newAttribute: {
                ...state.newAttribute,
                value
              }
            }))
          }}
        />
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelDataSourceView.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  data: PropTypes.shape({}).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleUrlOnBlur: PropTypes.func.isRequired,
  handleUrlOnChange: PropTypes.func.isRequired,
  isAttributeNameValid: PropTypes.bool.isRequired,
  isUrlValid: PropTypes.bool.isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDataSourceKey: PropTypes.func.isRequired,
  setNewFeatureSetDataSourceKind: PropTypes.func.isRequired,
  setNewFeatureSetDataSourceTime: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired,
  setNewFeatureSetSchedule: PropTypes.func.isRequired
}

export default FeatureSetsPanelDataSourceView

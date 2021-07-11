import React from 'react'
import PropTypes from 'prop-types'
import cronstrue from 'cronstrue'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'
import Button from '../../../common/Button/Button'
import ScheduleFeatureSet from '../ScheduleFeatureSet/ScheduleFeatureSet'
import KeyValueTable from '../../../common/KeyValueTable/KeyValueTable'

import { kindOptions } from './featureSetsPanelDataSource.util'

import { ReactComponent as Pencil } from '../../../images/edit.svg'

import './featureSetsPanelDataSource.scss'

const FeatureSetsPanelDataSourceView = ({
  data,
  handleAddNewItem,
  handleDeleteAttribute,
  handleEditAttribute,
  handleKindOnChange,
  handleUrlOnBlur,
  handleUrlOnChange,
  isUrlValid,
  setData,
  setShowSchedule,
  showSchedule,
  setNewFeatureSetSchedule
}) => {
  // const httpKind = 'http', disabling temporarily until backend supports scheduling
  return (
    <div className="feature-set-panel__item new-item-side-panel__item data-source">
      <FeatureSetsPanelSection title="Data Source">
        <div className="data-source__inputs">
          <Select
            className="data-source__inputs-item"
            density="medium"
            floatingLabel
            label="Kind"
            onClick={handleKindOnChange}
            options={kindOptions}
            selectedId={data.kind}
          />
          <Input
            className="data-source__inputs-item"
            floatingLabel
            invalid={!isUrlValid}
            invalidText="URL is invalid"
            label="URL"
            onBlur={handleUrlOnBlur}
            onChange={handleUrlOnChange}
            required
            requiredText="URL is required"
            tip="For Parquet files the path could be either a file or a folder. For CSV it must be a file."
            type="text"
            value={data.url}
            wrapperClassName="url"
          />
        </div>
        {false && ( // was: data.kind !== httpKind, disabling temporarily until backend supports scheduling
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
        <p>
          Users can add attributes to be used for various operations on the
          source data.
        </p>
        <KeyValueTable
          addNewItem={handleAddNewItem}
          addNewItemLabel="Add variable"
          className="data-source__table"
          content={data.attributes}
          deleteItem={handleDeleteAttribute}
          editItem={handleEditAttribute}
          keyHeader="Attribute name"
          keyLabel="Name"
          valueHeader="Value"
          valueLabel="Value"
          withEditMode
        />
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelDataSourceView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteAttribute: PropTypes.func.isRequired,
  handleEditAttribute: PropTypes.func.isRequired,
  handleKindOnChange: PropTypes.func.isRequired,
  handleUrlOnBlur: PropTypes.func.isRequired,
  handleUrlOnChange: PropTypes.func.isRequired,
  isUrlValid: PropTypes.bool.isRequired,
  setData: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired,
  setNewFeatureSetSchedule: PropTypes.func.isRequired
}

export default FeatureSetsPanelDataSourceView

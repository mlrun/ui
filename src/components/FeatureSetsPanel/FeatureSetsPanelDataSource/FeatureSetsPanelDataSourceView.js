import React from 'react'
import PropTypes from 'prop-types'
import cronstrue from 'cronstrue'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'
import Button from '../../../common/Button/Button'
import ScheduleFeatureSet from '../ScheduleFeatureSet/ScheduleFeatureSet'
import Combobox from '../../../common/Combobox/Combobox'

import {
  comboboxSelectList,
  CSV,
  END_TIME,
  kindOptions,
  PARQUET,
  START_TIME,
  TIME_FIELD
} from './featureSetsPanelDataSource.util'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../../constants'
import { pathPlaceholders } from '../../../utils/panelPathScheme'
import { ReactComponent as Pencil } from '../../../images/edit.svg'

import './featureSetsPanelDataSource.scss'

const FeatureSetsPanelDataSourceView = ({
  comboboxMatches,
  data,
  featureStore,
  handleFilterParametersOnBlur,
  handleKindOnChange,
  handleUrlOnBlur,
  handleUrlPathTypeChange,
  handleUrlPathChange,
  setData,
  setNewFeatureSetDataSourceParseDates,
  setShowSchedule,
  setValidation,
  showSchedule,
  setNewFeatureSetSchedule,
  urlProjectItemTypeEntered,
  validation
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
          <Combobox
            comboboxClassName="url"
            hideSearchInput={!urlProjectItemTypeEntered}
            inputDefaultValue={
              data.url.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
                ? data.url.projectItemType
                : ''
            }
            inputOnChange={path => {
              handleUrlPathChange(path)
            }}
            inputPlaceholder={data.url.placeholder}
            invalid={!validation.isUrlValid}
            invalidText={`Field must be in "${
              pathPlaceholders[data.url.pathType]
            }" format`}
            matches={comboboxMatches}
            maxSuggestedMatches={3}
            onBlur={handleUrlOnBlur}
            required
            requiredText="This field is required"
            selectDropdownList={comboboxSelectList}
            selectOnChange={path => {
              handleUrlPathTypeChange(path)
            }}
            selectPlaceholder="URL"
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
        <p className="data-source__description">
          Users can add the following parameters to filter the data. using start
          time and end time filter the selected time "between" those two fields.
        </p>
        {data.kind === CSV && (
          <Input
            className="data-source__inputs-item"
            floatingLabel
            label="Parse Dates"
            onBlur={event => {
              if (
                featureStore.newFeatureSet.spec.source.parse_dates !==
                event.target.value
              ) {
                setNewFeatureSetDataSourceParseDates(event.target.value)
              }
            }}
            onChange={parseDates =>
              setData(state => ({
                ...state,
                parseDates
              }))
            }
            placeholder="col_name1,col_name2,..."
            type="text"
          />
        )}
        {data.kind === PARQUET && (
          <FeatureSetsPanelSection title="Filter Parameters">
            <span className="data-source__description">
              Users can add the following parameters to filter the data.
            </span>
            <div className="data-source__inputs-container">
              <Input
                className="data-source__inputs-item"
                floatingLabel
                invalid={!validation.isTimeFieldValid}
                invalidText="Timestamp key is invalid"
                label="Timestamp column"
                onBlur={event =>
                  handleFilterParametersOnBlur(event, TIME_FIELD)
                }
                onChange={value =>
                  setData(state => ({
                    ...state,
                    [TIME_FIELD]: value
                  }))
                }
                required={Boolean(
                  data.timeField.length > 0 ||
                    data.startTime.length > 0 ||
                    data.endTime.length > 0
                )}
                requiredText="Timestamp key is required"
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isTimeFieldValid: value
                  }))
                }
                tip="The field name for filtering the source data."
                type="text"
                value={data.timeField}
              />
              <Input
                className="data-source__inputs-item"
                floatingLabel
                invalid={!validation.isStartTimeValid}
                invalidText="Start time is invalid"
                label="Start time"
                onBlur={event =>
                  handleFilterParametersOnBlur(event, START_TIME)
                }
                onChange={value =>
                  setData(state => ({
                    ...state,
                    [START_TIME]: value
                  }))
                }
                required={Boolean(
                  (data.timeField.length > 0 || data.startTime.length > 0) &&
                    data.endTime.length === 0
                )}
                requiredText="Start time is required"
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isStartTimeValid: value
                  }))
                }
                tip="Filter data by start date >= value"
                type="text"
                value={data.startTime}
              />
              <Input
                className="data-source__inputs-item"
                floatingLabel
                invalid={!validation.isEndTimeValid}
                invalidText="End time is invalid"
                label="End time"
                onBlur={event => handleFilterParametersOnBlur(event, END_TIME)}
                onChange={value =>
                  setData(state => ({
                    ...state,
                    [END_TIME]: value
                  }))
                }
                required={Boolean(
                  (data.timeField.length > 0 || data.endTime.length > 0) &&
                    data.startTime.length === 0
                )}
                requiredText="End time is required"
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isEndTimeValid: value
                  }))
                }
                tip="Filter data by start date <= value"
                type="text"
                value={data.endTime}
              />
            </div>
          </FeatureSetsPanelSection>
        )}
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelDataSourceView.propTypes = {
  comboboxMatches: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  data: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  handleFilterParametersOnBlur: PropTypes.func.isRequired,
  handleKindOnChange: PropTypes.func.isRequired,
  handleUrlOnBlur: PropTypes.func.isRequired,
  handleUrlPathTypeChange: PropTypes.func.isRequired,
  handleUrlPathChange: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDataSourceParseDates: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired,
  setNewFeatureSetSchedule: PropTypes.func.isRequired,
  urlProjectItemTypeEntered: PropTypes.bool.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelDataSourceView

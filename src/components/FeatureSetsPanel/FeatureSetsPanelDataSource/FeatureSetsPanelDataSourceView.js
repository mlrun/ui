import React from 'react'
import PropTypes from 'prop-types'
import cronstrue from 'cronstrue'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'
import Button from '../../../common/Button/Button'
import ScheduleFeatureSet from '../ScheduleFeatureSet/ScheduleFeatureSet'
import Combobox from '../../../common/Combobox/Combobox'
import FilterParameters from './FilterParameters'

import {
  comboboxSelectList,
  CSV,
  kindOptions,
  PARQUET
} from './featureSetsPanelDataSource.util'
import {
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  SECONDARY_BUTTON
} from '../../../constants'
import { pathPlaceholders } from '../../../utils/panelPathScheme'

import { ReactComponent as Pencil } from '../../../images/edit.svg'

import './featureSetsPanelDataSource.scss'

const FeatureSetsPanelDataSourceView = ({
  comboboxMatches,
  data,
  featureStore,
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
        {data.kind !== CSV && (
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
              variant={SECONDARY_BUTTON}
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
          <FilterParameters
            setValidation={setValidation}
            validation={validation}
          />
        )}
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelDataSourceView.propTypes = {
  comboboxMatches: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  data: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  handleKindOnChange: PropTypes.func.isRequired,
  handleUrlOnBlur: PropTypes.func.isRequired,
  handleUrlPathTypeChange: PropTypes.func.isRequired,
  handleUrlPathChange: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDataSourceParseDates: PropTypes.func.isRequired,
  setNewFeatureSetSchedule: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired,
  urlProjectItemTypeEntered: PropTypes.bool.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelDataSourceView

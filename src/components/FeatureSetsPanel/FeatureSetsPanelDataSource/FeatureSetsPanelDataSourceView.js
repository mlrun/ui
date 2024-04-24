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
import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import FilterParameters from './FilterParameters'
import Input from '../../../common/Input/Input'
import ScheduleFeatureSet from '../ScheduleFeatureSet/ScheduleFeatureSet'
import Select from '../../../common/Select/Select'
import UrlPath from '../UrlPath'
import { Button } from 'igz-controls/components'

import { CSV, kindOptions, PARQUET } from './featureSetsPanelDataSource.util'
import { comboboxSelectList } from '../UrlPath.utils'
import { SECONDARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Pencil } from 'igz-controls/images/edit.svg'

import './featureSetsPanelDataSource.scss'

const FeatureSetsPanelDataSourceView = ({
  data,
  featureStore,
  handleKindOnChange,
  handleUrlInputOnChange,
  handleUrlOnApply,
  handleUrlOnEditModeChange,
  handleUrlSelectOnChange,
  setData,
  setNewFeatureSetDataSourceParseDates,
  setNewFeatureSetSchedule,
  setShowSchedule,
  setValidation,
  showSchedule,
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
          <UrlPath
            comboboxSelectList={comboboxSelectList}
            handleUrlInputOnChange={handleUrlInputOnChange}
            handleUrlOnApply={handleUrlOnApply}
            handleUrlOnEditModeChange={handleUrlOnEditModeChange}
            handleUrlSelectOnChange={handleUrlSelectOnChange}
            invalid={!validation.isUrlValid}
            previewClassName={'data-source'}
            withActionButtons
          />
        </div>
        {data.kind !== CSV && (
          <div className="schedule-content">
            <Button
              className="schedule-tumbler"
              label={
                <>
                  {data.schedule ? 'View schedule' : 'Set schedule'}
                  <Pencil className="schedule-tumbler__icon" />
                </>
              }
              onClick={() => setShowSchedule(state => !state)}
              variant={SECONDARY_BUTTON}
            />
            {showSchedule && (
              <ScheduleFeatureSet
                defaultCron={data.schedule}
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
            invalid={!validation.isParseDatesValid}
            label="Parse Dates"
            onBlur={event => {
              if (featureStore.newFeatureSet.spec.source.parse_dates !== event.target.value) {
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
            setInvalid={value => setValidation(state => ({ ...state, isParseDatesValid: value }))}
            type="text"
          />
        )}
        {data.kind === PARQUET && (
          <FilterParameters setValidation={setValidation} validation={validation} />
        )}
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelDataSourceView.defaultProps = {
  handleUrlSelectOnChange: null
}

FeatureSetsPanelDataSourceView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  handleKindOnChange: PropTypes.func.isRequired,
  handleUrlInputOnChange: PropTypes.func.isRequired,
  handleUrlOnApply: PropTypes.func.isRequired,
  handleUrlOnEditModeChange: PropTypes.func.isRequired,
  handleUrlSelectOnChange: PropTypes.func,
  setData: PropTypes.func.isRequired,
  setNewFeatureSetDataSourceParseDates: PropTypes.func.isRequired,
  setNewFeatureSetSchedule: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showSchedule: PropTypes.bool.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelDataSourceView
